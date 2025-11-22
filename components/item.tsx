import style from "./item.module.css";

type Ingredient = {
  name: string;
  quantity: string;
};

export default function Item({ item }: { item: Ingredient }) {
  console.log(item);
  return (
    <div className={style.container}>
      <div style={{ fontWeight: "bolder" }}>{item.name}</div>
      <div>{item.quantity}</div>
    </div>
  );
}
