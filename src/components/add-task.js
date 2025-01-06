"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const AddTask = ({ date }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const handleAddTask = async (data) => {
    if (!data.text?.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setIsSuccess(false);

      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.text.trim(),
          date,
          position: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddTask)} className="relative">
      <motion.div
        initial={false}
        animate={isLoading ? { opacity: 0.5 } : { opacity: 1 }}
      >
        <input
          {...register("text", {
            required: true,
            maxLength: 100,
          })}
          type="text"
          className="w-full rounded bg-transparent p-1 text-sm placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          aria-label="Add a new task"
        />
      </motion.div>

      <AnimatePresence>
        {isSuccess && ( // TODO: will probably be removed. I believe that task showing up should be enough
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-6 left-0 text-xs text-green-500"
          >
            Task added successfully!
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 text-xs text-red-500"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

export default AddTask;
