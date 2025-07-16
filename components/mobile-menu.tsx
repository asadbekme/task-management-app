import Link from "next/link";
import { Crown, LogOut, User } from "lucide-react";
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
  const isAdmin = user?.role === "admin";

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
        </div>
        <div className="px-6 py-2 absolute bottom-0 left-0 right-0 border-t border-gray-200">
          <div className="flex items-center gap-2 px-3 py-2">
            <User className="size-4 text-gray-600" />
            <p className="text-sm text-gray-700">
              {user?.username} {isAdmin && "(Admin)"}
            </p>
            {isAdmin && <Crown className="size-4 text-yellow-500" />}
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 w-full rounded-md"
            aria-label="Logout"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
