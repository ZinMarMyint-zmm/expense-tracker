import { Home, BanknoteArrowUp, BanknoteArrowDown } from "lucide-react";
import { SidebarItem } from "@/types/navigation";

export default function useLayout() {

    const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/", icon: Home },
    { title: "Income", href: "/income", icon: BanknoteArrowUp },
    { title: "Expense", href: "/expense", icon: BanknoteArrowDown },
]


    return {
        sidebarItems,
    }
}

