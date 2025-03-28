'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import Navbar from "../../components/navbar";

interface Restaurant {
  name: string;
  address: string;
  positive: number;
  negative: number;
  neutral: number;
  score: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [limit, setLimit] = useState(25);
  const [error, setError] = useState('');

  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await api(`/leaderboard/top?limit=${limit}`);
      setRestaurants(data);
    } catch (_err) {
      setError('Failed to fetch leaderboard');
    }
  }, [limit]); // ✅ Add `limit` as a dependency to avoid stale values

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]); // ✅ Include `fetchLeaderboard` in dependencies

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Restaurant Leaderboard</h1>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border-gray-600 bg-gray-800 text-white p-2"
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.rank} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                    #{restaurant.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{restaurant.name}</div>
                    <div className="text-sm text-gray-400">{restaurant.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {restaurant.score.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-400">👍 {restaurant.positive}</span>
                      <span className="text-red-400">👎 {restaurant.negative}</span>
                      <span className="text-gray-400">😐 {restaurant.neutral}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
