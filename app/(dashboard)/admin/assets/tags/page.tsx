"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { BarLoader } from "react-spinners";

interface Tag {
  _id: string;
  tag: string;
  emoji?: string;
}

interface Pagination {
  totalTags: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalTags: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchTags = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GET_TAG_ROUTE}?page=${page}&limit=${pagination.pageSize}`
      );
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setTags(data.tags);
        setPagination(data.pagination);
      } else {
        toast.error("Failed to fetch tags");
      }
    } catch (error) {
      toast.error("Error fetching tags");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="min-h-full w-full p-6 bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Your Tags</h1>
        <Button
          onClick={() => router.push("/admin/assets/tags/create")}
          className="bg-white hover:bg-gray-400 text-black cursor-pointer"
        >
          Add New
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex w-full justify-center">
          <BarLoader color="#7c30d2" />
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left">Tag</TableHead>
                  <TableHead className="px-4 py-2 text-left">Emoji</TableHead>
                  <TableHead className="px-4 py-2 text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No Tags found
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag._id}>
                      <TableCell className="px-4 py-2">{tag.tag}</TableCell>
                      <TableCell className="px-4 py-2">
                        {tag.emoji || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Button className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="bg-gray-600 text-white mx-2"
            >
              Previous
            </Button>
            <span className="text-white">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="bg-gray-600 text-white mx-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
