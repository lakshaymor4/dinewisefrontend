'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/navbar';

export default function CreateRestaurantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const [error, setError] = useState('');

  if (!isAuthenticated()) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api('/restro/create', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/restaurant/manage');
    } catch (err) {
      setError('Failed to create restaurant');
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Create New Restaurant</h1>
      
      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Restaurant Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white 
                     shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white 
                     shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 
                   transition-colors"
        >
          Create Restaurant
        </button>
      </form>
    </div>
    </>
  );
}