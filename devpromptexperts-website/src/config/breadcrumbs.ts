export const BREADCRUMB_LABELS: Record<string, string> = {
  client: "Client",
  consultant: "Consultant",
  seller: "Seller",
  admin: "Admin",
  dashboard: "Dashboard",
  onboarding: "Onboarding",
  rfp: "RFP",
  create: "Create",
  edit: "Edit",
  settings: "Settings",
  profile: "Profile",
  projects: "Projects",
  "my-projects": "My Projects",
  induction: "Induction",
  findconsultants: "Find Consultants",
  about: "About Us",
  blog: "Blog",
  auth: "Auth",
  login: "Login",
  register: "Register",
};

export const HIDDEN_BREADCRUMB_SEGMENTS = ["(auth)", "(site)"];

// Segments that should appear in the breadcrumb but are NOT clickable
export const NON_NAVIGABLE_SEGMENTS = ["client", "consultant", "seller", "admin"];
