import style from "./categorizedItem.module.css";
import Item from "./item";

type Ingredient = {
  name: string;
  quantity: string;
};

export default function CategorizedItem({
  items,
  category,
}: {
  items: Ingredient[];
  category: string;
}) {
  console.log(items, category);
  return (
    <div className={style.whole_container}>
      <div className={style.cateName}>{category}</div>
      <div className={style.item_container}>
        {items.map((item, index) => (
          <Item item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
