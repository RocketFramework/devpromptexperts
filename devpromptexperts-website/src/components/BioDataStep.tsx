"use client";

import React from "react";
//import { ConsultantFullProfile as Consultant } from "@/services/generated/ConsultantsService";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";
import { daysOptions } from "@/data/daysOptions";
import { hoursOptions } from "@/data/hoursOptions";
import TagInput from "@/components/TagInput";
import { isValidUrl } from "@/utils/validations";

export default function BioDataStep({
  consultant,
  setConsultant,
}: {
  consultant: ConsultantDTO;
  setConsultant: (data: ConsultantDTO) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConsultant({ ...consultant, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (field: "days" | "hours", value: string) => {
    const availability =
      field === "days"
        ? `${value} - ${consultant.availability?.split(" - ")[1] || ""}`
        : `${consultant.availability?.split(" - ")[0] || ""} - ${value}`;
    setConsultant({ ...consultant, availability });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Step 1: <span className="text-indigo-600">Enter Your Bio Data</span>
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={consultant.name}
            onChange={handleChange}
            required
            placeholder="ex: John Doe"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={consultant.email}
            onChange={handleChange}
            required
            placeholder="ex: you@example.com"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={consultant.title??""}
            onChange={handleChange}
            required
            placeholder="ex: Software Engineer"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Profile Image */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Profile Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="image"
            value={consultant.image ?? ""}
            onChange={handleChange}
            required
            placeholder="ex: https://example.com/image.jpg"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Short Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio_summary"
            value={consultant.bioSummary || ""}
            onChange={handleChange}
            rows={4}
            required
            placeholder="ex: Passionate software engineer with 5 years of experience in web development."
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
          />
        </div>

        {/* Work Experience */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Work Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="work_experience"
            value={consultant.workExperience ?? ""}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Projects Completed */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Projects Completed <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="projects_completed"
            value={consultant.projectsCompleted ?? ""}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Availability */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-2 text-gray-700">
            Availability <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={consultant.availability?.split(" - ")[0] || ""}
              onChange={(e) => handleAvailabilityChange("days", e.target.value)}
              required
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Days</option>
              {daysOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={consultant.availability?.split(" - ")[1] || ""}
              onChange={(e) =>
                handleAvailabilityChange("hours", e.target.value)
              }
              required
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Hours</option>
              {hoursOptions.map((hours) => (
                <option key={hours} value={hours}>
                  {hours}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {consultant.availability || "None"}
          </p>
        </div>

        {/* Expertise */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Expertise <span className="text-red-500">*</span>
          </label>
          <TagInput
            tags={consultant.expertise ?? []}
            setTags={(tags) =>
              setConsultant({ ...consultant, expertise: tags })
            }
            placeholder="ex: Web Development"
          />
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Skills <span className="text-red-500">*</span>
          </label>
          <TagInput
            tags={consultant.skills ?? []}
            setTags={(tags) => setConsultant({ ...consultant, skills: tags })}
            placeholder=" ex: JavaScript, React, Node.js"
          />
        </div>

        {/* LinkedIn */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            LinkedIn Profile
          </label>
          <div className="space-y-2">
            <input
              type="url"
              value={consultant.linkedinUrl || ""}
              onChange={(e) =>
                setConsultant({ ...consultant, linkedinUrl: e.target.value })
              }
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {consultant.linkedinUrl && (
              <div className="text-xs">
                {isValidUrl(consultant.linkedinUrl) ? (
                  <a
                    href={consultant.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📎 View LinkedIn Profile
                  </a>
                ) : (
                  <span className="text-red-500">Please enter a valid URL</span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Publications */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Publications/External Links
          </label>
          <div className="space-y-2">
            <TagInput
              tags={consultant.publications ?? []}
              setTags={(tags) =>
                setConsultant({ ...consultant, publications: tags })
              }
              placeholder="Add publication URLs (https://...)"
            />
            <div className="flex flex-wrap gap-2">
              {consultant.publications?.map((publication, index) => (
                <div key={index} className="text-xs">
                  {isValidUrl(publication) ? (
                    <a
                      href={publication}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📎 Link {index + 1}
                    </a>
                  ) : (
                    <span>{publication}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
