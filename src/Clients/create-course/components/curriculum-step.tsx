import { useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  GripVerticalIcon,
  LockIcon,
  LockOpenIcon,
  PlusIcon,
  Trash2Icon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createLesson } from "../services/createLesson.service";
import { createSection } from "../services/createSection.service";

// A quiz answer belongs to one question and only one option should be correct.
type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// A quiz question belongs to one section.
type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

// A lesson keeps both a local UI id and an optional server id after API creation.
export type CurriculumLesson = {
  id: string;
  lessonId?: number;
  title: string;
  duration: string;
  access: "Paid" | "Free";
  fileName: string;
};

// A section also keeps both a local UI id and an optional server id.
export type CurriculumSection = {
  id: string;
  sectionId?: number;
  title: string;
  lessons: CurriculumLesson[];
  quizTitle: string;
  quizQuestions: QuizQuestion[];
};

type CurriculumStepProps = {
  courseId: number | null;
  sections: CurriculumSection[];
  onChange: (sections: CurriculumSection[]) => void;
};

// Generates a temporary id for client-side rendering before the API returns real ids.
function createLocalId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createQuestion(): QuizQuestion {
  return {
    id: createLocalId("question"),
    prompt: "",
    options: [
      { id: createLocalId("option-1"), text: "", isCorrect: true },
      { id: createLocalId("option-2"), text: "", isCorrect: false },
      { id: createLocalId("option-3"), text: "", isCorrect: false },
      { id: createLocalId("option-4"), text: "", isCorrect: false },
    ],
  };
}

function createLocalSection(): CurriculumSection {
  return {
    id: createLocalId("section"),
    title: "",
    lessons: [],
    quizTitle: "Quiz Title",
    quizQuestions: [createQuestion()],
  };
}

function getFileNameWithoutExtension(fileName: string) {
  const parts = fileName.split(".");
  parts.pop();
  return parts.join(".") || fileName;
}

function readNumericId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

// Keeps response parsing in one place so the main flow reads more clearly.
function getCreatedSectionId(data: any): number | null {
  return (
    readNumericId(data?.section?.id) ??
    readNumericId(data?.sections?.id) ??
    readNumericId(data?.data?.section?.id) ??
    readNumericId(data?.data?.id) ??
    readNumericId(data?.id)
  );
}

// Same idea for lesson creation responses.
function getCreatedLessonId(data: any): number | null {
  return (
    readNumericId(data?.lesson?.id) ??
    readNumericId(data?.lessons?.id) ??
    readNumericId(data?.data?.lesson?.id) ??
    readNumericId(data?.data?.id) ??
    readNumericId(data?.id)
  );
}

export function CurriculumStep({
  courseId,
  sections,
  onChange,
}: CurriculumStepProps) {
  const { accessToken } = useAuth();
  const [quizEditorSectionId, setQuizEditorSectionId] = useState<string | null>(null);

  const editingSection = useMemo(
    () => sections.find((section) => section.id === quizEditorSectionId) ?? null,
    [quizEditorSectionId, sections]
  );

  // This helper replaces the full section list using the latest list from the parent page.
  const replaceSections = (
    updater: (currentSections: CurriculumSection[]) => CurriculumSection[]
  ) => {
    onChange(updater(sections));
  };

  // This helper updates just one section by its local UI id.
  const updateSectionByLocalId = (
    localSectionId: string,
    updater: (section: CurriculumSection) => CurriculumSection
  ) => {
    replaceSections((currentSections) =>
      currentSections.map((section) =>
        section.id === localSectionId ? updater(section) : section
      )
    );
  };

  const ensureSectionId = async (
    localSectionId: string,
    sectionIndex: number,
    nextTitle?: string
  ) => {
    const currentSection = sections.find((section) => section.id === localSectionId);

    if (!currentSection) {
      toast.error("Section not found.");
      return null;
    }

    if (currentSection.sectionId) {
      return currentSection.sectionId;
    }

    const trimmedTitle = (nextTitle ?? currentSection.title).trim();

    if (!trimmedTitle) {
      toast.warning("Save the section title first before uploading lessons.");
      return null;
    }

    if (!courseId) {
      toast.warning("Create the course first so sections can be attached to it.");
      return null;
    }

    if (!accessToken) {
      toast.warning("You need to be logged in before creating sections.");
      return null;
    }

    const data = await createSection({
      courseId,
      title: trimmedTitle,
      position: sectionIndex + 1,
      accessToken,
    });

    const createdSectionId = getCreatedSectionId(data);

    if (!createdSectionId) {
      toast.error("Section created, but the server did not return section id.");
      return null;
    }

    updateSectionByLocalId(localSectionId, (section) => ({
      ...section,
      title: trimmedTitle,
      sectionId: createdSectionId,
    }));

    return createdSectionId;
  };

  const addSection = () => {
    onChange([...sections, createLocalSection()]);
  };

  const deleteSection = (localSectionId: string) => {
    replaceSections((currentSections) =>
      currentSections.filter((section) => section.id !== localSectionId)
    );
  };

  // Save the local title first so the UI feels instant, then create the section on the server.
  const handleSaveSectionTitle = async (
    section: CurriculumSection,
    sectionIndex: number,
    nextTitle: string
  ) => {
    const trimmedTitle = nextTitle.trim();

    updateSectionByLocalId(section.id, (currentSection) => ({
      ...currentSection,
      title: trimmedTitle,
    }));

    // If the section already exists on the server, we stop here because there is no update API yet.
    if (section.sectionId) {
      return;
    }

    if (!trimmedTitle) {
      return;
    }

    await ensureSectionId(section.id, sectionIndex, trimmedTitle);
  };

  // Uploading a lesson requires a saved section id because the lesson endpoint is nested under a section.
  const handleVideoUpload = async (
    section: CurriculumSection,
    sectionIndex: number,
    lessonPosition: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!accessToken) {
      toast.warning("You need to be logged in before creating lessons.");
      event.target.value = "";
      return;
    }

    const sectionId = await ensureSectionId(section.id, sectionIndex);

    if (!sectionId) {
      event.target.value = "";
      return;
    }

    const defaultLessonTitle = getFileNameWithoutExtension(file.name);

    const data = await createLesson({
      sectionId,
      title: defaultLessonTitle,
      is_free_preview: false,
      position: lessonPosition,
      video: file,
      accessToken,
    });

    if (!data) {
      event.target.value = "";
      return;
    }

    const lesson: CurriculumLesson = {
      id: createLocalId("lesson"),
      lessonId: getCreatedLessonId(data) ?? undefined,
      title: defaultLessonTitle,
      duration: "08:45",
      access: "Paid",
      fileName: file.name,
    };

    updateSectionByLocalId(section.id, (currentSection) => ({
      ...currentSection,
      lessons: [...currentSection.lessons, lesson],
    }));

    event.target.value = "";
  };

  const handleSaveLessonTitle = (
    localSectionId: string,
    localLessonId: string,
    nextTitle: string
  ) => {
    updateSectionByLocalId(localSectionId, (currentSection) => ({
      ...currentSection,
      lessons: currentSection.lessons.map((lesson) =>
        lesson.id === localLessonId ? { ...lesson, title: nextTitle.trim() } : lesson
      ),
    }));
  };

  const handleToggleLessonAccess = (localSectionId: string, localLessonId: string) => {
    updateSectionByLocalId(localSectionId, (currentSection) => ({
      ...currentSection,
      lessons: currentSection.lessons.map((lesson) =>
        lesson.id === localLessonId
          ? {
              ...lesson,
              access: lesson.access === "Paid" ? "Free" : "Paid",
            }
          : lesson
      ),
    }));
  };

  const handleDeleteLesson = (localSectionId: string, localLessonId: string) => {
    updateSectionByLocalId(localSectionId, (currentSection) => ({
      ...currentSection,
      lessons: currentSection.lessons.filter((lesson) => lesson.id !== localLessonId),
    }));
  };

  const handleSaveQuizTitle = (localSectionId: string, nextQuizTitle: string) => {
    updateSectionByLocalId(localSectionId, (currentSection) => ({
      ...currentSection,
      quizTitle: nextQuizTitle.trim(),
    }));
  };

  return (
    <section className="mx-auto max-w-255">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b2430]">Curriculum</h1>
          <p className="text-lg text-[#667085]">Add lessons and quizzes to your sections.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={addSection}
          className="h-12 rounded-full border-[#EAB308] bg-white px-6 text-sm font-medium text-[#EAB308] hover:bg-[#fff8db] hover:text-[#d59f00]"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-[24px] bg-white px-8 py-24 text-center shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
          <h2 className="text-5xl font-bold tracking-tight text-[#111827]">No Sections Yet</h2>
          <p className="mx-auto mt-8 max-w-155 text-[22px] leading-relaxed text-[#111827]">
            Start building your curriculum by adding your first section with video lessons and
            quizzes
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <article
              key={section.id}
              className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.08)]"
            >
              <div className="flex items-center gap-4 border-b border-[#eceff3] px-6 py-5">
                <button
                  type="button"
                  draggable
                  className="cursor-grab text-[#667085] active:cursor-grabbing"
                  aria-label="Drag section"
                >
                  <GripVerticalIcon className="h-4 w-4" />
                </button>
                <span className="text-[32px] font-bold leading-none text-[#111827]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <InlineEditableText
                  value={section.title}
                  placeholder="Enter section title"
                  onSave={(title) => handleSaveSectionTitle(section, index, title)}
                  className="text-[15px] font-semibold text-[#111827]"
                />
                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  className="ml-auto text-[#98a2b3] transition hover:text-[#111827]"
                  aria-label="Delete section"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 rounded-[18px] border border-[#EAB308] bg-white px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAB308] text-[#111827]">
                      <VideoIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
                        Video Lesson • {lesson.duration}
                      </p>
                      <InlineEditableText
                        value={lesson.title}
                        placeholder="Enter lesson title"
                        onSave={(title) => handleSaveLessonTitle(section.id, lesson.id, title)}
                        className="mt-1 text-[17px] text-[#111827]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleLessonAccess(section.id, lesson.id)}
                      className={cn(
                        "inline-flex h-8 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                        lesson.access === "Paid"
                          ? "border-[#d0d5dd] text-[#344054]"
                          : "border-[#EAB308] text-[#111827]"
                      )}
                    >
                      {lesson.access === "Paid" ? (
                        <LockIcon className="h-3.5 w-3.5" />
                      ) : (
                        <LockOpenIcon className="h-3.5 w-3.5" />
                      )}
                      {lesson.access}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(section.id, lesson.id)}
                      className="text-[#98a2b3] transition hover:text-[#111827]"
                      aria-label="Delete lesson"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d8dde6] px-6 py-12 text-center transition hover:border-[#EAB308] hover:bg-[#fffdf1]">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(event) =>
                      handleVideoUpload(section, index, section.lessons.length + 1, event)
                    }
                  />
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#667085] text-[#667085]">
                    <VideoIcon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#667085]">
                    New Video Lesson
                  </span>
                </label>

                <div className="flex flex-col gap-4 rounded-[20px] bg-[#111827] px-4 py-4 text-white md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/14 text-white">
                      <CircleHelpIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                        Interactive Quiz
                      </p>
                      <InlineEditableText
                        value={section.quizTitle}
                        placeholder="Quiz Title"
                        onSave={(quizTitle) => handleSaveQuizTitle(section.id, quizTitle)}
                        className="mt-1 text-[17px] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setQuizEditorSectionId(section.id)}
                    className="h-9 rounded-full bg-[#EAB308] px-5 text-sm font-medium text-[#111827] hover:bg-[#d9a908]"
                  >
                    Build Questions
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingSection ? (
        <QuestionBuilderModal
          section={editingSection}
          onClose={() => setQuizEditorSectionId(null)}
          onSave={(questions) =>
            updateSectionByLocalId(editingSection.id, (currentSection) => ({
              ...currentSection,
              quizQuestions: questions,
            }))
          }
        />
      ) : null}
    </section>
  );
}

function InlineEditableText({
  value,
  placeholder,
  onSave,
  className,
}: {
  value: string;
  placeholder: string;
  onSave: (nextValue: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onSave(draft.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            save();
          }

          if (event.key === "Escape") {
            setDraft(value);
            setIsEditing(false);
          }
        }}
        placeholder={placeholder}
        className={cn("h-9 border-none px-0 shadow-none focus-visible:ring-0", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      className={cn("h-9 min-w-0 text-left", className, value ? "" : "text-[#98a2b3]")}
    >
      {value || placeholder}
    </button>
  );
}

function QuestionBuilderModal({
  section,
  onClose,
  onSave,
}: {
  section: CurriculumSection;
  onClose: () => void;
  onSave: (questions: QuizQuestion[]) => void;
}) {
  const [draftQuestions, setDraftQuestions] = useState<QuizQuestion[]>(section.quizQuestions);

  const updateQuestion = (
    questionId: string,
    updater: (question: QuizQuestion) => QuizQuestion
  ) => {
    setDraftQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? updater(question) : question
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 px-4 py-8">
      <div className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-[0_28px_80px_rgba(17,24,39,0.3)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-tight text-[#111827]">Build Questions</h2>
          <button type="button" onClick={onClose} className="text-[#667085]">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {draftQuestions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="rounded-[18px] border border-[#e4e7ec] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  Question {questionIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDraftQuestions((currentQuestions) =>
                      currentQuestions.length === 1
                        ? currentQuestions
                        : currentQuestions.filter((item) => item.id !== question.id)
                    )
                  }
                  className="text-[#98a2b3] transition hover:text-[#111827]"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>

              <Input
                value={question.prompt}
                onChange={(event) =>
                  updateQuestion(question.id, (currentQuestion) => ({
                    ...currentQuestion,
                    prompt: event.target.value,
                  }))
                }
                placeholder="Enter your question"
                className="h-10 rounded-2xl border-[#d9dde5] px-4 text-sm"
              />

              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  Answer Options (Click To Mark Correct)
                </p>
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(question.id, (currentQuestion) => ({
                          ...currentQuestion,
                          options: currentQuestion.options.map((item) => ({
                            ...item,
                            isCorrect: item.id === option.id,
                          })),
                        }))
                      }
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
                        option.isCorrect
                          ? "border-[#EAB308] bg-[#EAB308] text-[#111827]"
                          : "border-[#d0d5dd] bg-white text-transparent"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <Input
                      value={option.text}
                      onChange={(event) =>
                        updateQuestion(question.id, (currentQuestion) => ({
                          ...currentQuestion,
                          options: currentQuestion.options.map((item) =>
                            item.id === option.id
                              ? { ...item, text: event.target.value }
                              : item
                          ),
                        }))
                      }
                      placeholder="Answer option"
                      className="h-11 rounded-2xl border-[#d9dde5] px-4 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(question.id, (currentQuestion) => ({
                          ...currentQuestion,
                          options: currentQuestion.options.map((item) =>
                            item.id === option.id ? { ...item, text: "" } : item
                          ),
                        }))
                      }
                      className="text-[#667085]"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setDraftQuestions((currentQuestions) => [...currentQuestions, createQuestion()])
            }
            className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#d0d5dd] px-4 py-4 text-sm font-medium text-[#111827] transition hover:border-[#EAB308] hover:bg-[#fffdf1]"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Question
          </button>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 rounded-full px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave(draftQuestions);
              onClose();
            }}
            className="h-10 rounded-full bg-[#111827] px-4 text-white hover:bg-[#0b1220]"
          >
            Save Questions
          </Button>
        </div>
      </div>
    </div>
  );
}
