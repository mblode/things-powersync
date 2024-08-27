import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ArrowUp,
  ArrowDown,
  Wifi,
  WifiOff,
  Menu,
  Terminal,
  CheckSquare,
  LogOut,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    path: "/sql-console",
    title: "SQL Console",
    icon: Terminal,
  },
  {
    path: "/todo-lists",
    title: "TODO Lists",
    icon: CheckSquare,
  },
  {
    path: "/auth/login",
    title: "Sign Out",
    icon: LogOut,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <nav>
                <ul>
                  {NAVIGATION_ITEMS.map((item) => (
                    <li key={item.path} className="mb-2">
                      <Link
                        href={item.path}
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-2">
            <ArrowUp className="h-5 w-5" />
            <ArrowDown className="h-5 w-5" />
            <Wifi className="h-5 w-5" />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}
