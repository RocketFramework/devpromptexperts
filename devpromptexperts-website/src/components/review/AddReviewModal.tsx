"use client";

import { useState } from "react";

export default function AddReviewModal({ onAdd, onClose }: any) {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [review,setReview] = useState("");
  const [file,setFile] = useState<File | null>(null);

  const submit = () => {

    const newReview = {
      id: Date.now(),
      name,
      email,
      phone,
      review,
      file: file?.name || "",
      date: new Date().toLocaleDateString()
    };

    onAdd(newReview);
    onClose();
  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white w-[420px] p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Add Review
        </h2>

        <div className="space-y-3">

          <input
          placeholder="Name"
          className="border p-2 w-full rounded"
          onChange={(e)=>setName(e.target.value)}
          />

          <input
          placeholder="Email"
          className="border p-2 w-full rounded"
          onChange={(e)=>setEmail(e.target.value)}
          />

          <input
          placeholder="Mobile"
          className="border p-2 w-full rounded"
          onChange={(e)=>setPhone(e.target.value)}
          />

          <textarea
          placeholder="Review"
          className="border p-2 w-full rounded"
          onChange={(e)=>setReview(e.target.value)}
          />

          <input
          type="file"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
          />

        </div>

        <div className="flex justify-end gap-3 mt-5">

          <button
          onClick={onClose}
          className="border px-4 py-2 rounded"
          >
          Cancel
          </button>

          <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          >
          Add
          </button>

        </div>

      </div>

    </div>
  );
}