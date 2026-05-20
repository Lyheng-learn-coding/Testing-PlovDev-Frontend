const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1`;


export const viewCategory = async () => {
    try {
        const res = await fetch(`${BASE_URL}/category` ) ;
        const data = await res.json() ;

        return data ?? []
    } catch (error : any) {
        console.log(error.message)
    }
}

