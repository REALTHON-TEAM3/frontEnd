"use client";

import VoiceChef from "../../../components/voiceChef";
import ArrowHeader from "../../../components/arrowHeader";
import { useState } from "react";
import Modal from "../../../components/modal";
import { useContext } from "react";
import { AppContext } from "@/app/context/appContext";

export default function Page() {
  const [open, setOpen] = useState(false);
  const { globalData, setGlobalData } = useContext(AppContext)!;
  return (
    <>
      <ArrowHeader
        setOpen={setOpen}
        menu={globalData.recipe.ingredients[0]["메뉴명"]}
      />
      <VoiceChef></VoiceChef>
      <div>cooking page</div>
      <button>입력</button>
      {open && (
        <Modal
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
