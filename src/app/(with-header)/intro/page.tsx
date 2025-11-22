"use client";

import Image from "next/image";
import style from "./page.module.css";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "@/app/context/appContext";
import { useRouter } from "next/navigation";
import IsLoading from "../../../../components/isLoading";

export default function Page() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context = useContext(AppContext)!;
  const { globalData, setGlobalData } = context;
  // const [isClicked, setIsClicked] = useState(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onButtonClick = async () => {
    setLoading(true);
    if (input.startsWith("http") || input.startsWith("https")) {
      try {
        const res1 = await fetch(
          "https://port-0-demo-mi8wa6bu1d5765dc.sel3.cloudtype.app/ingredients/link",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: input }),
          }
        );

        const res2 = await fetch(
          "https://port-0-demo-mi8wa6bu1d5765dc.sel3.cloudtype.app/youtube-recipe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ video_url: input }),
          }
        );

        const recipe = await res1.json();
        const time = await res2.json();
        setGlobalData({ recipe: recipe, time: time });
        console.log("전체 응답:", recipe);
        console.log("조리 시간 응답:", time);
      } catch (err) {
        console.error("POST 요청 오류:", err);
      } finally {
        setLoading(false);

        router.push("/ready");
      }
    } else {
      try {
        const res1 = await fetch(
          "https://port-0-demo-mi8wa6bu1d5765dc.sel3.cloudtype.app/ingredients/menu",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ food_name: input }),
          }
        );

        const res2 = await fetch(
          "https://port-0-demo-mi8wa6bu1d5765dc.sel3.cloudtype.app/recipe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ menu_name: input }),
          }
        );

        const recipe = await res1.json();
        const time = await res2.json();
        setGlobalData({ recipe: recipe, time: time });
        console.log("전체 응답:", recipe);
        console.log("조리 시간 응답:", time);
      } catch (err) {
        console.error("POST 요청 오류:", err);
      } finally {
        setLoading(true);
        router.push("/ready");
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div className={style.loadingWrapper}>
          <IsLoading />
        </div>
      ) : (
        <div>
          <div onClick={() => {}} className={style.whole_container}>
            <Image
              src="/pot.svg"
              alt=""
              width={0}
              height={0}
              style={{ width: "10rem", height: "auto" }}
            />
            <div className={style.holder}>어떤 요리를 도와드릴까요?</div>

            <div className={style.input_container}>
              <input
                className={style.inputinput}
                placeholder="요리명 또는 유튜브 링크 붙여넣기"
                onChange={onInputChange}
              />
              <button onClick={onButtonClick} className={style.btn}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
