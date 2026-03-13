"use client";

export default function ReviewRow({ review, onDelete, onEdit }: any) {
  return (
    <div className="grid grid-cols-5 p-4 border-b items-center">
      <div className="col-span-2">
        <p className="font-semibold">{review.name}</p>

        <p className="text-gray-600 text-sm">{review.review}</p>

        <p className="text-xs text-gray-400">
          {review.email} | {review.phone}
        </p>

        <div className="flex gap-3 mt-2 text-sm">
          <button onClick={() => onEdit(review)} className="text-blue-600">
            Edit
          </button>

          <button onClick={() => onDelete(review.id)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>

      <div>DevPrompt</div>
      <div>{review.date}</div>
      <div>{review.file}</div>
    </div>
  );
}
