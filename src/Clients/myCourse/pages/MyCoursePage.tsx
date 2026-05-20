import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { viewCourse, viewCourseById } from "../services/myCourses.service";
import { useAuth } from "@/auth/context/AuthContext";
import type { ICourse } from "@/types/Courses";
import { useNavigate } from "react-router-dom";


function MyCoursePage() {
  const [course, setCourse] = useState<ICourse[]>([]);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!accessToken) return;

      const data = await viewCourse(accessToken);
      setCourse(data.courses);
    };
    fetchCourse();
  }, [accessToken]);

  const handleEdit = async (id: number) => {
    const data = await viewCourseById({ courseId: id, accessToken });
    console.log("data to update", data);
    navigate(`/teacher/create-course/${id}`);
  };
  return (
    <>
      <div className="p-5  grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2.5">
        {course.map((c) => {
          return (
            <Card
              key={c.id}
              className="bg-white flex flex-col gap-y-2 rounded-xl "
            >
              <img src={c.thumbnailUrl} alt={c.title_en} className="h-62.5" />
              <div className="p-2.5 pb-0 pt-0">
                <h5 className="text-[13px] text-red-700">
                  {c.category[0]?.name ?? "No category"}
                </h5>
                <h2 className="font-bold text-lg">{c.title_en}</h2>
                <div className="flex justify-between mb-2">
                  <h2>{c.totalStudents}</h2>
                  <h2 className="text-red-700">{c.avgRating}</h2>
                </div>

                <div className="flex gap-2 items-center" >
                  <button className="bg-black text-white text-center text-sm w-full rounded-sm p-2 cursor-pointer" 
                    onClick={() => handleEdit(c.id)}>
                    Edit
                  </button>
                  <button className="" >
                    <Trash2 className="text-red-500 text-xl" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default MyCoursePage;
