import type { Metadata } from "next";
import ProductionDiary from "@/components/ProductionDiary";

export const metadata: Metadata = {
  title: "Hazlo Realidad | Black Gum",
  description: "Cada cuadro cuenta una historia. Estas son las nuestras."
};

export default function DiaryPage() {
  return (
    <div className="w-full">
      <ProductionDiary />
    </div>
  );
}
