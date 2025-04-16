"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, LogOut } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "List View", path: "/dashboard" },
    { name: "Kanban Board", path: "/kanban" },
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Task Manager
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  {user.username} {user.role === "admin" && "(Admin)"}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-red-600"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-3 py-2 text-sm text-gray-700">
                  {user.username} {user.role === "admin" && "(Admin)"}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 w-full rounded-md"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
