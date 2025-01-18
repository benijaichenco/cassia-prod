export interface TempUserType {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  expiresAt: Date;
}

export interface UserDataType {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

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

export interface WeatherDataType {
  main: {
    temp: number;
  };
}
