"use client";

import { Consultant } from "@/types/consultant";
import Image from "next/image";
import type { OnboardingStage } from "@/types/consultant";

interface Props {
  consultants: Consultant[];
  sortKey: keyof Consultant;
  sortOrder: "asc" | "desc";
  onSort: (key: keyof Consultant) => void;
  onStageUpdate: (id: string, stage: OnboardingStage) => void;
}

export default function ConsultantOnboardingTable({
  consultants,
  sortKey,
  sortOrder,
  onSort,
  onStageUpdate,
}: Props) {
  const stageOptions = ["bio", "interview", "probation", "active"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 cursor-pointer" onClick={() => onSort("name")}>
              Name {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-2">Profile</th>
            <th className="px-4 py-2">Availability</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Experience</th>
            <th className="px-4 py-2">Skills</th>
            <th className="px-4 py-2">Publications</th>
            <th className="px-4 py-2">Stage</th>
          </tr>
        </thead>
        <tbody>
          {consultants.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">
                {c.image && (
                  <Image
                    src={c.image}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt={c.name}
                  />
                )}
              </td>
              <td className="px-4 py-2">{c.availability || "N/A"}</td>
              <td className="px-4 py-2">{c.country || "N/A"}</td>
              <td className="px-4 py-2">{c.workExperience ?? 0}</td>
              <td className="px-4 py-2">{c.skills?.join(", ") || "No skills"}</td>
              <td className="px-4 py-2">{c.publications?.join(", ") || "No publications"}</td>
              <td className="px-4 py-2">
                <select
                  value={c.stage || ""}
                  onChange={(e) => onStageUpdate(c.id, e.target.value as OnboardingStage)}
                  className={`px-2 py-1 rounded text-white ${
                    c.stage === "bio"
                      ? "bg-blue-500"
                      : c.stage === "interview"
                      ? "bg-yellow-500"
                      : c.stage === "probation"
                      ? "bg-orange-500"
                      : c.stage === "active"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                >
                  <option value="">N/A</option>
                  {stageOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
