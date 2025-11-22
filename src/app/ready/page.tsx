"use client";

import style from "./page.module.css";
import IngredientBox from "../../../components/ingredientBox";
import ArrowHeader from "../../../components/arrowHeader";
import { useState } from "react";
import Modal from "../../../components/modal";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "@/app/context/appContext";

export default function Page() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { globalData, setGlobalData } = useContext(AppContext)!;

  return (
    <>
      <ArrowHeader
        setOpen={setOpen}
        menu={globalData.recipe.ingredients[0]["메뉴명"]}
      />
      <div className={style.whole_container}>
        <div className={style.holder}>이런 재료를 준비해요!</div>
        <IngredientBox></IngredientBox>
        {open && (
          <Modal
            onClose={() => {
              setOpen(false);
            }}
          />
        )}
        <button
          onClick={() => {
            router.push("/cooking");
          }}
          className={style.readyBtn}
        >
          준비완료
        </button>
      </div>
    </>
  );
}
