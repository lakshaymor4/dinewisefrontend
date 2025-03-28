'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/navbar';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  status: boolean;
  positive: number;
  negative: number;
  neutral: number;
  reviews: Array<{
    id: number;
    review: string;
    createdAt: string;
  }>;
}

interface EditingState {
  id: number;
  name: string;
  address: string;
  status: boolean;
}

export default function ManageRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    fetchRestaurants();
  }, [router]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await api('/restro/getall');
      setRestaurants(data);
    } catch (_err) {
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editing) return;

    try {
      setError('');
      setSuccessMessage('');
      
      if (!editing.name.trim()) {
        setError('Restaurant name cannot be empty');
        return;
      }

      if (!editing.address.trim()) {
        setError('Address cannot be empty');
        return;
      }

      await api('/restro/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id,
          name: editing.name.trim(),
          address: editing.address.trim(),
          status: editing.status,
        }),
      });

      setSuccessMessage('Restaurant updated successfully');
      setEditing(null);
      fetchRestaurants();
    } catch (_err) {
      setError('Failed to update restaurant');
    }
  };

  const startEdit = (restaurant: Restaurant) => {
    setEditing({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      status: restaurant.status,
    });
    setError('');
    setSuccessMessage('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setError('');
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-white">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-4 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Manage Restaurants</h1>
        <button
          onClick={() => router.push('/restaurant/create')}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New Restaurant
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-blue-500 text-white px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {editing?.id === restaurant.id ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                      placeholder="Restaurant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Address
                    </label>
                    <textarea
                      value={editing.address}
                      onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                      rows={3}
                      placeholder="Restaurant address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editing.status.toString()}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value === 'true' })}
                      className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => handleUpdate(restaurant.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-300 mb-2">{restaurant.name}</h2>
                    <p className="text-gray-400 mb-2">{restaurant.address}</p>
                    <div className="space-y-2">
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-400">Positive: {restaurant.positive}</span>
                        <span className="text-red-400">Negative: {restaurant.negative}</span>
                        <span className="text-gray-400">Neutral: {restaurant.neutral}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-300">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          restaurant.status 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {restaurant.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startEdit(restaurant)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Recent Reviews ({restaurant.reviews.length})
                  </h3>
                  {restaurant.reviews.length > 0 ? (
                    <div className="space-y-2">
                      {restaurant.reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="text-sm text-gray-400">
                          "{review.review}"
                          <span className="text-gray-500 text-xs ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {restaurants.length === 0 && (
          <div className="text-center py-8 bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-400">You haven't added any restaurants yet.</p>
            <button
              onClick={() => router.push('/restaurant/create')}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Add your first restaurant
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}