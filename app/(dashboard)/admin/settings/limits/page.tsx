"use client";

import { Progress } from "@/components/ui/progress";
import { Activity, Clock7, Cpu, Leaf, MemoryStickIcon, Server } from "lucide-react";
import React, { useState, useEffect } from "react";
import { BarLoader, BounceLoader } from "react-spinners";

interface CPUUsage {
  user: number;
  sys: number;
  idle: number;
  irq: number;
  ttl: number;
}

interface MemoryUsage {
  total: number;
  free: number;
  used: number;
  usagePercentage: number;
}

interface MongoDBStatus {
    status: string;
    message: string;
  }
  
  interface PM2Status {
    status: string;
    message: Array<{ name: string; status: string }>;
  }

interface UsageData {
  cpuUsage: CPUUsage;
  memoryUsage: MemoryUsage;
  loadAverages: number[];
  uptime: number;
  mongoDBStatus: MongoDBStatus;
  pm2Status: PM2Status;
}

const LimitsPage = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_ADMIN_LIMITS_FETCH_WEBSOCKET_ROUTE}`
    );
    socket.onopen = (event) => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data: UsageData = JSON.parse(event.data);
      console.log(data);
      setUsageData(data);
      setLoading(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0") + "H "}: ${
      minutes.toString().padStart(2, "0") + "M "
    }: ${remainingSeconds.toString().padStart(2, "0") + "S "}`;
  };

  return (
    <div className="min-h-full p-10 overflow-y-auto">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          {" "}
          <BarLoader color="#7c30d2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-row">
                <h2 className="text-xl font-semibold text-white">CPU Usage</h2>
                <Cpu />
              </div>
              <Progress value={usageData?.cpuUsage.ttl || 0} className="" />
              <div className="text-white mt-2 flex flex-row font-semibold space-x-3">
                <p> Idle:</p>
                <p className="font-medium">
                  {Math.round(
                    usageData?.cpuUsage.idle ? usageData?.cpuUsage.idle : 0
                  )}
                  %
                </p>
              </div>
              <div className="text-white mt-2 flex flex-row font-semibold space-x-3">
                <p>Kernel:</p>
                <p className="font-medium">
                  {Math.round(usageData?.cpuUsage.sys || 0)}%
                </p>
              </div>

              <div className="text-white mt-2 flex flex-row font-semibold space-x-3">
                <p>User:</p>
                <p className="font-medium">
                  {Math.round(usageData?.cpuUsage.user || 0)}%
                </p>
              </div>

             
            </div>

            <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-row">
                <h2 className="text-xl font-semibold text-white">
                  Memory Usage
                </h2>
                <MemoryStickIcon />
              </div>
              <Progress
                value={usageData?.memoryUsage.usagePercentage || 0}
                className=""
              />
              <div className="text-white mt-2">
              {Math.round(usageData?.memoryUsage.usagePercentage || 0)}% Used
              </div>
            </div>

            <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-row">
                <h2 className="text-xl font-semibold text-white">
                  Load Averages
                </h2>
                <Activity />
              </div>
              <div className="text-white mt-2">
                {usageData?.loadAverages.join(" | ")}
              </div>
            </div>

            <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-row">
                <h2 className="text-xl font-semibold text-white">Uptime</h2>
                <Clock7 />
              </div>
              <div className="text-white mt-2">
                {usageData?.uptime
                  ? formatUptime(usageData.uptime)
                  : "Calculating..."}
              </div>
            </div>

            <div className="bg-white/30 p-5 rounded-xl backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between flex-row">
                <h2 className="text-xl font-semibold text-white">MongoDB Status</h2>
                <Server />
              </div>
              <div
                className={`text-white mt-2 font-semibold ${
                  usageData?.mongoDBStatus.status === "connected"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {usageData?.mongoDBStatus.message === "connected" ?  <p className="text-red-500">Unhealthy</p> : <p className="text-green-500 flex flex-row space-x-3"><Leaf/> <span className="">Healthy</span></p>}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

const ProgressBar = ({ value }: { value: number }) => {
  return (
    <div className="w-full h-2 bg-gray-400 rounded-full">
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default LimitsPage;
