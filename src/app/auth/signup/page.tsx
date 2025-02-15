'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/navbarLS';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Sign Up</h1>
      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
    </>
  );
}
