"use client";
import { consultants } from "@/data/consultants";

const consultations = [
  {
    id: "CONS-001",
    project_name: "Website Redesign",
    consultant_name: consultants[0].name,
    hours: 1.5,
    date: "12 Sep 2025",
    satisfaction: "High",
  },
  {
    id: "CONS-002",
    project_name: "Mobile App Dev",
    consultant_name: consultants[1].name,
    hours: 1.5,
    date: "24 Oct 2025",
    satisfaction: "Low",
  },
  {
    id: "CONS-003",
    project_name: "Cloud Migration",
    consultant_name: consultants[2].name,
    hours: 4,
    date: "18 Feb 2025",
    satisfaction: "Medium",
  },
  {
    id: "CONS-004",
    project_name: "Data Analysis",
    consultant_name: consultants[3].name,
    hours: 3,
    date: "19 Feb 2025",
    satisfaction: "High",
  },
  {
    id: "CONS-005",
    project_name: "SEO Optimization",
    consultant_name: consultants[4].name,
    hours: 2,
    date: "18 Feb 2025",
    satisfaction: "Medium",
  },
];

// Helper for satisfaction badge colors
const getSatisfactionColor = (level: string) => {
  switch (level) {
    case "High":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ConsultationTable() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Consultations</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-sky-600 text-white font-semibold">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Consultant</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => (
              <tr key={c.id} className="border-t hover:bg-blue-100">
                <td className="px-4 py-3 font-semibold">{c.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.project_name}</td>
                <td className="px-4 py-3">{c.consultant_name}</td>
                <td className="px-4 py-3">{c.hours} Hrs</td>
                <td className="px-4 py-3">{c.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${getSatisfactionColor(
                      c.satisfaction
                    )}`}
                  >
                    {c.satisfaction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
