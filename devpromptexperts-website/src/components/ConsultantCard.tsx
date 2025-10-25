import React from "react";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";

export default function ConsultantCard({
  consultant,
}: {
  consultant: ConsultantDTO;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition cursor-pointer">
      <img
        src={consultant.image??""}
        alt={consultant.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h4 className="text-xl font-bold text-center mb-2">{consultant.name}</h4>
      <p className="text-gray-600 text-center mb-4 text-sm">
        {consultant.title}
      </p>
      <div className="flex items-center justify-center mb-4">
        <span className="text-yellow-500 text-xl">⭐</span>
        <span className="ml-2 font-semibold">{consultant.rating}</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {consultant.expertise && consultant.expertise.length > 0 ? (
          consultant.expertise.map((skill: string, i: number) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-xs italic">
            No expertise listed
          </span>
        )}
      </div>

      <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
        <span className="mr-2">🕐</span>
        {consultant.availability}
      </div>
      <div className="text-center text-sm text-gray-500">
        {consultant.projectsCompleted} projects completed
      </div>
    </div>
  );
}
