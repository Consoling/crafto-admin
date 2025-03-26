"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"; 
import { BarLoader } from "react-spinners";
import { toast } from "sonner";


interface Font {
  family: string;
  category: string;
  variants: string[];
  files: { [key: string]: string };
};

const FontsPage = () => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [filteredFonts, setFilteredFonts] = useState<Font[]>([]); 
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fontsPerPage, setFontsPerPage] = useState(10); 
  const [searchQuery, setSearchQuery] = useState("");
 


  const fetchFonts = async (page: number, limit: number) => {
    try {
   
      const startIndex = (page - 1) * limit;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}`);
      
      const data = await response.json();

      
      const fontsToDisplay = data.items.slice(startIndex, startIndex + limit);

      setFonts(data.items); 
      setFilteredFonts(fontsToDisplay); 
      setTotalPages(Math.ceil(data.items.length / limit));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching fonts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts(page, fontsPerPage); 
  }, [page]);

 
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = fonts.filter((font) =>
      font.family.toLowerCase().includes(query) || font.category.toLowerCase().includes(query)
    );
    
    setFilteredFonts(filtered); 
  };

  

  const handleCopyFont = (fontFamily: string) => {
    navigator.clipboard.writeText(fontFamily).then(() => {
      toast(`Font '${fontFamily}' copied to clipboard!`);
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-full w-full overflow-y-auto flex flex-col p-6 bg-black ">
      <div className="flex justify-between items-center mb-6 max-sm:flex-col max-sm:space-y-3">
        <div className="flex items-center max-sm:self-start">
          <h1 className="text-white text-2xl font-bold mr-4">Available Fonts</h1>
       
        </div>
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search fonts..."
            className="p-2 rounded bg-gray-700 text-white focus:outline-none max-sm:self-end"
          />
      </div>

      {/* Table to list fonts */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-white">Font Name</TableCell>
              <TableCell className="text-white">Category</TableCell>
              <TableCell className="text-white">Example</TableCell>
              <TableCell className="text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-white">
                <div className="flex w-full justify-center">
                <BarLoader color="#7c30d2" />
                </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredFonts.map((font) => (
                <TableRow key={font.family}>
                  <TableCell className="text-white">{font.family}</TableCell>
                  <TableCell className="text-white">{font.category}</TableCell>
                  <TableCell className="text-white">
                    <span style={{ fontFamily: font.family }}>
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </TableCell>
                  <TableCell className="text-white">
                    <Button
                      onClick={() => handleCopyFont(font.family)}
                      className="bg-gray-600 hover:bg-gray-400 text-white text-sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Font
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

export default FontsPage;
