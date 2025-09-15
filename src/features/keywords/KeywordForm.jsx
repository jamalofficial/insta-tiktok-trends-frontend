import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/components/Button.jsx";
import { X, Save, Eye } from "lucide-react";

const keywordSchema = z.object({
  name: z
    .string()
    .min(1, "Keyword name is required")
    .max(100, "Keyword name too long"),
  description: z.string().optional(),
  popularity: z.number().min(0).max(10).optional(),
  is_trending: z.boolean().optional(),
});

export default function KeywordForm({ keyword, mode, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(keywordSchema),
    defaultValues: {
      name: "",
      description: "",
      popularity: 0,
      is_trending: false,
    },
  });

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  useEffect(() => {
    if (keyword) {
      reset({
        name: keyword.name || "",
        description: keyword.description || "",
        popularity: keyword.popularity || 0,
        is_trending: keyword.is_trending || false,
      });
    }
  }, [keyword, reset]);

  const onSubmit = async (data) => {
    if (isViewMode) return;

    setIsSubmitting(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error("Error saving keyword:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Keyword Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keyword Name *
        </label>
        <input
          {...register("name")}
          type="text"
          disabled={isViewMode}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? "border-red-300" : "border-gray-300"
          } ${isViewMode ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}`}
          placeholder="Enter keyword name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          disabled={isViewMode}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? "border-red-300" : "border-gray-300"
          } ${isViewMode ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}`}
          placeholder="Enter keyword description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Popularity and Trending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Popularity (0-10)
          </label>
          <input
            {...register("popularity", { valueAsNumber: true })}
            type="number"
            min="0"
            max="10"
            step="0.1"
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.popularity ? "border-red-300" : "border-gray-300"
            } ${
              isViewMode ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            placeholder="0"
          />
          {errors.popularity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.popularity.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <input
            {...register("is_trending")}
            type="checkbox"
            disabled={isViewMode}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              isViewMode ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <label className="text-sm font-medium text-gray-700">
            Trending Keyword
          </label>
        </div>
      </div>

      {/* Popularity Visual */}
      {watch("popularity") !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Popularity Level
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(watch("popularity") / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {watch("popularity")}/10
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-2" />
          {isViewMode ? "Close" : "Cancel"}
        </Button>

        {!isViewMode && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Update" : "Create"} Keyword
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
