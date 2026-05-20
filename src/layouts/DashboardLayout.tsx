import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-[#fcfbf7]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#ece8df] bg-[#fcfbf7]/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-10 w-10 rounded-xl border border-[#ece8df] bg-white text-[#101828] shadow-none hover:bg-[#f8f7f3]" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#101828]">PlovDev</span>
              <span className="hidden text-xs text-[#667085] md:block">
                Course creator workspace
              </span>
            </div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
