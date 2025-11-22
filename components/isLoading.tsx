import Image from "next/image";
import style from "./isLoading.module.css";

export default function IsLoading() {
  return (
    <div className={style.container}>
      {/* 움직이는 아이콘 */}
      <Image
        src="/ai.svg"
        alt=""
        width={0}
        height={0}
        className={style.moveHorizontal} // ★ 여기 추가!
        style={{ height: "10rem", width: "auto" }}
      />

      <div className={style.textBox}>레시피 생성중···</div>
    </div>
  );
}
