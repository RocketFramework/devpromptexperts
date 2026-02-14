"use client";
// test
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AvailableSlot } from "@/types";

export default function Page() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [response, setResponse] = useState<AvailableSlot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callSP = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const { data: slots, error } = await supabase.rpc("get_one_slot_per_day", {
      partner_id: "abaf1a26-278f-44ac-be44-3b7b77560a11",
    });

    const new_data: AvailableSlot[] = slots.map((slot: AvailableSlot) => ({
      slot_id: slot.slot_id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      slot_date: slot.slot_date,
      day_of_week: slot.day_of_week,
    }));

    if (error) {
      setError(error.message);
    } else {
      setResponse(new_data);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Call Supabase Stored Procedure
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Age"
          className="border p-2 rounded"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          onClick={callSP}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Calling..." : "Call Stored Procedure"}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">Error: {error}</p>}

        {response && (
          <pre className="bg-gray-100 p-3 rounded mt-4">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
