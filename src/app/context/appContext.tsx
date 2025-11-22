"use client";

import { createContext, useState } from "react";

export interface IngredientItem {
  name: string;
  quantity: string;
}

export interface IngredientCategory {
  메뉴명: string;
  "과일/채소": IngredientItem[];
  정육: IngredientItem[];
  "쌀/면": IngredientItem[];
  수산물: IngredientItem[];
  "양념/소스": IngredientItem[];
  "우유/유제품": IngredientItem[];
}

export interface IngredientGroup {
  ingredients: IngredientCategory[];
}

export interface IngredientsResponse {
  ingredients: IngredientCategory[];
}

interface GlobalContextType {
  globalData: {
    recipe: IngredientGroup;
    time: string;
  };
  setGlobalData: React.Dispatch<
    React.SetStateAction<{
      recipe: IngredientGroup;
      time: string;
    }>
  >;
}

export const AppContext = createContext<GlobalContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [globalData, setGlobalData] = useState<GlobalContextType["globalData"]>(
    {
      recipe: {
        ingredients: [
          {
            메뉴명: "",
            "과일/채소": [],
            정육: [],
            "쌀/면": [],
            수산물: [],
            "양념/소스": [],
            "우유/유제품": [],
          },
        ],
      },
      time: "0",
    }
  );

  return (
    <AppContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </AppContext.Provider>
  );
}
