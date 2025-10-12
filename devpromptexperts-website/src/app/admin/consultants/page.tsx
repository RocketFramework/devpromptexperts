"use client";

import { useState, useEffect } from "react";
import { getConsultants, updateConsultantStage } from "@/lib/consultants";
import { Consultant } from "@/types/consultant";
import { useSession } from "next-auth/react";
import type { OnboardingStage } from "@/types/consultant";

import ConsultantOnboardingTable from "@/components/ConsultantOnboardingTable";

export default function AdminConsultantsPage() {
  const { data: session, status } = useSession();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Consultant>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filters
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string | "">("");
  const [countryFilter, setCountryFilter] = useState<string | "">("");

  useEffect(() => {
    if (!session) return;

    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const data = await getConsultants();
        setConsultants(data);
      } catch (err) {
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, [session]);

  const handleSort = (key: keyof Consultant) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleStageUpdate = async (id: string, newStage: OnboardingStage) => {
    await updateConsultantStage(id, newStage);
    setConsultants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage} : c))
    );
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You must be signed in as an admin to view this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Consultant Onboarding Requests</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Stages</option>
          <option value="bio">Bio</option>
          <option value="interview">Interview</option>
          <option value="probation">Probation</option>
          <option value="active">Active</option>
        </select>
        <input
          type="text"
          placeholder="Filter by country..."
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <ConsultantOnboardingTable
        consultants={consultants
          .filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter((c) => (!stageFilter ? true : c.stage === stageFilter))
          .filter((c) =>
            !countryFilter ? true : c.country?.toLowerCase().includes(countryFilter.toLowerCase())
          )
          .slice((page - 1) * pageSize, page * pageSize)}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        onStageUpdate={handleStageUpdate}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(consultants.length / pageSize) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
