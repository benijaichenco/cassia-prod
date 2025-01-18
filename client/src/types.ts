export interface FragranceDataType {
  fragranceId: string;
  name: string;
  brand: string;
  longevity: string;
  sillage: string;
  type1: string;
  type2: string;
  type3: string;
  price: string;
  scentgn: string;
  combined_types: string;
  year: number;
  concentration: string;
  notes_base: string;
  notes_middle: string;
  notes_top: string;
  image_name: string;
  dom_color: string;
  season: "winter" | "summer" | "both (winter-leaning)" | "both (summer-leaning)";
  likeCount: number;
  likes: string[];
  dislikeCount: number;
  dislikes: string[];
}

export interface UserType {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isLoggedIn: boolean;
}

export interface CommentType {
  commentId: string;
  fragranceId: string;
  user: UserType;
  userId: string;
  createdAt: number;
  content: string;
  likeCount: number;
  likes: string[];
}

export interface SVGProps {
  className?: string;
  pathClassName?: string;
}
