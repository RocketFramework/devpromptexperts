import React from "react";
import { BioData } from "@/types/types";
import { daysOptions } from "@/data/daysOptions";
import { hoursOptions } from "@/data/hoursOptions";
import { Consultant } from "@/types/consultant";

const expertiseOptions = [
  "GPT-4",
  "Claude AI",
  "Prompt Engineering",
  "React",
  "Next.js",
  "AI Integration",
  "PyTorch",
  "TensorFlow",
  "MLOps",
  "AI Strategy",
  "Enterprise Solutions",
  "Cloud AI",
  "NLP",
  "Text Analytics",
  "Chatbots",
  "Product Management",
  "AI Roadmaps",
  "Team Leadership",
  "Computer Vision",
  "Image Recognition",
  "Deep Learning",
  "AI Security",
  "Risk Assessment",
  "Compliance",
  "Data Science",
  "Predictive Analytics",
  "Big Data",
  "DevOps",
  "Automation"
];

export default function BioDataStep({
  consultant,
  setConsultant
}: {
  consultant: Consultant;
  setConsultant: (data: Consultant) => void;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConsultant({ ...consultant, [e.target.name]: e.target.value });
    };

    const handleExpertiseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setConsultant({ ...consultant, expertise: selected });
    };

    const handleAvailabilityChange = (field: "days" | "hours", value: string) => {
    const availability = field === "days"
      ? `${value} - ${consultant.availability.split(" - ")[1] || ""}`
      : `${consultant.availability.split(" - ")[0] || ""} - ${value}`;
    setConsultant({ ...consultant, availability });
  };

  return (
    <form>
      <h3 className="text-xl font-semibold mb-4">Step 1: Enter Your Bio Data</h3>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={consultant.name}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={consultant.email}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="text"
        name="title"
        placeholder="Professional Title"
        value={consultant.title}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={consultant.workExperience}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="url"
        name="image"
        placeholder="Profile Image URL"
        value={consultant.image || ""}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <div className="mb-6">
        <label className="block font-semibold mb-2">Availability</label>
        <div className="flex gap-4">
          <select
            value={consultant.availability.split(" - ")[0] || ""}
            onChange={e => handleAvailabilityChange("days", e.target.value)}
            className="border rounded px-4 py-2 w-1/2"
            required
          >
            <option value="">Select Days</option>
            {daysOptions.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            value={consultant.availability.split(" - ")[1] || ""}
            onChange={e => handleAvailabilityChange("hours", e.target.value)}
            className="border rounded px-4 py-2 w-1/2"
            required
          >
            <option value="">Select Hours</option>
            {hoursOptions.map(hours => (
              <option key={hours} value={hours}>{hours}</option>
            ))}
          </select>
        </div>
        <div className="text-gray-500 text-xs mt-2">
          Selected: {consultant.availability || "None"}
        </div>
      </div>
      <label className="block mb-2 font-semibold">Expertise (hold Ctrl/Cmd to select multiple):</label>
      <select
        name="expertise"
        multiple
        value={consultant.expertise}
        onChange={handleExpertiseChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      >
        {expertiseOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </form>
  );
}