"use client";

import { useState } from "react";
import ReviewRow from "@/components/review/ReviewRow";
import DeleteModal from "@/components/review/DeleteModal";
import EditReviewModal from "@/components/review/EditReviewModal";
import AddReviewModal from "@/components/review/AddReviewModal";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const addReview = (review: any) => {
    setReviews([review, ...reviews]);
  };

  const deleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
    setDeleteId(null);
  };

  const saveReview = (updated: any) => {
    setReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Review
        </button>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="grid grid-cols-5 p-4 border-b font-semibold">
          <div className="col-span-2">Review</div>
          <div>Store</div>
          <div>Date</div>
          <div>File</div>
        </div>

        {reviews.map((review) => (
          <ReviewRow
            key={review.id}
            review={review}
            onDelete={() => setDeleteId(review.id)}
            onEdit={(r: any) => setEditing(r)}
          />
        ))}
      </div>

      {showAdd && (
        <AddReviewModal onAdd={addReview} onClose={() => setShowAdd(false)} />
      )}

      {editing && (
        <EditReviewModal
          review={editing}
          onSave={saveReview}
          onClose={() => setEditing(null)}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={() => deleteReview(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
