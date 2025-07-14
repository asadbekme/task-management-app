import Link from "next/link";
import { LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: { name: string; path: string }[];
  isActive: (path: string) => boolean;
};

function MobileMenu({ isOpen, onClose, navItems, isActive }: MobileMenuProps) {
  const { logout, user } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Mobile Menu</SheetTitle>
        </SheetHeader>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium",
                isActive(item.path)
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={onClose}
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t border-gray-200">
            <p className="px-3 py-2 text-sm text-gray-700">
              {user?.username} {user?.role === "admin" && "(Admin)"}
            </p>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 w-full rounded-md"
              aria-label="Logout"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
