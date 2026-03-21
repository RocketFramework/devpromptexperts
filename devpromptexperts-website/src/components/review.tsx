"use client";

type Review = {
  id: number;
  user: string;
  review: string;
  store: string;
  date: string;
  location: string;
};

type Props = {
  review: Review;
  onDelete: (id: number) => void;
};

export default function ReviewRow({ review, onDelete }: Props) {
  return (
    <div className="grid grid-cols-5 p-4 border-b items-center">
      
      <div className="col-span-2">
        <p className="font-semibold">{review.user}</p>
        <p className="text-gray-600 text-sm">{review.review}</p>

        <button
          onClick={() => onDelete(review.id)}
          className="text-red-500 text-sm mt-1 hover:underline"
        >
          Delete
        </button>
      </div>

      <div>{review.store}</div>
      <div>{review.date}</div>
      <div>{review.location}</div>

    </div>
  );
}