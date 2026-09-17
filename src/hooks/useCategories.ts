"use client";

import {
  getCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  getCategory as getCategoryService,
  deleteCategory as deleteCategoryService,
} from "@/services/category.service";
import { CreateCategoryInput } from "@/types/category";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategories = () => {
  const queryClient = useQueryClient();

  //GET
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories,
  });

  //Create
  const createMutation = useMutation({
    mutationFn: createCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
  const createCategory = async (input: CreateCategoryInput) => {
    await createMutation.mutateAsync(input);
  };

  //GET Single
  const getCategory = async (id: string) => {
    try {
      const category = await getCategoryService(id);
      return category;
    } catch (error) {
      console.error("Failed to fetch category", error);
      throw error;
    }
  };

  //UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCategoryInput }) =>
      updateCategoryService(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:["categories"]
      })
    },
  });
  const updateCategory = async (
    id: string,
    input: CreateCategoryInput,
  ) => {
    await updateMutation.mutateAsync({id, input});
      
  };

  //DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:["categories"]
      })
    },
  })
  const deleteCategory = async (id: string) => {
    await deleteMutation.mutateAsync(id);
      
  };

  return {
    categories,
    loading: isLoading,
    error: isError ? "Failed to fetch categories" : "",
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory,
  };
};
