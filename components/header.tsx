"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./mobile-menu";
import { Button } from "./ui/button";

export const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "List View", path: "/dashboard" },
    { name: "Kanban Board", path: "/kanban" },
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            Task Manager
          </Link>

          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <p className="text-sm text-gray-700">
              {user?.username} {user?.role === "admin" && "(Admin)"}
            </p>
            <button
              onClick={logout}
              className="flex items-center text-gray-700 hover:text-red-600"
              aria-label="Logout"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>

          <Button
            onClick={toggleMobileMenu}
            size="sm"
            variant="ghost"
            className="md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={toggleMobileMenu}
          navItems={navItems}
          isActive={isActive}
        />
      )}
    </header>
  );
};
