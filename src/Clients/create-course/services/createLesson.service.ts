import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;

interface LessonProps {
  sectionId: number;
  title: string;
  is_free_preview: boolean;
  position: number;
  video?: File;
  accessToken?: string | null;
}

// Creates one lesson for a section. We keep this separate so the component can stay focused
// on UI behavior and simply call the service when the user uploads a video.
export const createLesson = async ({
  sectionId,
  title,
  is_free_preview,
  position,
  video,
  accessToken,
}: LessonProps) => {
  try {
    if (!sectionId || !title.trim() || position <= 0) {
      toast.warning("Please fill all the required input fields!");
      return null;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_free_preview", is_free_preview.toString());
    formData.append("position", position.toString());

    if (video) {
      formData.append("video", video);
    }

    const res = await fetch(`${BASE_URL}/section/${sectionId}/lesson`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to create lesson.");
      return null;
    }

    toast.success("Create lesson successfully!");
    return data ?? [];
  } catch (error: any) {
    console.log(error.message);
  }
};
