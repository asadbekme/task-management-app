"use client";

import { useState, useEffect } from "react";
import { Database, Wifi, WifiOff } from "lucide-react";

export const StorageIndicator = () => {
  const [isUsingApi, setIsUsingApi] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Check if we're using the API
    const apiKey = process.env.NEXT_PUBLIC_JSONSTORAGE_API_KEY;
    const useApi = process.env.NEXT_PUBLIC_USE_API === "true";
    setIsUsingApi(useApi && !!apiKey);

    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isUsingApi === null) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-md px-3 py-2 flex items-center text-xs">
      {isOnline ? (
        <Wifi size={14} className="text-green-500 mr-1" />
      ) : (
        <WifiOff size={14} className="text-red-500 mr-1" />
      )}
      <span className="mr-2">{isOnline ? "Online" : "Offline"}</span>
      <Database
        size={14}
        className={isUsingApi ? "text-blue-500" : "text-amber-500"}
      />
      <span className="ml-1">
        {isUsingApi ? "Cloud Storage" : "Local Storage"}
      </span>
    </div>
  );
};
