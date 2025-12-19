import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import listService from "@/shared/services/listService";
import { MultiSelect } from "@/shared/components/MultiSelect";

// Zod schema for validation
const topicSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(100, "Topic must be at most 100 characters")
    .nonempty("Topic is required"),
  platform: z
    .string()
    .min(2, "Platform must be at least 2 characters")
    .max(50, "Platform must be at most 50 characters")
    .nonempty("Platform is required"),
});

const TopicAddForm = ({ onSubmit, isLoading = false, error = null, showHeading = true }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      topic: "",
      platform: ""
    },
  });

  const [platforms, setPlatforms] = useState([]);
  useEffect(() => {
    const setPlatformValues = async () => {
      const _platforms = await listService.platforms();
      setPlatforms(_platforms?.items?.map((item) => ({label: item, value: item})));
    }
    setPlatformValues();
  }, []);

  const submitHandler = async (data) => {
    await onSubmit?.(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-white mx-auto"
    >
      {showHeading && <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Topic</h2> }
      <div className="mb-4">
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
          Topic Name
        </label>
        <input
          id="topic"
          type="text"
          {...register("topic")}
          className={`w-full px-3 py-2 border ${
            errors.topic ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter topic name"
          disabled={isSubmitting || isLoading}
        />
        {errors.topic && (
          <p className="text-red-500 text-xs mt-1">{errors.topic.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
          Platform
        </label>
        <MultiSelect 
            placeholder="Select platform"
            options={platforms}
            value={watch("platform")}
            onValueChange={val => setValue("platform", val, { shouldValidate: true })}
            selectionMode='single'
        />
        {errors.platform && (
          <p className="text-red-500 text-xs mt-1">{errors.platform.message}</p>
        )}
      </div>
      {error && (
        <div className="mb-3 text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {isSubmitting || isLoading ? "Adding..." : "Add Topic"}
      </button>
    </form>
  );
};

export default TopicAddForm;
