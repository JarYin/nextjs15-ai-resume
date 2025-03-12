"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="shadow-sm">
      <div className="p-2 mx-auto flex max-w-7xl items-center justify-between gap-2">
        <a href="/resumes" className="flex items-center gap-2">
          {isClient && <Image src={logo} alt="logo" width={35} height={35} />}
          <span className="text-xl font-bold tracking-tight">
            Ai Resume Builder
          </span>
        </a>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: { avatarBox: { width: 35, height: 35 } },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
