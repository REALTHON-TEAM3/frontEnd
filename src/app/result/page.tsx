"use client";

import ArrowHeader from "../../../components/arrowHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./page.module.css";

export default function Page() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <ArrowHeader setOpen={setOpen}></ArrowHeader>
      <div className={style.container}>
        <Image
          src="/result.svg"
          alt=""
          width={0}
          height={0}
          className={style.resultImage}
          style={{ width: "10rem", height: "auto" }}
        ></Image>
        <div>요리 완료!</div>
      </div>
    </>
  );
}
