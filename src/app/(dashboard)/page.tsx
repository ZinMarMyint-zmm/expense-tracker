import { ItemCard } from "@/components/ItemCard";
import { Statistics } from "@/components/Statistics";

export default function Home() {
  return (
    <>
      <p className="mb-3">An overview of expense dashboard</p>
      <ItemCard />
      <Statistics />
    </>
  );
}
