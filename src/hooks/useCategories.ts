"use client";

import {
  getCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  getCategory as getCategoryService,
  deleteCategory as deleteCategoryService
} from "@/services/category.service";
import { Category, CreateCategoryInput } from "@/types/category";
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

  const createCategory = async ({ name, icon, color }: CreateCategoryInput) => {
    try {
      const newCategory = await createCategoryService({ name, icon, color });
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Failed to create category", error);
    }
  };

  const getCategory = async (id:string) => {
    try {
      const category = await getCategoryService(id);
      return category
    } catch (error) {
      console.error("Failed to fetch category", error)
      throw error
    }
  }

  const updateCategory = async (
    id: string,
    { name, icon, color }: CreateCategoryInput,
  ) => {
    try {
      const updatedCategory = await updateCategoryService(id, {
        name,
        icon,
        color,
      });
      setCategories((prev) =>
        prev.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category,
        ),
      );
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const deleteCategory = async (id:string) => {
    try {
      await deleteCategoryService(id)
      setCategories((prev) =>
      prev.filter((category)=>category.id !== id))
    } catch (error) {
      console.error("Failed to delete category",error)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory
  };
};
