import React from "react";
import { InterviewSlot } from "@/types/interfaces";

export default function InterviewStep({
  interviewSlots,
  selectedSlot,
  setSelectedSlot,
  onNext,
}: {
  interviewSlots: InterviewSlot[];
  selectedSlot: number | null;
  setSelectedSlot: (id: number) => void;
  onNext: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Step 2: Select an Interview Slot</h3>
      <div className="flex flex-col gap-4 mb-6">
        {interviewSlots.map(slot => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setSelectedSlot(slot.id)}
            className={`border rounded px-4 py-2 w-full ${selectedSlot === slot.id ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full" disabled={selectedSlot === null}>
        Confirm Interview
      </button>
    </form>
  );
}