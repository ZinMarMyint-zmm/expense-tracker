export interface Category {
    id: string
    name: string
    icon: string
    color: string
    createdAt: Date
}

export interface CreateCategoryInput{
    name: string
    icon: string
    color: string
}

