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
  { title: "My course", url: "/teacher/my-course", icon: BookOpenIcon },
  { title: "My learning", url: "/my-learning", icon: GraduationCapIcon },
  { title: "Student", url: "/student", icon: UsersIcon },
]

const contentItems = [
  { title: "Create course", url: "/teacher/create-course", icon: PlusCircleIcon },
  { title: "Q & A", url: "/qna", icon: MessageCircleQuestionIcon },
  { title: "Payments", url: "/payments", icon: CreditCardIcon },
  { title: "Payouts", url: "/payouts", icon: DollarSignIcon },
]

const accountItems = [
  { title: "My Profile", url: "/profile", icon: UserCircleIcon },
  { title: "Setting", url: "/setting", icon: SettingsIcon },
]

export function AppSidebar({ ...props }) {
  const location = useLocation()

  const isActive = (url: string) => location.pathname === url

  const menuItemClass = (url: string) =>
    isActive(url)
      ? "bg-[#12c7cf] text-white font-semibold rounded-lg px-3 py-2.5 text-sm shadow-none"
      : "text-[#101828] hover:text-[#101828] hover:bg-[#eef7f8] rounded-lg px-3 py-2.5 text-sm transition-colors"

  const renderItems = (
    items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]
  ) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className={menuItemClass(item.url)}>
          <Link to={item.url} className="flex items-center gap-3">
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-[#ece8df] px-6 py-7">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#101828]">
            <Link to="/homepage">PlovDev</Link>
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-4 py-5">
        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#667085]">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(overviewItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#667085]">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(contentItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#667085]">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(accountItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#ece8df] px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-lg px-3 py-2.5 text-sm text-[#101828] transition-colors hover:bg-[#eef7f8] hover:text-[#101828]"
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
