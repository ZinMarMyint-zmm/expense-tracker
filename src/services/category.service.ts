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

export async function getCategory(id: string): Promise<Category>{
  const response = await fetch(`/api/categories/${id}`);

  console.log("GET category:", {
    id,
    status: response.status,
    statusText: response.statusText,
  });
  const data = await response.json();

  console.log("Response data:", data);

  if (!response.ok) {
    throw new Error("Failed to get category")
  }

  return data

}

export async function updateCategory(id:string, category: CreateCategoryInput): Promise<Category>{
  const { name, icon, color } = category;
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body:JSON.stringify({name,icon,color})
  })
  if (!response.ok) {
      throw new Error("Failed to update categories");
  }
  
  return response.json()
}

export async function deleteCategory(id: string): Promise<void>{
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE"
  })
  if (!response.ok) {
    throw new Error("Failed to deleted category")
  }
}