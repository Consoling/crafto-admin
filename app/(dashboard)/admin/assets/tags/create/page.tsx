"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { motion } from "framer-motion";
import { z } from "zod";
import { getBearerToken } from "@/utils/getToken";

const tagSchema = z.object({
  tag: z
    .string()
    .min(1, "Tag is required")
    .regex(
      /^[A-Za-z0-9-_]+$/, 
      "Tag can only contain uppercase and lowercase letters, numbers, dashes, and underscores"
    ),
  emoji: z.string().optional(),
});

const TagCreatePage = () => {
  const [tag, setTag] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const router = useRouter();

  const handleCreateTag = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = tagSchema.safeParse({ tag, emoji });

    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

  

    if (tag === "") {
      toast.error("Tag cannot be empty!");
      return;
    }

    try {
      const token = await getBearerToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_TAG_ROUTE}`, {
        method: "POST",
        body: JSON.stringify({ tag: tag, emoji }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error creating tag");
        return;
      }

      toast.success(`Tag "${tag}" created successfully!`);
      setTag("");
      setEmoji("");
    } catch (error) {
      toast.error("Error creating tag");
      console.error(error);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-full w-full flex flex-col p-6 bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Create Tag</h1>
        <Button
          onClick={() => router.push("/admin/assets/tags")}
          className="bg-white hover:bg-gray-400 text-black"
        >
          View Tags
        </Button>
      </div>

      <form onSubmit={handleCreateTag} className="space-y-10 mt-10">
        <div>
          <label htmlFor="tag" className="block text-white">
            Tag Name
          </label>
          <div className="flex items-center mt-2">
            <Input
              type="text"
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Enter tag name"
              className="w-full sm:w-1/2 p-3 bg-gray-800 text-white rounded"
              required
            />
            <Button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="ml-2 bg-gray-600 hover:bg-gray-400 text-white"
            >
              😊
            </Button>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="absolute mt-2">
            <Picker
              data={data}
              onSelect={handleEmojiSelect}
              onClickOutside={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        <div className="flex justify-start">
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-400 text-white cursor-pointer"
          >
            Create Tag
          </Button>
        </div>
      </form>

      <motion.div
        className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg border-l-4 border-purple-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white underline mb-4">
          Instructions
        </h2>
        <ul className="text-white space-y-2">
          <li className="text-base">
            <strong>Don't use "#"</strong> for tags, just write the tag name
            (e.g., "food", not "#food").
          </li>
          <li className="text-base">
            <strong>
              Tag names will automatically be converted to lowercase.
            </strong>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default TagCreatePage;
