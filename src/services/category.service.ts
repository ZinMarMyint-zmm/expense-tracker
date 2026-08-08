import { Category,CreateCategoryInput } from "@/types/category";
export async function getCategories(): Promise<Category[]> {
  
    const response = await fetch("/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json()

} 

export async function createCategory(category: CreateCategoryInput): Promise<Category>{
  const { name, icon, color } = category
  
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify({name,icon,color})
  })

  if (!response.ok) {
      throw new Error("Failed to create categories");
  }
  
  return response.json()
}

export async function updateCategory({ id }:Category): Promise<Category>{
  
}