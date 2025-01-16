"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const AddTaskForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleAddTask = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/tasks", {
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
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setDeleteLoading(taskId);
      const response = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete task");
      }

      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tasks Section */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="border-b border-gray-200 bg-white px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Tasks
                </h2>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{task.text}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Due {new Date(task.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={deleteLoading === task._id}
                        className="inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                        aria-label={`Delete task ${task.text}`}
                      >
                        {deleteLoading === task._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-500">
                      No tasks found
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="border-b border-gray-200 bg-white px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Task
                </h2>
              </div>
              <div className="p-6">
                <form
                  onSubmit={handleSubmit(handleAddTask)}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Task Description
                    </label>
                    <input
                      id="text"
                      type="text"
                      {...register("text", {
                        required: "Task description is required",
                      })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                      disabled={isLoading}
                      aria-invalid={errors.text ? "true" : "false"}
                    />
                    {errors.text && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.text.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      {...register("date", {
                        required: "Due date is required",
                      })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                      disabled={isLoading}
                      min={new Date().toISOString().split("T")[0]}
                      aria-invalid={errors.date ? "true" : "false"}
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    aria-label="Add task"
                  >
                    {isLoading ? "Adding..." : "Add Task"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Team Members
              </h2>
            </div>
            <div className="divide-y divide-gray-200 p-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {user.email}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.tasks.length} tasks
                        </p>
                      </div>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Admin
                    </span>
                  )}
                </div>
              ))}
              {users.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
