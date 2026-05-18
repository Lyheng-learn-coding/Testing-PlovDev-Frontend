import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  GraduationCapIcon,
  UsersIcon,
  PlusCircleIcon,
  MessageCircleQuestionIcon,
  CreditCardIcon,
  DollarSignIcon,
  UserCircleIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"

const overviewItems = [
  { title: "Dashboard", url: "/dashboardpage", icon: LayoutDashboardIcon },
  { title: "My course", url: "/my-course", icon: BookOpenIcon },
  { title: "My learning", url: "/my-learning", icon: GraduationCapIcon },
  { title: "Student", url: "/student", icon: UsersIcon },
]

const contentItems = [
  { title: "Create course", url: "/create-course", icon: PlusCircleIcon },
  { title: "Q & A", url: "/qna", icon: MessageCircleQuestionIcon },
  { title: "Payments", url: "/payments", icon: CreditCardIcon },
  { title: "Payouts", url: "/payouts", icon: DollarSignIcon },
]

const accountItems = [
  { title: "My Profile", url: "/profile", icon: UserCircleIcon },
  { title: "Setting", url: "/setting", icon: SettingsIcon },
]

export function AppSidebar({ ...props }) {
  const location = useLocation()  // ← track current route

  const isActive = (url : any) => location.pathname === url  // ← check if active

  const menuItemClass = (url : any) =>
    isActive(url)
      ? "bg-[#00d4c8] text-white font-semibold rounded-lg px-3 py-2 text-sm"  // ← active style
      : "text-black hover:text-white hover:bg-[#1e2130] rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#00C3D0]"  // ← default style

  const renderItems = (items : any) =>
    items.map((item : any) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={menuItemClass(item.url)}
        >
          <a href={item.url} className="flex items-center gap-3">
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader className="px-4 py-4 border-b border-[#1e2130]">
        <div className="flex items-center gap-2">
          <h2><Link to = "/homepage">Logo Home</Link></h2>
          <span className="text-white font-semibold text-sm tracking-wide">User Create course</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-0">
        {/* OVERVIEW */}
        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="text-[#555e7a] text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(overviewItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CONTENT */}
        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="text-[#555e7a] text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(contentItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ACCOUNT */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#555e7a] text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(accountItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Logout */}
      <SidebarFooter className="px-2 py-3 border-t border-[#1e2130]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-black hover:text-white hover:bg-[#00C3D0] rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <button className="flex items-center gap-3 w-full">
                <LogOutIcon className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}