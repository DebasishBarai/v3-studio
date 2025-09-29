'use client'

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Clapperboard,
  Play,
  Package,
  Folder,
  CreditCard,
  Settings,
  Coins,
  LucideIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

// Menu items data
const creativeToolsItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "AI Film", url: "/home", icon: Clapperboard },
  { title: "Short Video", url: "/ai-tools/short-video", icon: Play, badge: "New" },
  { title: "Product Ads", url: "/ai-tools/product-ads", icon: Package, badge: "New" },
];

const userItems: MenuItem[] = [
  { title: "My Projects", url: "/projects", icon: Folder },
  { title: "Pricing", url: "/pricing", icon: CreditCard, badge: "Discount" },
  { title: "Settings", url: "/settings", icon: Settings },
];

// Badge component
const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors border-transparent shadow text-xs bg-gradient-to-tr from-purple-600 to-pink-500 text-white ml-auto">
    {children}
  </div>
);

// Custom menu item component
const CustomMenuItem = ({ item }: { item: MenuItem }) => {

  const pathname = usePathname();

  const isActive = pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url} className="p-2 text-lg font-light flex gap-2 items-center hover:bg-secondary rounded-lg w-full">
          <item.icon className="h-5 w-5" />
          <span className="flex-1">{item.title}</span>
          {item.badge && <Badge>{item.badge}</Badge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
};

export function AppSidebar() {

  const user = useQuery(api.user.getUser)

  const addUser = useMutation(api.user.addUser)

  useEffect(() => {
    if (!user) {
      addUser()
    }
  }, [user, addUser])

  const credits = user?.credits ?? 0;

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-start">
          <Link href="/">
            <Image alt="logo" src="/logo.png" width={80} height={80} />
          </Link>
          <h1 className="text-2xl font-bold">Shorts AI</h1>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Creative Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Creative Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {creativeToolsItems.map((item) => (
                <CustomMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <CustomMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {/* Footer Links */}
        <div className="flex items-center justify-center">
          <ul className="flex items-center gap-3">
            <Link href="/contact-us">
              <li className="text-xs opacity-40">Contact Us</li>
            </Link>
            <span className="text-lg font-bold opacity-40">•</span>
            <Link href="/faq">
              <li className="text-xs opacity-40">FAQ</li>
            </Link>
          </ul>
        </div>

        {/* Credits Section */}
        <div className="p-4 border-t bg-muted rounded-md">
          <div className="mb-2 text-sm font-medium text-muted-foreground flex gap-2 items-center">
            <Coins className="h-4 w-4 text-yellow-400" />
            {`Remaining Credits: ${credits}`}
          </div>
          <Link href="/pricing">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 rounded-md px-3 text-xs w-full cursor-pointer">
              Add Credits
            </button>
          </Link>
        </div>

        {/* User Info Section */}
        <div className="flex gap-3 items-center">
          <UserButton />
          <h2 className="p-2 text-xs opacity-40">Copyright @AI Shorts</h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
