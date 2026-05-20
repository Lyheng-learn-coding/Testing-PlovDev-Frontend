const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;

export const viewCourse =  async (accessToken : string | null) => {
   try {

     const res = await fetch(`${BASE_URL}/courses/me`, {
      credentials: "include" ,
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : undefined,
    });

    const data = await res.json();

    return data ?? []
    
   } catch (error : any) {
    console.log(error.message)
   }
}

export const viewCourseById =  async ({courseId , accessToken} : {courseId : number ,accessToken : string | null}) => {
   try {
     const res = await fetch(`${BASE_URL}/courses/me/${courseId}`, {
      credentials: "include" ,
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : undefined,
    });

    const data = await res.json();

    return data ?? []
    
   } catch (error : any) {
    console.log(error.message)
   }
}

