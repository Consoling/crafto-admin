'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Add react-icons

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const signInSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isEmail, setIsEmail] = useState(false); // State to toggle email/username input
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white sm:text-4xl">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dynamic Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              {isEmail ? 'Email' : 'Username'}
            </label>
            <motion.input
              {...register(isEmail ? 'email' : 'username')}
              type={isEmail ? 'email' : 'text'}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder={isEmail ? 'Enter your email' : 'Enter your username'}
              key={isEmail ? 'email' : 'username'} // Key to trigger re-render on type change
            />
            {errors[isEmail ? 'email' : 'username'] && (
              <p className="text-red-400 text-sm mt-1">
                {errors[isEmail ? 'email' : 'username']?.message}
              </p>
            )}
            <div className="mt-4 text-right">
              <p className="text-gray-200 text-sm">
                {isEmail ? (
                  <span
                    onClick={() => setIsEmail(false)} // Change back to username
                    className="text-purple-500 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    Sign in with Username
                  </span>
                ) : (
                  <span
                    onClick={() => setIsEmail(true)} // Change to email
                    className="text-purple-500 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    Sign in with Email
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Password Field with Eye Icon for Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input
              {...register('password')}
              type={isPasswordVisible ? 'text' : 'password'} // Toggle password visibility
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 transform -translate-y-3.5 text-gray-400 cursor-pointer"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
            <div className="mt-4 text-right">
              <Link href="/forgot-password">
                <span className="text-purple-500 hover:text-purple-300 font-semibold cursor-pointer text-sm">
                  Forgot password ?
                </span>
              </Link>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            Sign In
          </motion.button>
        </form>
        {/* "Don't have an account? Sign Up" Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-200 text-sm">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="text-purple-500 hover:text-purple-300 font-semibold"
            >
              Sign Up
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

export default SignIn;
