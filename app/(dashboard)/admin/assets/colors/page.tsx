"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarLoader } from "react-spinners";

type Color = {
  _id: string;
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgba: { r: number; g: number; b: number; a: number };
  hsl: { h: number; s: number; l: number };
  createdAt: string;
};

const ColorsPage = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchColors = async (page: number, limit: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GET_COLOR_ROUTE}?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      setColors(data.colors);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors(page, 10);
  }, [page]);

  const handleAddNewColor = () => {
    router.push("/admin/assets/colors/create");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-full w-full overflow-y-auto flex flex-col p-6 bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Your Colors</h1>
        <Button
          onClick={handleAddNewColor}
          className="bg-white hover:bg-gray-400 transition-colors ease-in-out transform cursor-pointer text-black"
        >
          Add New
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-white">Name</TableCell>
              <TableCell className="text-white">Hex</TableCell>
              <TableCell className="text-white">RGB</TableCell>
              <TableCell className="text-white">RGBA</TableCell>
              <TableCell className="text-white">HSL</TableCell>
              <TableCell className="text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-white">
                  <div className="flex h-full w-full items-center justify-center">
                    {" "}
                    <BarLoader color="#7c30d2" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              colors.map((color) => (
                <TableRow key={color._id} className="py-3">
                  <TableCell className="text-white">{color.name}</TableCell>
                  <TableCell className="text-white">{color.hex}</TableCell>
                  <TableCell className="text-white">
                    rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                  </TableCell>
                  <TableCell className="text-white">
                    rgba({color.rgba.r}, {color.rgba.g}, {color.rgba.b},{" "}
                    {color.rgba.a})
                  </TableCell>
                  <TableCell className="text-white">
                    hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                  </TableCell>
                  <TableCell className="text-white">
                    <Button
                      onClick={()=>{}}
                      className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 rounded-lg" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="bg-white text-black hover:bg-gray-400 mr-2"
        >
          Previous
        </Button>
        <span className="text-white">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-white text-black hover:bg-gray-400 ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ColorsPage;
