import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "@/shared/components/MultiSelect";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  slug_or_uuid: z.string().max(255).optional().or(z.literal("")),
  status: z.string().max(50).optional().or(z.literal("")),
});

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CategoryAddForm = ({ onSubmit, isLoading = false, error = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug_or_uuid: "",
      status: "",
    },
  });

  const watchedStatus = watch("status");

  const submitHandler = async (data) => {
    await onSubmit?.(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Category</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter category name"
          disabled={isSubmitting || isLoading}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="slug_or_uuid" className="block text-sm font-medium text-gray-700 mb-1">Slug / UUID</label>
        <input
          id="slug_or_uuid"
          type="text"
          {...register("slug_or_uuid")}
          className={`w-full px-3 py-2 border ${errors.slug_or_uuid ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter slug or uuid (optional)"
          disabled={isSubmitting || isLoading}
        />
        {errors.slug_or_uuid && <p className="text-red-500 text-xs mt-1">{errors.slug_or_uuid.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <MultiSelect
          options={statusOptions}
          placeholder="Select status"
          value={watchedStatus ? [watchedStatus] : []}
          maxCount={1}
          hideSelectAll={true}
          onValueChange={(val) => setValue("status", val[0] || "")}
          disabled={isSubmitting || isLoading}
          searchable={false}
          singleLine
        />
        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
      </div>
      {error && (
        <div className="mb-3 text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {isSubmitting || isLoading ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryAddForm;
