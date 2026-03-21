"use client";
import { ChevronLeft, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { open, toggleSidebar } = useSidebar();
  return (
    <>
      <nav className="flex p-4 justify-between items-center top-0 sticky bg-background z-10">
        {/**LEFT */}
        {/* <SidebarTrigger/> */}
        <Button variant={"outlinenone"} onClick={toggleSidebar}>
          <ChevronLeft
            className={cn(
              "transition-transform duration-200",
              !open && "rotate-180",
            )}
          />
        </Button>

        {/**RIGHT */}
        <div className="flex items-center gap-4">
          <Link href="/">DashBoard</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlinenone" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-4 items-center outline-none">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-[1.2rm] w-[1.2rem] mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-[1.2rm] w-[1.2rem] mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => logoutAction()}
              >
                <LogOut className="h-[1.2rm] w-[1.2rem] mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
