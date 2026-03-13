"use client";

export default function DeleteModal({ onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl w-[320px]">
        <h2 className="font-bold mb-4">Delete this review?</h2>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
