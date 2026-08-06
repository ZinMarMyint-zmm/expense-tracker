export interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<{className?: string} >;
}

export interface NavbarProps{
    onMenuClick: () => void
}

export interface SidebarProps{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

