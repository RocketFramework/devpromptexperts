import React from "react";
import { BioData } from "@/data/types";
import { daysOptions } from "@/data/daysOptions";
import { hoursOptions } from "@/data/hoursOptions";

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
  bioData,
  setBioData
}: {
  bioData: BioData;
  setBioData: (data: BioData) => void;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBioData({ ...bioData, [e.target.name]: e.target.value });
    };

    const handleExpertiseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setBioData({ ...bioData, expertise: selected });
    };

    const handleAvailabilityChange = (field: "days" | "hours", value: string) => {
    const availability = field === "days"
      ? `${value} - ${bioData.availability.split(" - ")[1] || ""}`
      : `${bioData.availability.split(" - ")[0] || ""} - ${value}`;
    setBioData({ ...bioData, availability });
  };

  return (
    <form>
      <h3 className="text-xl font-semibold mb-4">Step 1: Enter Your Bio Data</h3>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={bioData.name}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={bioData.email}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="text"
        name="title"
        placeholder="Professional Title"
        value={bioData.title}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={bioData.bio}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <input
        type="url"
        name="image"
        placeholder="Profile Image URL"
        value={bioData.image || ""}
        onChange={handleChange}
        className="border rounded px-4 py-2 mb-4 w-full"
        required
      />
      <div className="mb-6">
        <label className="block font-semibold mb-2">Availability</label>
        <div className="flex gap-4">
          <select
            value={bioData.availability.split(" - ")[0] || ""}
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
            value={bioData.availability.split(" - ")[1] || ""}
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
          Selected: {bioData.availability || "None"}
        </div>
      </div>
      <label className="block mb-2 font-semibold">Expertise (hold Ctrl/Cmd to select multiple):</label>
      <select
        name="expertise"
        multiple
        value={bioData.expertise}
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