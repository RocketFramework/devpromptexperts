"use client";
import React, { useState } from "react";
import { consultants, allExpertise } from "@/data/consultants";
import { signOut, useSession } from "next-auth/react";
const PAGE_SIZE = 12;

export default function ConsumerPage() {
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const [page, setPage] = useState(1);

  // Filter consultants by search and expertise
  const filtered = consultants.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.expertise.some((exp) =>
        exp.toLowerCase().includes(search.toLowerCase())
      );
    const matchesExpertise = !expertise || c.expertise.includes(expertise);
    return matchesSearch && matchesExpertise;
  });

  // Sort by rating (desc), then by id (assuming id is join order)
  const sorted = [...filtered].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return parseInt(b.id) - parseInt(a.id);
  });

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page when search or expertise changes
  React.useEffect(() => {
    setPage(1);
  }, [search, expertise]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Find Your AI Consultant
      </h1>
      {/* Search & Filter */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
        <input
          type="text"
          placeholder="Search by name or expertise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-2/3"
        />
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        >
          <option value="">All Expertise</option>
          {allExpertise.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>
      {/* Consultant List */}
      <div className="grid md:grid-cols-3 gap-8">
        {paginated.map((c) => (
          <div
            key={c.id}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition cursor-pointer"
            onClick={() => (window.location.href = `/consultants/${c.id}`)}
          >
            <img
              src={c.image}
              alt={c.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h4 className="text-xl font-bold text-center mb-2">{c.name}</h4>
            <p className="text-gray-600 text-center mb-2 text-sm">{c.title}</p>
            <div className="flex items-center justify-center mb-2">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="ml-2 font-semibold">{c.rating}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {c.expertise.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
              <span className="mr-2">🕐</span>
              {c.availability}
            </div>
            <div className="text-center text-sm text-gray-500">
              {c.projectsCompleted} projects completed
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg border text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {sorted.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-xl">
          No consultants found matching your criteria.
        </div>
      )}
    </div>
  );
}
