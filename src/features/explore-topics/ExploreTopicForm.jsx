import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/components/Button.jsx";
import { useApiState } from "../../shared/hooks/useApi.js";
import { exploreService } from "../../shared/services/explore.js";

const exploreTopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // description: z.string().optional(),
  // category: z.string().optional(),
  // popularity: z.number().min(0).optional(),
});

export default function ExploreTopicForm({ topic, mode, onSave, onCancel }) {
  const [error, setError] = useState("");
  const { loading, execute } = useApiState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(exploreTopicSchema),
    defaultValues: {
      title: topic?.title || "",
      // description: topic?.description || "",
      // category: topic?.category || "",
      // popularity: topic?.popularity || 0,
    },
  });

  useEffect(() => {
    if (topic) {
      reset({
        title: topic.title,
        // description: topic.description || "",
        // category: topic.category || "",
        // popularity: topic.popularity || 0,
      });
    }
  }, [topic, reset]);

  const onSubmit = async (data) => {
    setError("");

    try {
      if (mode === "create") {
        await execute(exploreService.createExploreTopic, data);
      } else if (mode === "edit") {
        await execute(exploreService.updateExploreTopic, topic.id, data);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  const isReadOnly = mode === "view";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          {...register("title")}
          type="text"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter explore topic title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter description for this explore topic"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          {...register("category")}
          type="text"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter category (e.g., Music, Dance, Comedy)"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="popularity"
          className="block text-sm font-medium text-gray-700"
        >
          Popularity Score
        </label>
        <input
          {...register("popularity", { valueAsNumber: true })}
          type="number"
          min="0"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter popularity score"
        />
        {errors.popularity && (
          <p className="mt-1 text-sm text-red-600">
            {errors.popularity.message}
          </p>
        )}
      </div> */}

      {!isReadOnly && (
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {mode === "create" ? "Create Topic" : "Update Topic"}
          </Button>
        </div>
      )}

      {isReadOnly && (
        <div className="flex justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Close
          </Button>
        </div>
      )}
    </form>
  );
}
