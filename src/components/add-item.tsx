"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface AddItemProps {
  type: "task" | "dump";
  date?: Date;
  onSuccess?: () => void;
}

interface FormData {
  text: string;
}

const AddItem = ({ type, date, onSuccess }: AddItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleAdd = async (data: FormData) => {
    if (!data.text?.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const endpoint = type === "task" ? "/api/tasks" : "/api/dumps";
      const body =
        type === "task"
          ? { text: data.text.trim(), date, position: 1 }
          : { text: data.text.trim(), position: 1 };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to create ${type}`);
      }
      reset();
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAdd)} className="relative py-1">
      <motion.div
        initial={false}
        animate={isLoading ? { opacity: 0.5 } : { opacity: 1 }}
      >
        <input
          {...register("text", {
            required: true,
            maxLength: type === "dump" ? 1000 : 100,
          })}
          type="text"
          className="w-full rounded bg-transparent text-sm placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          aria-label={`Add a new ${type}`}
        />
      </motion.div>

      <AnimatePresence>
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

export default AddItem;
