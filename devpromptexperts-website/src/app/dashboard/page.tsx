// app/dashboard/page.tsx
"use client";
import AboutPage from "../about/page";
import Overview from "./overview";
import { useState } from "react";

export default function DashboardPage() {
  const [showOverview, setShowOverview] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <Overview/>
        <Overview/>
        <Overview/>
        <AboutPage/>
    </div>
  );
}
