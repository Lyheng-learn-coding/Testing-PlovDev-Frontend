import { useEffect, useState } from "react";

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
import { useParams } from "react-router-dom";

export default function CreateCoursePage() {
  const [activeStep, setActiveStep] = useState<CreateCourseStep>("basic");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [sections, setSections] = useState<CurriculumSection[]>([]);
  const [pricingSeo, setPricingSeo] = useState<PricingSeo>({
    mode: "premium",
    price: 49.99,
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const parsedId = Number(id)
      if (!isNaN(parsedId)) {
        setCourseId(parsedId);
      }
    } else {
      setCourseId(null); // Reset if navigating back to a clean creation page
    }
  }, [id]);


  return (
    <CreateCourseShell activeStep={activeStep} onStepChange={setActiveStep}>
      {activeStep === "basic" ? (
        <BasicInfoStep
          onCreated={(createdCourseId) => {
            setCourseId(courseId ? courseId : createdCourseId);
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
