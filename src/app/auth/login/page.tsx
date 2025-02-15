'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';
import Navbar from '@/components/navbarLS';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log(response.access_token);

      setToken(response.access_token);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Login</h1>
      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
    </>
  );
}