export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  region: string;
  status: "active" | "inactive";
}

export interface NewAdmin {
  name: string;
  email: string;
  role: string;
  region: string;
}