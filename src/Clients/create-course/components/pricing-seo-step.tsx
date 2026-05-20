import { CreditCardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PricingSeo = {
  mode: "free" | "premium";
  price: number;
};

type PricingSeoStepProps = {
  value: PricingSeo;
  onChange: (value: PricingSeo) => void;
};

export function PricingSeoStep({ value, onChange }: PricingSeoStepProps) {
 


  return (
    <section className="mx-auto max-w-230">
      <header className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#1b2430]">Pricing</h1>
        <p className="text-lg text-[#667085]">
          Value your knowledge and reach your audience.
        </p>
      </header>

      <div className="rounded-[24px] bg-white px-6 py-10 shadow-[0_18px_40px_rgba(17,24,39,0.08)] md:px-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3bf] text-[#f6be00]">
            <CreditCardIcon className="h-9 w-9" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#667085]">
            Course Enrollment Fee
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-4xl font-semibold text-[#667085]">$</span>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={value.mode === "free" ? 0 : value.price}
              onChange={(event) =>
                onChange({
                  ...value,
                  price: Number(event.target.value),
                })
              }
              disabled={value.mode === "free"}
              className="h-16 w-44 border-none px-0 text-center text-4xl font-bold shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onChange({ ...value, mode: "free", price: 0 })}
              className={cn(
                "rounded-full border px-8 py-4 text-sm font-semibold uppercase transition",
                value.mode === "free"
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d0d5dd] bg-white text-[#111827]"
              )}
            >
              Set Free
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  mode: "premium",
                  price: value.price === 0 ? 49.99 : value.price,
                })
              }
              className={cn(
                "rounded-full border px-8 py-4 text-sm font-semibold uppercase transition",
                value.mode === "premium"
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d0d5dd] bg-white text-[#111827]"
              )}
            >
              Premium
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <Button className="h-14 rounded-xl bg-[#ffcc00] px-8 text-lg font-medium text-[#111827] hover:bg-[#f6be00]">
          Request Publish
        </Button>
      </div>
    </section>
  );
}
