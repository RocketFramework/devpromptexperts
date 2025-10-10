"use client";
import React, { useState } from "react";
import { BioData, InterviewSlot } from "@/data/types";
import BioDataStep from "./BioDataStep";
import InterviewStep from "./InterviewStep";
import ProbationStep from "./ProbationStep";
import { interviewSlots } from "@/data/interviewSlots";

export default function ConsultantOnboardingWizard() {
  const [step, setStep] = useState(1);
  const [bioData, setBioData] = useState<BioData>({
    name: "",
    email: "",
    title: "",
    bio: "",
    expertise: [],
    image: "",
    availability: "",
  });
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const steps = [
    { label: "Bio Data", component: <BioDataStep bioData={bioData} setBioData={setBioData} /> },
    { label: "Interview", component: <InterviewStep interviewSlots={interviewSlots} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} onNext={() => setStep(step + 1)} /> },
    { label: "Probation", component: <ProbationStep /> },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Consultant Onboarding Wizard</h2>
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        {steps.map((s, idx) => (
          <button
            key={s.label}
            className={`px-4 py-2 mx-2 rounded-t-lg font-semibold border-b-2 transition ${
              step === idx + 1
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-500 bg-gray-100 hover:bg-blue-100"
            }`}
            onClick={() => setStep(idx + 1)}
            disabled={step < idx + 1}
          >
            {s.label}
          </button>
        ))}
      </div>
      {/* Step Content */}
      <div className="h-[700px] overflow-y-auto">{steps[step - 1].component}</div>
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Back
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setStep(step + 1)}
          disabled={step === steps.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}