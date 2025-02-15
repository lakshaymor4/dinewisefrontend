'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/navbar';

interface Review {
  id: number;
  name: string;
  userId: number;
  restrauntId: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editReview, setEditReview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    fetchReviews();
  }, [router]);

  const fetchReviews = async () => {
    try {
      const data = await api('/review/getall');
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await api('/review/update', {
        method: 'PATCH',
        body: JSON.stringify({ id, review: editReview }),
      });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      setError('Failed to update review');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api('/review/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      fetchReviews();
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditReview(review.review);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">My Reviews</h1>

      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg shadow-md p-6">
            {editingId === review.id ? (
              <div className="space-y-4">
                <textarea
                  value={editReview}
                  onChange={(e) => setEditReview(e.target.value)}
                  className="w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm"
                  rows={4}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUpdate(review.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-semibold text-blue-300">{review.name}</p>
                    <p className="text-gray-400">Restaurant ID: {review.restrauntId}</p>
                    <p className="text-sm text-gray-500">
                      Posted: {new Date(review.createdAt).toLocaleDateString()}
                      {review.createdAt !== review.updatedAt &&
                        ` (Edited: ${new Date(review.updatedAt).toLocaleDateString()})`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(review)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-300">{review.review}</p>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            You haven't written any reviews yet.
          </div>
        )}
      </div>
    </div>
    </>
  );
}
