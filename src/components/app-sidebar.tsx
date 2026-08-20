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
      {label && <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title} size="lg">
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
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
        <div className="flex items-center gap-2.5 px-2 py-3">
          <img src={logo} alt="Bloom logo" width={36} height={36} className="rounded-lg" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold">Bloom</span>
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
