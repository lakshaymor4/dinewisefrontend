'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';
import Navbar from "../components/navbar"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <>
    <Navbar />

    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Restaurant Reviews
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Discover and review the best restaurants in your area
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/restaurant" 
            className="block p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-white">
            <h2 className="text-2xl font-semibold mb-2">Browse Restaurants</h2>
            <p className="text-gray-400">Explore restaurants and read reviews</p>
          </Link>
          
          <Link href="/leaderboard"
            className="block p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-white">
            <h2 className="text-2xl font-semibold mb-2">Leaderboard</h2>
            <p className="text-gray-400">See the top-rated restaurants</p>
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/restaurant/create"
                className="block p-6 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">List Your Restaurant</h2>
                <p className="text-gray-200">Add your restaurant to our platform</p>
              </Link>
              <Link href="/restaurant/manage"
                className="block p-6 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">Manage Your Restaurant</h2>
                <p className="text-gray-200">Manage your restaurants</p>
              </Link>
              <Link href="/reviews"
                className="block p-6 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">Manage Reviews</h2>
                <p className="text-gray-200">Manage your dining experiences</p>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login"
                className="block p-6 bg-gray-700 rounded-lg shadow-md border-2 border-dashed border-gray-500 hover:bg-gray-600 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">List Your Restaurant</h2>
                <p className="text-gray-300">Sign in to add your restaurant
                  <span className="block text-sm text-blue-400 mt-1">Click to log in →</span>
                </p>
              </Link>
              <Link href="/auth/login"
                className="block p-6 bg-gray-700 rounded-lg shadow-md border-2 border-dashed border-gray-500 hover:bg-gray-600 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">Manage Your Restaurant</h2>
                <p className="text-gray-300">Sign in to add your restaurant
                  <span className="block text-sm text-blue-400 mt-1">Click to log in →</span>
                </p>
              </Link>
              <Link href="/auth/login"
                className="block p-6 bg-gray-700 rounded-lg shadow-md border-2 border-dashed border-gray-500 hover:bg-gray-600 transition-colors text-white">
                <h2 className="text-2xl font-semibold mb-2">Write Reviews</h2>
                <p className="text-gray-300">Sign in to share your experiences
                  <span className="block text-sm text-blue-400 mt-1">Click to log in →</span>
                </p>
              </Link>
            </>
          )}
        </div>

        {!isLoggedIn && (
          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">
              Want to contribute to our restaurant community?
            </p>
            <Link 
              href="/auth/login"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign in to get started
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
