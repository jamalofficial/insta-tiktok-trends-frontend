import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/components/Button.jsx";
import { useApiState } from "../../shared/hooks/useApi.js";
import { searchService } from "../../shared/services/search.js";

const searchTopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ai_tips: z.string().optional(),
  quick_actions: z.string().optional(),
  popularity: z.number().min(0).optional(),
});

export default function SearchTopicForm({ topic, mode, onSave, onCancel }) {
  const [error, setError] = useState("");
  const { loading, execute } = useApiState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(searchTopicSchema),
    defaultValues: {
      title: topic?.title || "",
      ai_tips: topic?.ai_tips || "",
      quick_actions: topic?.quick_actions || "",
      popularity: topic?.popularity || 0,
    },
  });

  useEffect(() => {
    if (topic) {
      reset({
        title: topic.title,
        ai_tips: topic.ai_tips || "",
        quick_actions: topic.quick_actions || "",
        popularity: topic.popularity || 0,
      });
    }
  }, [topic, reset]);

  const onSubmit = async (data) => {
    setError("");

    try {
      if (mode === "create") {
        await execute(searchService.createSearchTopic, data);
      } else if (mode === "edit") {
        await execute(searchService.updateSearchTopic, topic.id, data);
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
          placeholder="Enter search topic title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="ai_tips"
          className="block text-sm font-medium text-gray-700"
        >
          AI Tips
        </label>
        <textarea
          {...register("ai_tips")}
          rows={4}
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter AI tips for this search topic"
        />
        {errors.ai_tips && (
          <p className="mt-1 text-sm text-red-600">{errors.ai_tips.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="quick_actions"
          className="block text-sm font-medium text-gray-700"
        >
          Quick Actions
        </label>
        <textarea
          {...register("quick_actions")}
          rows={3}
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter quick actions for this search topic"
        />
        {errors.quick_actions && (
          <p className="mt-1 text-sm text-red-600">
            {errors.quick_actions.message}
          </p>
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
      </div>

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
