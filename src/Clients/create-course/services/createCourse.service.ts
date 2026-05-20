import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;

interface CourseProps {
  title_en: string;
  description: string;
  price: number;
  original_price?: number;
  what_you_learn?: string;
  category_id?: number;
  thumbnail?: File;
  accessToken?: string | null;
}

export const createCourse = async ({
  title_en,
  description,
  price,
  original_price,
  what_you_learn,
  category_id,
  thumbnail,
  accessToken,
}: CourseProps) => {
  try {

    if (!title_en || !description || price === undefined || !what_you_learn) {
      toast.warning("Please fill all the required input fields!");
      return null;
    }

    const formData = new FormData();
    formData.append("title_en", title_en);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("original_price", original_price?.toString() || "0");
    formData.append("what_you_learn", what_you_learn);
    if (category_id) {
      formData.append("category_id", category_id.toString());
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const res = await fetch(`${BASE_URL}/courses`, {
      method: "POST",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      return toast.error(data.message || "something went wrong!");
    }

    console.log("Course create:", data);

    toast.success("Course created successfully!");
    return data ?? [];
  } catch (error: any) {
    console.log(error.message);
  }
};

export const viewCourse = async () => {
  try {
    const res = await fetch(`${BASE_URL}/course`);
    const data = await res.json();

    console.log("Course data");

    return data ?? [];
  } catch (error: any) {
    console.log(error.message);
  }
};
