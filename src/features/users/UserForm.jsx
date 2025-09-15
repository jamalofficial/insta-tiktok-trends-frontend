import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/components/Button.jsx";
import { useApiState } from "../../shared/hooks/useApi.js";
import { usersService } from "../../shared/services/users.js";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role_id: z.number().min(1, "Please select a role"),
});

export default function UserForm({ user, roles, mode, onSave, onCancel }) {
  const [error, setError] = useState("");
  const { loading, execute } = useApiState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      role_id: user?.role_id || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: "",
        role_id: user.role_id,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setError("");

    try {
      if (mode === "create") {
        // Password is required for new users
        if (!data.password) {
          setError("Password is required for new users");
          return;
        }
        await execute(usersService.createUser, data);
      } else if (mode === "edit") {
        // Remove password if empty for updates
        if (!data.password) {
          delete data.password;
        }
        await execute(usersService.updateUser, user.id, data);
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
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username *
        </label>
        <input
          {...register("username")}
          type="text"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email *
        </label>
        <input
          {...register("email")}
          type="email"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password {mode === "create" ? "*" : "(leave empty to keep current)"}
        </label>
        <input
          {...register("password")}
          type="password"
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role_id"
          className="block text-sm font-medium text-gray-700"
        >
          Role *
        </label>
        <select
          {...register("role_id", { valueAsNumber: true })}
          disabled={isReadOnly}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.role_id && (
          <p className="mt-1 text-sm text-red-600">{errors.role_id.message}</p>
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
            {mode === "create" ? "Create User" : "Update User"}
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
