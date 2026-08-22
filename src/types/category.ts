export interface Category {
    id: string
    name: string
    icon: string
    color: string
    isActive:boolean
    createdAt: Date
}

export interface CreateCategoryInput{
    name: string
    icon: string
    color: string
}

