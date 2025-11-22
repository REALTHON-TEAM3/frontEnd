"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./voiceChef.module.css";
import { useRouter } from "next/navigation";

export default function VoiceChef() {
  // -------------------------------
  // Lottie JSON (현재는 사용 X)
  // -------------------------------
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/voicemotion.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  // -------------------------------
  // UI 상태
  // -------------------------------
  const [status, setStatus] = useState("Ready");
  const [logList, setLogList] = useState<string[]>([]);
  const [timerText, setTimerText] = useState("00:00");
  const [timerVisible, setTimerVisible] = useState(false);

  const [startDisabled, setStartDisabled] = useState(false);

  // -------------------------------
  // 오디오/WS 관련 Ref
  // -------------------------------
  const ws = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const inputSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const nextStartTime = useRef(0);
  const timerInterval = useRef<number | null>(null);

  const log = (msg: string) => {
    setLogList((prev) => [...prev, msg]);
  };

  // -------------------------------
  // STOP SESSION (전역)
  // -------------------------------
  const stopSession = () => {
    setStartDisabled(false);
    setStatus("Stopped");
    setTimerVisible(false);

    if (timerInterval.current !== null) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    processor.current?.disconnect();
    inputSource.current?.disconnect();
    audioContext.current?.close();

    ws.current?.close();

    processor.current = null;
    inputSource.current = null;
    audioContext.current = null;
    ws.current = null;
  };

  // -------------------------------
  // Timer (UI 표시 & 카운트다운)
  // -------------------------------
  const updateTimerDisplay = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    setTimerText(`${m}:${s}`);
  };

  const startCountdown = (duration: number) => {
    setTimerVisible(true);
    let t = duration;

    if (timerInterval.current !== null) {
      clearInterval(timerInterval.current);
    }

    updateTimerDisplay(t);

    timerInterval.current = window.setInterval(() => {
      t--;
      updateTimerDisplay(t);

      if (t <= 0) {
        clearInterval(timerInterval.current!);
        timerInterval.current = null;

        setTimerText("Done!");
        setTimeout(() => setTimerVisible(false), 3000);
      }
    }, 1000);
  };

  // -------------------------------
  // 음성 입력 처리
  // -------------------------------
  const startAudio = async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new AudioContext({ sampleRate: 24000 });
      }
      if (audioContext.current.state === "suspended") {
        await audioContext.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 24000, echoCancellation: true },
      });

      setStatus("Listening... (Speak now)");

      inputSource.current =
        audioContext.current.createMediaStreamSource(stream);
      processor.current = audioContext.current.createScriptProcessor(
        4096,
        1,
        1
      );

      processor.current.onaudioprocess = (e) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        const input = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        ws.current.send(pcm.buffer);
      };

      inputSource.current.connect(processor.current);
      processor.current.connect(audioContext.current.destination);
    } catch (err) {
      log("Audio Error: " + err);
      stopSession();
    }
  };

  // -------------------------------
  // 서버 TTS 오디오 재생
  // -------------------------------
  const playAudio = (base64: string) => {
    if (!audioContext.current) return;

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);

    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 0x8000;
    }

    const buffer = audioContext.current.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = audioContext.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.current.destination);

    const now = audioContext.current.currentTime;
    if (nextStartTime.current < now) nextStartTime.current = now;

    source.start(nextStartTime.current);
    nextStartTime.current += buffer.duration;

    source.onended = () => {
      if (audioContext.current!.currentTime >= nextStartTime.current) {
        setStatus("Listening...");
      }
    };
  };

  // -------------------------------
  // WebSocket 연결 + 오디오 전송
  // -------------------------------
  const startSession = async () => {
    setStartDisabled(true);
    setStatus("Connecting...");

    ws.current = new WebSocket(
      `https://port-0-demo-mi8wa6bu1d5765dc.sel3.cloudtype.app/ws`
    );
    ws.current.binaryType = "arraybuffer";

    ws.current.onopen = async () => {
      log("Connected to Server");
      setStatus("Connected. Initializing Audio...");
      await startAudio();
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "audio") {
        playAudio(data.data);
      } else if (data.type === "text") {
        log("Chef: " + data.data);
      } else if (data.type === "timer_start") {
        startCountdown(data.seconds);
      } else if (data.type === "timer_done") {
        speakAlert(data.message);
      }
    };

    ws.current.onclose = () => {
      log("Connection closed");
      stopSession();
    };
  };

  // -------------------------------
  // 알림 음성(TTS)
  // -------------------------------
  const speakAlert = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    window.speechSynthesis.speak(u);
  };

  // -------------------------------
  // UI 렌더링
  // -------------------------------
  return (
    <div className={styles.container}>
      {!startDisabled && (
        <div className={styles.holder}>요리할 준비가 되었다면?</div>
      )}
      {timerVisible && <div className={styles.timer}>{timerText}</div>}

      {!startDisabled && (
        <Image
          onClick={startSession}
          src="/aiButton.svg"
          alt=""
          width={0}
          height={0}
          loading="eager"
          style={{
            marginTop: "3rem",
            width: "20rem",
            height: "auto",
          }}
          className={styles.centerImage}
        />
      )}
      {startDisabled && (
        <>
          <Image
            src="/aigif.gif"
            alt=""
            width={0}
            height={0}
            className={styles.heartbeat}
            style={{ marginTop: "0rem", width: "20rem", height: "auto" }}
          ></Image>
        </>
      )}
      <Image
        onClick={() => {
          router.push("/result");
          ws.current?.close();
          processor.current?.disconnect();
          inputSource.current?.disconnect();
          audioContext.current?.close();
        }}
        src="/stop.svg"
        alt=""
        width={0}
        height={0}
        className={styles.fixedStop}
        style={{ width: "12rem", height: "auto" }}
      ></Image>
    </div>
  );
}
