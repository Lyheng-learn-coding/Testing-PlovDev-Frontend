import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

function MyCoursePage() {
  return (
    <>
      <div className="p-5  grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1">
        <Card className="bg-blue-500 flex flex-col gap-y-2 rounded-xl ">
          <img
            src="https://i.pinimg.com/736x/6c/df/12/6cdf1232b1f705573716e1c3733a7bbc.jpg"
            alt=""
            className="size-auto
        "
          />
          <div className="p-2.5 pb-0 pt-0">
            <h5 className="text-[13px] text-red-700">python</h5>
            <h2 className="font-bold text-lg">python title</h2>
            <div className="flex justify-between mb-2">
              <h2>100 students</h2>
              <h2 className="text-red-700">star rating</h2>
            </div>

            <div className="flex gap-2 items-center">
              <button className="bg-black text-white text-center text-sm w-full rounded-sm p-2 cursor-pointer">
                Edit
              </button>
              <button className="">
                <Trash2 className="text-red-500 text-xl" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default MyCoursePage;
