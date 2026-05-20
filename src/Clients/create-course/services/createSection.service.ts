import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;

interface SectionProp {
  courseId?: number;
  title: string;
  position: number;
  accessToken: string | null;
}

// Creates one section for a course. The returned data is used by the curriculum step
// to store the real server section id back into local UI state.
export const createSection = async ({
  courseId,
  title,
  position,
  accessToken,
}: SectionProp) => {
  try {
    if (!courseId  || !title.trim() || position <= 0) {
      toast.warning("Please fill all the required input fields!");
      return null;
    }

    const sectionData = {
      title,
      position,
    };
    const res = await fetch(`${BASE_URL}/course/${courseId}/section`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sectionData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to create section.");
      return null;
    }

    toast.success("Section created successfully!");

    return data ?? [];
  } catch (error: any) {
    console.log(error.message);
    toast.error("Failed to create section.");
    return null;
  }
};
