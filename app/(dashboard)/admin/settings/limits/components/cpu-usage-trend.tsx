"use client";

import { Cpu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface CPUUsage {
  user: number;
  sys: number;
  idle: number;
  irq: number;
  ttl: number;
}

interface CpuUsageChartProps {
  cpuUsage: CPUUsage | undefined; // The prop from the parent component
}

const CpuUsageChart: React.FC<CpuUsageChartProps> = ({ cpuUsage }) => {
  const [cpuData, setCpuData] = useState<{ time: string; cpuUsage: number }[]>([
    { time: "0", cpuUsage: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cpuUsage) {
        const newCpuUsage = cpuUsage.ttl; // Assuming ttl represents total CPU usage
        const currentTime = new Date().toLocaleTimeString();

        
        setCpuData((prevData) => [
          ...prevData,
          { time: currentTime, cpuUsage: newCpuUsage },
        ]);

        // Keep only the last 10 data points
        if (cpuData.length > 10) {
          setCpuData((prevData) => prevData.slice(1));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cpuUsage]);

  return (
    <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
       <div className="flex items-center justify-between flex-row">
       <h2 className="text-xl font-semibold text-white">CPU Usage (Real-time)</h2>
                <Cpu />
              </div>
      <AreaChart
        data={cpuData}
        margin={{
          left: 12,
          right: 12,
        }}
        width={500}
        height={300}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis />
        <Tooltip />
        <Area
          dataKey="cpuUsage"
          type="monotone"
          fill="oklch(0.488 0.243 264.376)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </div>
  );
};

export default CpuUsageChart;
