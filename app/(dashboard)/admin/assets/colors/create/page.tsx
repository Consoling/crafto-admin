"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const SketchPicker = dynamic(
  () => import("react-color").then((mod) => mod.SketchPicker),
  { ssr: false }
);
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { getBearerToken } from "@/utils/getToken";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define Zod schemas for input validation
const rgbSchema = z.object({
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
});

const rgbaSchema = rgbSchema.extend({
  a: z.number().min(0).max(1),
});

const hslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

const colorNameSchema = z.object({
  name: z.string().nonempty().min(3).max(50),
});

// Helper function to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

// Convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const ColorCreatePage = () => {
  const [selectedColor, setSelectedColor] = React.useState<string>("#FFFFFF");

  // Initialize forms
  const rgbForm = useForm({
    resolver: zodResolver(rgbSchema),
    defaultValues: { r: 255, g: 255, b: 255 },
  });

  const rgbaForm = useForm({
    resolver: zodResolver(rgbaSchema),
    defaultValues: { r: 255, g: 255, b: 255, a: 1 },
  });

  const hslForm = useForm({
    resolver: zodResolver(hslSchema),
    defaultValues: { h: 0, s: 100, l: 100 },
  });

  const colornNameForm = useForm({
    resolver: zodResolver(colorNameSchema),
    defaultValues: { name: "" },
  });

  const handleColorChange = (color: {
    rgb: { r: any; g: any; b: any };
    hex: string;
  }) => {
    setSelectedColor(color.hex);
    const { r, g, b } = color.rgb;

    rgbForm.setValue("r", r);
    rgbForm.setValue("g", g);
    rgbForm.setValue("b", b);

    rgbaForm.setValue("r", r);
    rgbaForm.setValue("g", g);
    rgbaForm.setValue("b", b);

    const hsl = rgbToHsl(r, g, b);
    hslForm.setValue("h", hsl.h);
    hslForm.setValue("s", hsl.s);
    hslForm.setValue("l", hsl.l);
  };

  // Handle RGB form submission
  const onRgbSubmit = (values: z.infer<typeof rgbSchema>) => {
    setSelectedColor(rgbToHex(values.r, values.g, values.b));
    const hsl = rgbToHsl(values.r, values.g, values.b);
    hslForm.setValue("h", hsl.h);
    hslForm.setValue("s", hsl.s);
    hslForm.setValue("l", hsl.l);

    // Also update RGBA form (except alpha)
    rgbaForm.setValue("r", values.r);
    rgbaForm.setValue("g", values.g);
    rgbaForm.setValue("b", values.b);
  };

  // Handle RGBA form submission
  const onRgbaSubmit = (values: z.infer<typeof rgbaSchema>) => {
    setSelectedColor(
      `rgba(${values.r}, ${values.g}, ${values.b}, ${values.a})`
    );

    // Also update RGB form
    rgbForm.setValue("r", values.r);
    rgbForm.setValue("g", values.g);
    rgbForm.setValue("b", values.b);

    // Update HSL
    const hsl = rgbToHsl(values.r, values.g, values.b);
    hslForm.setValue("h", hsl.h);
    hslForm.setValue("s", hsl.s);
    hslForm.setValue("l", hsl.l);
  };

  // Handle HSL form submission
  const onHslSubmit = (values: z.infer<typeof hslSchema>) => {
    setSelectedColor(`hsl(${values.h}, ${values.s}%, ${values.l}%)`);
  };

  const handleSubmitColor = async () => {
    const rgbValues = rgbForm.getValues();
    const rgbaValues = rgbaForm.getValues();
    const hslValues = hslForm.getValues();
    const customName = crypto
      .getRandomValues(new Uint32Array(1))[0]
      .toString(16);
    const colorData = {
      name: customName,
      hex: selectedColor, // Hex value, e.g. "#FFFFFF"
      rgb: {
        r: rgbValues.r, // RGB values as numbers
        g: rgbValues.g,
        b: rgbValues.b,
      },
      rgba: {
        r: rgbaValues.r, // RGBA values as numbers
        g: rgbaValues.g,
        b: rgbaValues.b,
        a: rgbaValues.a, // Alpha value
      },
      hsl: {
        h: hslValues.h, // HSL values as numbers
        s: hslValues.s,
        l: hslValues.l,
      },
    };

    const token = getBearerToken();

    if (!token) {
      alert("Authorization token is missing.");
      return;
    }

    

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CREATE_COLOR_ROUTE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(colorData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit color.");
      }

      const newColor = await response.json();
      toast("Color submitted successfully!");
    } catch (error) {
      console.error("Error submitting color:", error);
      alert("Error submitting color!");
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-full w-full overflow-y-auto flex flex-col p-6 bg-black">
        <div className="flex justify-between items-center mb-6 max-sm:flex-col max-sm:items-center">
          <h1 className="text-white text-2xl font-bold">Create Custom Color</h1>
          <Button
            onClick={() => router.push("/admin/assets/colors")}
            className="bg-white hover:bg-gray-400 transition-colors ease-in-out transform cursor-pointer text-black max-sm:hidden"
          >
            View Colors
            <ChevronLeft className="w-4 h-4 " />
          </Button>
        </div>
      <div className=" flex items-center justify-center p-6 max-sm:py-6 max-sm:px-0 bg-black">
        <motion.div
          className="w-full max-w-2xl space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            
            <div className="text-center">
              <div className="mb-6">
                <motion.div
                  className="h-40 w-full rounded-lg"
                  style={{ backgroundColor: selectedColor }}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="space-y-6 px-4 pb-4">
                {/* Color Picker */}
                <div className="space-y-3 w-full">
                  <h3 className="text-white">Pick a Color</h3>
                  <div className="w-full flex flex-row items-center justify-center">
                    <SketchPicker
                      color={selectedColor}
                      onChange={handleColorChange}
                      className="w-[250px]"
                    />
                  </div>
                </div>

                {/* RGB Picker */}
                <Form {...rgbForm}>
                  <form
                    onSubmit={rgbForm.handleSubmit(onRgbSubmit)}
                    className="space-y-3"
                  >
                    <h3 className="text-white">RGB Color</h3>
                    <div className="flex justify-between gap-2">
                      {["r", "g", "b"].map((channel) => (
                        <FormField
                          key={channel}
                          control={rgbForm.control}
                          name={channel as "r" | "g" | "b"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white capitalize">
                                {channel}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="text-white"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 rounded-md cursor-pointer"
                    >
                      Update RGB
                    </Button>
                  </form>
                </Form>

                {/* RGBA Picker */}
                <Form {...rgbaForm}>
                  <form
                    onSubmit={rgbaForm.handleSubmit(onRgbaSubmit)}
                    className="space-y-3"
                  >
                    <h3 className="text-white">RGBA Color</h3>
                    <div className="flex justify-between gap-2">
                      {["r", "g", "b", "a"].map((channel) => (
                        <FormField
                          key={channel}
                          control={rgbaForm.control}
                          name={channel as "r" | "g" | "b" | "a"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white capitalize">
                                {channel}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step={channel === "a" ? "0.01" : "1"}
                                  className="text-white"
                                  {...field}
                                  onChange={(e) => {
                                    const value =
                                      channel === "a"
                                        ? parseFloat(e.target.value)
                                        : parseInt(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 rounded-md cursor-pointer"
                    >
                      Update RGBA
                    </Button>
                  </form>
                </Form>

                {/* HSL Picker */}
                <Form {...hslForm}>
                  <form
                    onSubmit={hslForm.handleSubmit(onHslSubmit)}
                    className="space-y-3"
                  >
                    <h3 className="text-white">HSL Color</h3>
                    <div className="flex justify-between gap-2">
                      {["h", "s", "l"].map((channel) => (
                        <FormField
                          key={channel}
                          control={hslForm.control}
                          name={channel as "h" | "s" | "l"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white capitalize">
                                {channel}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="text-white"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 rounded-md cursor-pointer"
                    >
                      Update HSL
                    </Button>
                  </form>
                </Form>

                {/* Reset Button */}
                <div className="flex flex-row space-x-5 mt-10 items-center justify-center max-sm:flex-col  max-sm:items-center max-sm:justify-center max-sm:space-y-6">
                  <Button
                    className=" text-white bg-blue-600 hover:bg-blue-700  rounded-md cursor-pointer"
                    onClick={() => {
                      setSelectedColor("#FFFFFF");
                      rgbForm.reset({ r: 255, g: 255, b: 255 });
                      rgbaForm.reset({ r: 255, g: 255, b: 255, a: 1 });
                      hslForm.reset({ h: 0, s: 100, l: 100 });
                    }}
                  >
                    Reset to White
                  </Button>
                  <Button
                    onClick={handleSubmitColor}
                    className="bg-green-600/90 hover:bg-green-400/70 text-gray-200 rounded-md cursor-pointer hover:scale-105 transform transition-all delay-150 ease-in"
                  >
                    Submit Color
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ColorCreatePage;
