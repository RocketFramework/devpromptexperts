"use client";
import React, { useState } from "react";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";
import BioDataStep from "./BioDataStep";
import InterviewStep from "./InterviewStep";
import ProbationStep from "./ProbationStep";
import { interviewSlots } from "@/data/interviewSlots";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

export default function ConsultantOnboardingWizard() {
  const supabase = createClientComponentClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  
const [consultant, setConsultant] = useState<ConsultantDTO>({
    user_id: "",
    id: "",
    name: "",
    email: "",
    role: "",
    title: "",
    bioSummary: "",
    expertise: [],
    image: "",
    availability: "",
    work_experience: 0,
    skills: [],
    publications: [],
    projects_completed: 0,
    rating: 0,
    featured: false,
    stage: "bio",
    country: "",
    linkedinUrl: "",
  }); 

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  /** 📝 Save to Supabase */
  const handleAutoSave = async () => {
    try {
      setLoading(true);

      // Validation
      if (!consultant.name || !consultant.email || !consultant.title || !consultant.availability) {
        toast.error("Please fill all required fields!");
        return false;
      }

      // Insert into users if new
      let userId = consultant.id;
      if (!userId) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            full_name: consultant.name,
            email: consultant.email,
            profile_image_url: consultant.image,
            role: "consultant"
          })
          .select("id")
          .single();
        if (userError) throw userError;
        userId = userData.id;
        setConsultant({ ...consultant, id: userId });
      }

      // Insert or update consultant
      const { error: consultantError } = await supabase.from("consultants").upsert({
        user_id: userId,
        title: consultant.title,
        bio_summary: consultant.bioSummary,
        expertise: consultant.expertise,
        availability: consultant.availability,
        work_experience: consultant.work_experience,
        skills: consultant.skills,
        publications: consultant.publications,
        projects_completed: consultant.projects_completed,
        stage: consultant.stage,
        rating: consultant.rating,
        featured: consultant.featured
      });
      if (consultantError) throw consultantError;

      toast.success("Saved successfully ✅");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to save data ❌");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToStep = async (newStep: number) => {
    const saved = await handleAutoSave();
    if (saved) setStep(newStep);
  };

  const steps = [
    { label: "Bio Data", component: <BioDataStep consultant={consultant} setConsultant={setConsultant} /> },
    { label: "Interview", component: <InterviewStep interviewSlots={interviewSlots} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} onNext={() => goToStep(step + 1)} /> },
    { label: "Probation", component: <ProbationStep /> },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Consultant Onboarding Wizard</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        {steps.map((s, idx) => (
          <button
            key={s.label}
            className={`px-4 py-2 mx-2 rounded-t-lg font-semibold border-b-2 transition ${step === idx + 1 ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-500 bg-gray-100 hover:bg-blue-100"}`}
            onClick={() => goToStep(idx + 1)}
            disabled={step < idx + 1}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="h-[700px] overflow-y-auto px-4">{steps[step - 1].component}</div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50" onClick={() => setStep(step - 1)} disabled={step === 1 || loading}>Back</button>

        <button className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`} onClick={async () => {
          const saved = await handleAutoSave();
          if (saved && step < steps.length) setStep(step + 1);
        }} disabled={step === steps.length || loading}>
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}
