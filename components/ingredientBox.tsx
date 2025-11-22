import style from "./ingredientBox.module.css";
import { mock_ingredients } from "../util/ingredient";
import CategorizedItem from "./categorizedItem";
import { useContext } from "react";
import { AppContext } from "@/app/context/appContext";

export default function IngredientBox() {
  const { globalData, setGlobalData } = useContext(AppContext)!;
  const data = globalData.recipe.ingredients[0];
  const nonEmptyKeys = Object.keys(data).filter((key) => {
    const k = key as keyof typeof data;
    return data[k] && data[k].length > 0;
  });

  return (
    <div className={style.whole_container}>
      {nonEmptyKeys.map((key) => {
        const items = data[key as keyof typeof data];
        return Array.isArray(items) ? (
          <CategorizedItem category={key} key={key} items={items} />
        ) : null;
      })}
    </div>
  );
}
