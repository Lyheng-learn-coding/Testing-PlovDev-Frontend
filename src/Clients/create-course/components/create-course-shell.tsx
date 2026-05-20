import type { ReactNode } from "react";
import { BookOpenTextIcon, Grid2x2Icon, Settings2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

export type CreateCourseStep = "basic" | "curriculum" | "pricing";

type CreateCourseShellProps = {
  activeStep: CreateCourseStep;
  onStepChange: (step: CreateCourseStep) => void;
  children: ReactNode;
};

const steps = [
  {
    id: "basic" as const,
    label: "Basic Info",
    icon: BookOpenTextIcon,
  },
  {
    id: "curriculum" as const,
    label: "Curriculum",
    icon: Grid2x2Icon,
  },
  {
    id: "pricing" as const,
    label: "Pricing & SEO",
    icon: Settings2Icon,
  },
];

export function CreateCourseShell({
  activeStep,
  onStepChange,
  children,
}: CreateCourseShellProps) {
  return (
    <div className="flex min-h-svh bg-[#fcfbf7]">
      <aside className="w-full max-w-[248px] border-r border-[#ece8df] bg-[#fcfbf7] px-5 py-8">
        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = step.id === activeStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepChange(step.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-[18px] border px-4 py-4 text-left transition-colors",
                  isActive
                    ? "border-[#f6be00] bg-[#ffe976] shadow-[0_0_0_1px_rgba(246,190,0,0.2)]"
                    : "border-transparent bg-transparent hover:bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    isActive ? "bg-[#ffcc00] text-[#111827]" : "bg-[#f1f2f4] text-[#667085]"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold uppercase tracking-tight",
                      isActive ? "text-[#111827]" : "text-[#667085]"
                    )}
                  >
                    {step.label}
                  </span>
                  {isActive ? <span className="h-2.5 w-2.5 rounded-full bg-[#f6be00]" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-8 md:px-10 lg:px-16">{children}</main>
    </div>
  );
}
