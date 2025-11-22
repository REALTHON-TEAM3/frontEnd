"use client";
import style from "./page.module.css";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/intro"); // 이동할 페이지
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 정리
  }, []);

  return <div className={style.container}></div>;
}
