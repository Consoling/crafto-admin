"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setUserData } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_SIGNUP_ROUTE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        
        const { token, admin } = responseData;
        localStorage.setItem('adminToken', token); // Save token
        setUserData({
          username: admin.username,
          email: admin.email,
          role: admin.role,
          _id: admin._id,
        }); 
        
        toast("Signup successful!");
        window.location.href = '/admin/dashboard';
      } else {
        console.error("Signup failed:", responseData.message);
        toast(responseData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast("An error occurred while signing up");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white sm:text-4xl">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder="xyz@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              {...register("password")}
              type={isPasswordVisible ? "text" : "password"}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-5 transform translate-y-1 text-gray-400 cursor-pointer"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            Sign Up
          </motion.button>
        </form>

        {/* "Already have an account? Sign In" Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-200 text-sm">
            Already have an account?{" "}
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

export default SignUp;
