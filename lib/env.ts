// Environment variables with fallbacks
export const ENV = {
  // Add your jsonstorage.net API key in .env.local as NEXT_PUBLIC_JSONSTORAGE_API_KEY
  JSONSTORAGE_API_KEY: process.env.NEXT_PUBLIC_JSONSTORAGE_API_KEY || "",

  // Flag to determine if we should use the API or just local storage
  USE_API: process.env.NEXT_PUBLIC_USE_API === "true",

  // Development mode detection
  IS_DEV: process.env.NODE_ENV === "development",
};
