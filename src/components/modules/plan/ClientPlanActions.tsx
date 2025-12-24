/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useAuthContext } from "../auth/AuthProvider/AuthProvider";
import { API_BASE } from "@/lib/baseApi";
import { Participant, Props, Review } from "@/types/travelPlan.interface";






export default function ClientPlanActions({ planId, hostId, planEndDate,planStartDate }: Props) {
  const { user } = useAuthContext();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myStatus, setMyStatus] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
const [editingId, setEditingId] = useState<string | null>(null);
const [editingRating, setEditingRating] = useState<number>(5);
const [editingComment, setEditingComment] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

 
  const userId = (user as any)?._id || (user as any)?.id;
  const isHost = userId && userId === hostId;
  const isCompleted = new Date(planEndDate) < new Date();
 
const hasMyReview =
  !!userId && reviews.some((r) => r.authorId === userId);


const canReview =
  !!user && !isHost && isCompleted && myStatus === "ACCEPTED" && !hasMyReview;
function startEditReview(review: Review) {
  setEditingId(review.id);
  setEditingRating(review.rating);
  setEditingComment(review.comment || "");
}
async function handleEditReviewSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!userId || !editingId) return;

  try {
    const res = await fetch(`${API_BASE}/reviews/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        rating: editingRating,
        comment: editingComment,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: json.message || "Failed to update review.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Review Updated",
      confirmButtonColor: "#22c55e",
    });

    setEditingId(null);
    await fetchHostReviews();
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Unable to update review.",
      confirmButtonColor: "#f97316",
    });
  }
}

  useEffect(() => {
    fetchPlanForParticipants();
    fetchHostReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, hostId, userId]);


  async function fetchPlanForParticipants() {
    try {
      const res = await fetch(`${API_BASE}/travel-plans/${planId}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) return;

      const plan = json.plan;
      const participants: Participant[] = plan.travelPlanParticipants  || [];
      setParticipants(participants);

      if (userId) {
        const mine = participants.find((p) => p.user.id === userId);
        setMyStatus(mine ? mine.status : null);
      } else {
        setMyStatus(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

 
  async function fetchHostReviews() {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/user/${hostId}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setAvgRating(json.avgRating ?? null);
        setTotalReviews(json.totalReviews ?? 0);
        setReviews(json.reviews ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  }

 
  async function handleJoinRequest() {
    if (!userId) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to request to join this trip.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/travel-plans/${planId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        await Swal.fire({
          icon: "error",
          title: "Request failed",
          text: json.message || "Failed to send join request.",
          confirmButtonColor: "#f97316",
        });
        return;
      }

    
      setMyStatus("PENDING");

      await Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your join request has been sent to the host.",
        confirmButtonColor: "#f97316",
      });

   
      await fetchPlanForParticipants();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to send join request.",
        confirmButtonColor: "#f97316",
      });
    }
  }


  async function handleHostRespond(
    participantId: string,
    status: "ACCEPTED" | "REJECTED" | "CANCELLED"
  ) {
    if (!userId) return;

    try {
      const res = await fetch(
        `${API_BASE}/travel-plans/${planId}/participants/${participantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: json.message || "Failed to update request status.",
          confirmButtonColor: "#f97316",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Request has been ${status.toLowerCase()}.`,
        confirmButtonColor: "#22c55e",
      });

      await fetchPlanForParticipants();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to update request.",
        confirmButtonColor: "#f97316",
      });
    }
  }

 
  async function handleCreateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      await Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to submit a review.",
        confirmButtonColor: "#f97316",
      });
      return;
    }
    if (!canReview) {
      await Swal.fire({
        icon: "warning",
        title: "Not Eligible Yet",
        text: "You can review only after the trip is completed and if you are accepted.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/travel-plans/${planId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: json.message || "Failed to submit review.",
          confirmButtonColor: "#f97316",
        });
        return;
      }

      setRating(5);
      setComment("");

      await Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Your review has been submitted successfully.",
        confirmButtonColor: "#22c55e",
      });

      await fetchHostReviews();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to submit review.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setSubmitting(false);
    }
  }

 
 

 
  async function handleDeleteReview(reviewId: string) {
    if (!userId) return;

    const confirmRes = await Swal.fire({
      title: "Delete review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });
    if (!confirmRes.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: json.message || "Failed to delete review.",
          confirmButtonColor: "#f97316",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Review Deleted",
        confirmButtonColor: "#22c55e",
      });

      await fetchHostReviews();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to delete review.",
        confirmButtonColor: "#f97316",
      });
    }
  }
const normalize = (d: Date | null) => {
    if (!d) return null;
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const normToday = normalize(new Date()) !;
  const normStart = planStartDate ? normalize(new Date(planStartDate)) : null;
  const normEnd = planEndDate ? normalize(new Date(planEndDate)) : null;


  const isCompletedTour = !!normEnd && normEnd < normToday;

  const isOngoingTour = !!normStart && !!normEnd && normStart <= normToday && normEnd >= normToday;
 
  let joinLabel = "Request to Join";
  let joinDisabled = false;
if (isCompletedTour || isOngoingTour) {
    joinLabel = "Cannot join now";
    joinDisabled = true;
  } 
  if (!userId) {
    joinLabel = "Login to Join";
    joinDisabled = false;
    
  } 
  
  
  else if (userId === hostId) {
    joinLabel = "You are the host";
    joinDisabled = true;
  } else if (myStatus === "PENDING") {
    joinLabel = "Request Pending";
    joinDisabled = true;
  } else if (myStatus === "ACCEPTED") {
    joinLabel = "Accepted";
    joinDisabled = true;
  } else if (myStatus === "REJECTED" || myStatus === "CANCELLED") {
    joinLabel = `Status: ${myStatus}`;
    joinDisabled = true;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* USER: Request to join */}
      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-800">
            Want to join this trip?
          </div>
          <div className="text-xs text-gray-500">
            Send a request to the host. The host can accept or reject your request.
          </div>
          {myStatus && userId !== hostId && (
            <div className="text-xs text-gray-600 mt-1">
              Your current status:{" "}
              <span className="font-semibold">{myStatus}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleJoinRequest}
          disabled={joinDisabled}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
            joinDisabled
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-linear-to-r from-primary to-primary text-white hover:from-primary hover:to-primary"
          } transition`}
        >
          {joinLabel}
        </button>
      </div>

      {/* HOST: manage join requests */}
      {isHost && (
        <div className="p-4 border border-gray-100 rounded-lg bg-white">
          <div className="text-sm font-semibold text-gray-800">Join Requests</div>
          <div className="text-xs text-gray-500 mb-2">
            Accept or reject travelers who requested to join.
          </div>
          <div className="space-y-2 mt-2">
            {participants.length === 0 && (
              <div className="text-xs text-gray-500">No requests yet.</div>
            )}
            {participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 border border-gray-100 rounded"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={p.user.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    alt={p.user.fullName || "Traveler"}
                  />
                  <div>
                    <div className="text-sm font-semibold">
                      {p.user.fullName || "Unnamed traveler"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status: {p.status}
                    </div>
                  </div>
                </div>
                {
                  p.status === "PENDING" && (
                    <div className="flex gap-2">
                 
                 
                      <button
                    onClick={() => handleHostRespond(p.id, "ACCEPTED")}
                    className="text-xs px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Accept
                  </button>
                   
                
                  <button
                    onClick={() => handleHostRespond(p.id, "REJECTED")}
                    className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleHostRespond(p.id, "CANCELLED")}
                    className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                  )
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Reviews (everyone can see) */}
      <div className="p-4 border border-gray-100 rounded-lg bg-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-800">Host Reviews</div>
            <div className="text-xs text-gray-500">
              Average rating:{" "}
              {loadingReviews
                ? "Loading..."
                : avgRating
                ? `${avgRating.toFixed(1)} / 5 (${totalReviews} reviews)`
                : "No reviews yet"}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-3 border border-gray-100 rounded-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={r.author.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    alt={r.author.fullName || "User"}
                  />
                  <div>
                    <div className="text-sm font-semibold">
                      {r.author.fullName || "Traveler"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary">
                  {r.rating} / 5 ★
                </div>
              </div>
              {r.comment && (
                <div className="mt-2 text-sm text-gray-700">{r.comment}</div>
              )}
              {userId === r.authorId && (
  <div className="mt-2">
    {editingId === r.id ? (
      <form onSubmit={handleEditReviewSubmit} className="space-y-2 border-t border-gray-100 pt-2 mt-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Rating</label>
          <select
            value={editingRating}
            onChange={(e) => setEditingRating(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 text-xs"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
        </div>
        <div>
          <textarea
            value={editingComment}
            onChange={(e) => setEditingComment(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            className="text-xs px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => setEditingId(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <div className="flex gap-2 mt-2">
        <button
          className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          onClick={() => startEditReview(r)}
        >
          Edit
        </button>
        <button
          className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => handleDeleteReview(r.id)}
        >
          Delete
        </button>
      </div>
    )}
  </div>
)}

            </div>
          ))}

          {!loadingReviews && reviews.length === 0 && (
            <div className="text-xs text-gray-500">
              No reviews for this host yet.
            </div>
          )}
        </div>

        {/* Review form: only ACCEPTED + trip complete + not host */}
        {user && canReview &&   (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Leave a Review
            </div>
            <form className="space-y-3" onSubmit={handleCreateReview}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-32 border border-gray-200 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                  placeholder="Share your experience with this host..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {user && !isHost && (
  <div className="mt-4 text-xs text-gray-500">
    {hasMyReview ? (
      <span>
        You have already reviewed this host. You can edit or delete your review above.
      </span>
    ) : !isCompleted ? (
      <span>
        You can review this host after the trip is completed.
      </span>
    ) : myStatus !== "ACCEPTED" ? (
      <span>
        Only accepted participants can review this host.
      </span>
    ) : null}
  </div>
)}
      </div>
    </div>
  );
}
