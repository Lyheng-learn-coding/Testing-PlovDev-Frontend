import {
  useEffect,
  useState,
  useRef,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  FileTextIcon,
  ImagePlusIcon,
  TagIcon,
  TypeIcon,
  UploadIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  viewCategory,
  type ICategory,
} from "../services/createCategory.service";
import { createCourse } from "../services/createCourse.service";
import { useAuth } from "@/auth/context/AuthContext";
import { toast } from "react-toastify";

type BasicInfoStepProps = {
  onCreated?: (courseId: number) => void;
};

export function BasicInfoStep({ onCreated }: BasicInfoStepProps) {
  const { accessToken } = useAuth();
  const [title_en, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price] = useState("");
  const [originalPrice] = useState("");
  const [whatYouLearn, setWhatYouLearn] = useState("");
  const [category, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // HANDLE THUMBNAIL CHANGE
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // HANDLE CREATE COURSE
  const handleCreateCourse = async () => {
    const data = await createCourse({
      title_en,
      description,
      price: parseFloat(price) || 0,
      original_price: parseFloat(originalPrice) || 0,
      what_you_learn: whatYouLearn,
      category_id: selectedCategory ? Number(selectedCategory) : undefined,
      thumbnail: thumbnail || undefined,
      accessToken,
    });

    if (!data) return;

    const createdCourseId = data?.course?.id;

    if (!createdCourseId) {
      toast.error("Course created, but course id was not returned.");
      return;
    }

    onCreated?.(Number(createdCourseId));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await viewCategory();
      console.log("category:", data);
      setCategories(data.categories);
    };
    fetchCategory();
  }, []);

  return (
    <section className="mx-auto max-w-180">
      <header className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#1b2430]">
          Course Info
        </h1>
        <p className="text-lg text-[#667085]">
          Define the core identity of your PlovDev course.
        </p>
      </header>

      <div className="rounded-[22px] bg-white p-6 shadow-[0_18px_40px_rgba(17,24,39,0.08)] md:p-10">
        <div className="space-y-6">
          <FormField icon={TypeIcon} label="Course Title">
            <Input
              value={title_en}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input course title"
              className="h-12 rounded-2xl border-[#d9dde5] px-4 text-[15px] shadow-none"
            />
          </FormField>

          <FormField icon={FileTextIcon} label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Input description"
              className="min-h-24 w-full rounded-2xl border border-[#d9dde5] px-4 py-3 text-[15px] text-[#111827] outline-none transition focus:border-[#f6be00] focus:ring-4 focus:ring-[#ffe9a6]"
            />
          </FormField>

          <FormField icon={FileTextIcon} label="What You Will Learn">
            <textarea
              value={whatYouLearn}
              onChange={(e) => setWhatYouLearn(e.target.value)}
              placeholder="Optional"
              className="min-h-24 w-full rounded-2xl border border-[#d9dde5] px-4 py-3 text-[15px] text-[#111827] outline-none transition focus:border-[#f6be00] focus:ring-4 focus:ring-[#ffe9a6]"
            />
          </FormField>

          <FormField icon={TagIcon} label="Category">
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 w-full rounded-2xl border-[#d9dde5] px-4 text-[15px] shadow-none">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#e7e5df]">
                {category.map((cate) => (
                  <SelectItem key={cate.id} value={cate.id.toString()}>
                    {cate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* THUMBNAIL UPLOAD */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
              <ImagePlusIcon className="h-4 w-4" />
              <Label>Course Thumbnail Image</Label>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d9dde5] bg-[#fcfcfb] px-6 py-10 text-center transition hover:border-[#f6be00] hover:bg-[#fffdf1]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleThumbnailChange} // ← use handler
              />

              {/* SHOW PREVIEW IF FILE SELECTED */}
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7f8] text-[#667085]">
                  <UploadIcon className="h-6 w-6" />
                </span>
              )}

              <span className="text-base font-medium text-[#111827]">
                {thumbnail
                  ? thumbnail.name
                  : "Click to upload or drag and drop"}
              </span>
              <span className="mt-2 text-sm text-[#98a2b3]">
                PNG, JPG, WEBP up to 5MB
              </span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleCreateCourse}
            className="w-full h-12 rounded-2xl bg-[#f6be00] text-[#111827] font-semibold text-[15px] hover:bg-[#e5b000] transition"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function FormField({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
        <Icon className="h-4 w-4" />
        <Label>{label}</Label>
      </div>
      {children}
    </div>
  );
}
