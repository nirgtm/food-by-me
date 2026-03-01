import React from "react";
import { useParams } from "react-router-dom";
import PremiumFoodPage from "./PremiumFoodPage";
import { getThemeBySlug } from "./catalogThemes";

export default function CategoryPage() {
  const { name } = useParams();
  return <PremiumFoodPage theme={getThemeBySlug(name)} />;
}
