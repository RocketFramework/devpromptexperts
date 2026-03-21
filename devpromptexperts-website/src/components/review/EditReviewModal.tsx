"use client";

import { useState } from "react";

export default function EditReviewModal({ review, onSave, onClose }: any) {
  const [text, setText] = useState(review.review);

  const save = () => {
    onSave({ ...review, review: text });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="font-bold mb-4">Edit Review</h2>

        <textarea
          className="border w-full p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={save}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
