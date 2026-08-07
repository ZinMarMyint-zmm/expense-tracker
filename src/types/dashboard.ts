export interface ItemCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  amount: number;
}