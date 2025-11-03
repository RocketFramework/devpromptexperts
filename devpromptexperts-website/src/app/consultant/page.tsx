"use client";

import { useState, useEffect } from "react";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import { ConsultantsBusinessService } from "@/services/business/ConsultantBusinessService";
import { useSession } from "next-auth/react";
import type { ConsultantStage as OnboardingStage } from "@/types/";
import ConsultantOnboardingTable from "@/components/ConsultantOnboardingTable";

// Use the actual DTO type instead of recreating it
type ConsultantDTO = Awaited<ReturnType<typeof ConsultantsBusinessService.getConsultantsForAdmin>>[0];

export default function AdminConsultantsPage() {
  const { data: session, status } = useSession();
  const [consultants, setConsultants] = useState<ConsultantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting
  const [sortKey, setSortKey] = useState<keyof ConsultantDTO>("name");
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
      setError(null);
      try {
        const data = await ConsultantsBusinessService.getConsultantsForAdmin();
        setConsultants(data);
      } catch (err) {
        console.error("Error fetching consultants:", err);
        setError("Failed to load consultants");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, [session]);

  const handleSort = (key: string | number | symbol) => {
    const consultantKey = key as keyof ConsultantDTO;
    
    if (sortKey === consultantKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(consultantKey);
      setSortOrder("asc");
    }
  };

  const sortedConsultants = [...consultants].sort((a, b) => {
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleStageUpdate = async (user_id: string, newStage: OnboardingStage) => {
    try {
      await ExtendedConsultantsService.updateConsultantStage(user_id, newStage);
      setConsultants((prev) =>
        prev.map((c) => (c.user_id === user_id ? { ...c, stage: newStage } : c))
      );
    } catch (error) {
      console.error("Error updating consultant stage:", error);
      // You might want to show a toast notification here
    }
  };

  // Filter consultants based on search and filters
  const filteredConsultants = sortedConsultants.filter((consultant) => {
    const matchesSearch = search === "" || 
      consultant.name?.toLowerCase().includes(search.toLowerCase()) ||
      consultant.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStage = stageFilter === "" || consultant.stage === stageFilter;
    const matchesCountry = countryFilter === "" || 
      consultant.country?.toLowerCase().includes(countryFilter.toLowerCase());

    return matchesSearch && matchesStage && matchesCountry;
  });

  // Pagination
  const paginatedConsultants = filteredConsultants.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, countryFilter]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session)
    return <p>You must be signed in as an admin to view this page.</p>;

  if (loading) return <p>Loading consultants...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Consultant Onboarding Requests
      </h1>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedConsultants.length} of {filteredConsultants.length} consultants
        {filteredConsultants.length !== consultants.length && 
          ` (filtered from ${consultants.length} total)`
        }
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
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
        consultants={paginatedConsultants}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        onStageUpdate={handleStageUpdate}
      />

      {/* Pagination */}
      {filteredConsultants.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from(
            { length: Math.ceil(filteredConsultants.length / pageSize) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}