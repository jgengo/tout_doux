"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

const AddTaskForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddTask = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      console.log(data);
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.text,
          date: data.date,
          position: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center gap-3">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-primary">Add New Task</h2>

        {error && (
          <div
            className="mb-4 rounded-md bg-red-100 p-3 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleAddTask)} className="space-y-4">
          <div>
            <label
              htmlFor="text"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Task Description
            </label>
            <input
              id="text"
              type="text"
              {...register("text", {
                required: "Task description is required",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoading}
              aria-invalid={errors.text ? "true" : "false"}
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              id="date"
              type="date"
              {...register("date", { required: "Due date is required" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
              aria-invalid={errors.date ? "true" : "false"}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add task"
          >
            {isLoading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
