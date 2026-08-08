"use client";

import { getCategories,createCategory as createCategoryService } from "@/services/category.service";
import { Category,CreateCategoryInput } from "@/types/category";
import { useState, useEffect } from "react";
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setError("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

    const createCategory = async ({ name, icon, color }:CreateCategoryInput) => {
        try {
            const newCategory = await createCategoryService({name,icon,color});
            setCategories((prev) => [...prev, newCategory]);
        } catch (error) {
            console.error("Failed to create category",error)
        }
    }

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories,createCategory };
};
