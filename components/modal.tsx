"use client";

import styles from "./modal.module.css";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const onOutClick = () => {
    onClose();
    router.push("/intro");
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div style={{ paddingBottom: "0.5rem" }}>레시피 생성을 종료할까요?</div>
        <div style={{ fontSize: "1rem", color: "#a8a8a8" }}>
          진행 중인 내용은 저장되지 않아요.
        </div>
        <div className={styles.button_container}>
          <button className={styles.out} onClick={onOutClick}>
            나갈래요
          </button>
          <button className={styles.keep} onClick={onClose}>
            계속 볼래요
          </button>
        </div>
      </div>
    </div>
  );
}
