import { Category } from "@/types/category";
import { useState, useEffect } from "react";
export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  async function getCategories() {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data: Category[] = await response.json();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error("City search error:", error);
      setCategories([]);
    }
  }
  useEffect(() => {
    getCategories();
  }, []);
  return { categories, getCategories };
};
