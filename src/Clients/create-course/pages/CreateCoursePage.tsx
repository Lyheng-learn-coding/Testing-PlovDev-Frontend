import { useState } from "react";

import { BasicInfoStep } from "../components/basic-info-step";
import {
  CreateCourseShell,
  type CreateCourseStep,
} from "../components/create-course-shell";
import {
  CurriculumStep,
  type CurriculumSection,
} from "../components/curriculum-step";
import { PricingSeoStep, type PricingSeo } from "../components/pricing-seo-step";

export default function CreateCoursePage() {
  const [activeStep, setActiveStep] = useState<CreateCourseStep>("basic");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [sections, setSections] = useState<CurriculumSection[]>([]);
  const [pricingSeo, setPricingSeo] = useState<PricingSeo>({
    mode: "premium",
    price: 49.99,
  });

  return (
    <CreateCourseShell activeStep={activeStep} onStepChange={setActiveStep}>
      {activeStep === "basic" ? (
        <BasicInfoStep
          onCreated={(createdCourseId) => {
            setCourseId(createdCourseId);
            setActiveStep("curriculum");
          }}
        />
      ) : null}
      {activeStep === "curriculum" ? (
        <CurriculumStep
          courseId={courseId}
          sections={sections}
          onChange={setSections}
        />
      ) : null}
      {activeStep === "pricing" ? (
        <PricingSeoStep value={pricingSeo} onChange={setPricingSeo} />
      ) : null}
    </CreateCourseShell>
  );
}
