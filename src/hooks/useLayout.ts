import { Home, BanknoteArrowUp,Banknote,BanknoteArrowDown,ArrowLeftRight,ChartBarStacked } from "lucide-react";
import { SidebarItem } from "@/types/navigation";
import { ItemCard } from "@/types/dashboard";

export default function useLayout() {

    const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { title: "Categories", href: "/categories", icon: ChartBarStacked,adminOnly: true, },
    ]
    
    const ItemCardData: ItemCard[] = [
  { title: "Income", icon: BanknoteArrowUp, amount: 12000 },
  { title: "Expense", icon: BanknoteArrowDown, amount: 10000 },
  { title: "Balance", icon: Banknote, amount: 2000 },
];


    return {
        sidebarItems,
        ItemCardData
    }
}

