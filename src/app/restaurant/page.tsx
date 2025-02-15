'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import Navbar from '@/components/navbar';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  positive: number;
  negative: number;
  neutral: number;
  status: boolean;
  reviews: Array<{
    id: number;
    review: string;
    createdAt: string;
    userId: number;
  }>;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [showReviews, setShowReviews] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await api('/restro/getallrestro');
      setRestaurants(data.filter((r: Restaurant) => r.status));
    } catch (err) {
      console.log(err);
      setError('Failed to fetch restaurants');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setError('Please login to submit a review');
      return;
    }

    try {
      await api('/review/create', {
        method: 'POST',
        body: JSON.stringify({
          restrauntId: selectedRestaurant,
          review,
        }),
      });
      setReview('');
      setSelectedRestaurant(null);
      fetchRestaurants();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Restaurants</h1>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-md bg-[#161B22] border border-gray-700 text-[#E6EDF3] focus:ring-[#1F6FEB] focus:border-[#1F6FEB]"
        />
      </div>

      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-[#161B22] rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-400 mb-4">{restaurant.address}</p>

              <div className="flex space-x-4 mb-4 text-[#D29922]">
                <span>👍 {restaurant.positive}</span>
                <span>👎 {restaurant.negative}</span>
                <span>😐 {restaurant.neutral}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                  className="bg-[#1F6FEB] text-white px-4 py-2 rounded hover:bg-[#58A6FF] transition"
                >
                  Write Review
                </button>
                <button
                  onClick={() => setShowReviews((prev) => (prev === restaurant.id ? null : restaurant.id))}
                  className="bg-[#30363D] text-gray-300 px-4 py-2 rounded hover:bg-[#484F58] transition"
                >
                  {showReviews === restaurant.id 
                    ? 'Hide Reviews' 
                    : `Show Reviews (${restaurant.reviews?.length ?? 0})`}
                </button>
              </div>
            </div>

            {showReviews === restaurant.id && restaurant.reviews?.length > 0 && (
              <div className="border-t border-gray-600 p-6 bg-[#0D1117] transition-all duration-300">
                <h3 className="font-semibold mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  {restaurant.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4">
                      <p className="text-gray-300 mb-2">{review.review}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161B22] rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            {!isAuthenticated() ? (
              <div>
                <p className="mb-4 text-gray-400">Please log in to write a review.</p>
                <Link href="/auth/login" className="bg-[#1F6FEB] text-white px-4 py-2 rounded hover:bg-[#58A6FF] transition">
                  Log In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full h-32 border rounded-md p-2 bg-[#0D1117] border-gray-700 text-[#E6EDF3] focus:ring-[#1F6FEB] focus:border-[#1F6FEB]"
                  placeholder="Write your review here..."
                  required
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-[#1F6FEB] text-white px-4 py-2 rounded hover:bg-[#58A6FF] transition"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRestaurant(null)}
                    className="bg-[#30363D] text-gray-300 px-4 py-2 rounded hover:bg-[#484F58] transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
