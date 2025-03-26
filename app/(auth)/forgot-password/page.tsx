"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log("Password reset link sent to:", data.email);
    // API Call to send reset link
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-white sm:text-4xl">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* "Remembered your password?" Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-200 text-sm">
            Remembered your password?{" "}
            <Link
              href="/sign-in"
              className="text-purple-500 hover:text-purple-300 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* "Crafto Inc 2025" Footer */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>Crafto Inc 2025</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
