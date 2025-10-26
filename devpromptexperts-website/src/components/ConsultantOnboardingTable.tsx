"use client";

import { ConsultantDTO } from "@/types/dtos/Consultant.dto"
import type { ConsultantStage } from "@/types/types";
import { ConsultantStages } from "@/types/types";

interface Props {
  consultants: ConsultantDTO[];
  sortKey: keyof ConsultantDTO;
  sortOrder: "asc" | "desc";
  onSort: (key: keyof ConsultantDTO) => void;
  onStageUpdate: (id: string, stage: ConsultantStage) => void;
}

export default function ConsultantOnboardingTable({
  consultants,
  sortKey,
  sortOrder,
  onSort,
  onStageUpdate,
}: Props) {
  const stageOptions = [
    ConsultantStages.BIO,
    ConsultantStages.BIO_DONE,
    ConsultantStages.BIO_WIP,
    ConsultantStages.INTV,
    ConsultantStages.INTV_DONE,
    ConsultantStages.INTV_DONE_ACCEPT,
    ConsultantStages.INTV_DONE_REJECT,
    ConsultantStages.INTV_SCHEDULED,
    ConsultantStages.PROBATION,
    ConsultantStages.PROBATION_DONE,
    ConsultantStages.PROBATION_WIP,
    ConsultantStages.PROFESSIONAL
  ];

  const stageColors: Record<string, string> = {
    bio: "bg-blue-500 text-white",
    interview: "bg-yellow-400 text-black",
    probation: "bg-orange-400 text-white",
    active: "bg-green-500 text-white",
    default: "bg-gray-300 text-black",
  };

  const renderSortArrow = (key: keyof ConsultantDTO) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Title
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => onSort("title")}
            >
              Name{renderSortArrow("title")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Availability
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Country
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => onSort("work_experience")}
            >
              Experience{renderSortArrow("work_experience")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Assignments Finished
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Featured
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => onSort("rating")}
            >
              Rating{renderSortArrow("rating")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Stage
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {consultants.map((c, idx) => (
            <tr
              key={c.user_id}
              className={`${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {c.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {c.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {c.availability || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {c.country || "N/A"}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 font-semibold">
                {c.work_experience ?? 0} yrs
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                {c.projects_completed}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                {c.featured ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800">
                    Yes
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                    No
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-gray-800">
                {(c.rating ?? 0).toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <select
                  value={c.stage || ""}
                  onChange={(e) =>
                    onStageUpdate(c.user_id, e.target.value as ConsultantStage)
                  }
                  className={`px-2 py-1 rounded-md ${
                    stageColors[c.stage || "default"]
                  } font-semibold focus:outline-none`}
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
