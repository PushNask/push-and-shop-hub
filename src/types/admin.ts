export interface Admin {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "super_admin";
  region?: string;
  is_verified: boolean;
  created_at?: string;
  country?: string;
  phone?: string;
}

export interface NewAdmin {
  name: string;
  email: string;
  role: string;
  region: string;
}