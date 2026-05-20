export type CourseStatus = "draft" | "pending review" | "published" | "archived" | "rejected";

export interface ICourse {
  id: number;
  title_en: string;
  description: string | null;      // Matches allowNull: true
  what_you_learn: string | null;   // Matches allowNull: true
  archievedAt: Date | null;        // Matches DataTypes.DATE
  thumbnailUrl: string ;
  thumbnail ?: File
  thumbnailPublicId: string | null; // Added missing field
  price?: number;                   // Handled as number in frontend
  original_price?: number;          // Handled as number in frontend
  is_best_seller?: boolean;
  avgRating: number;               // Handled as number in frontend
  totalStudents: number;
  totalReview: number;
  status: CourseStatus;            // Strict ENUM match
  teacherId: number;
  rejected_reason: string | null;  // Matches allowNull: true
  category_id ?: number ;
  accessToken ?: string | null 
  courseId ?: number
  category : ICategory[]
}

export interface ICategory {
    id : number
    name : string ;
    iconUrl : string | null
}