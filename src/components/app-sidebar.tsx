import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, Calendar, Trophy, TrendingUp, MessageCircleHeart, Hand, Settings } from "lucide-react";
import logo from "@/assets/bloom-logo.png";

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

const dailyItems = [
  { title: "Today", url: "/", icon: Home },
  { title: "Sensory Tools", url: "/sensory", icon: Sparkles },
  { title: "My Routine", url: "/routine", icon: Calendar },
  { title: "Rewards", url: "/rewards", icon: Trophy },
];

const supportItems = [
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "My Journey", url: "/journey", icon: MessageCircleHeart },
  { title: "Communication Coach", url: "/coach", icon: Hand },
];

const settingsItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (path: string) => (path === "/" ? currentPath === "/" : currentPath.startsWith(path));

  const renderGroup = (label: string, items: typeof dailyItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <img src={logo} alt="Bloom" width={32} height={32} className="rounded-md" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">Bloom</span>
            <span className="text-xs text-muted-foreground">Your gentle companion</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Daily", dailyItems)}
        {renderGroup("Support", supportItems)}
      </SidebarContent>
      <SidebarFooter>{renderGroup("", settingsItems)}</SidebarFooter>
    </Sidebar>
  );
}
