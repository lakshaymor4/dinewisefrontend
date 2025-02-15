import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, removeToken } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-400">
              DineWise
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/leaderboard" className="text-gray-400 hover:text-gray-300 transition-colors">
              Leaderboard
            </Link>
            <Link href="/restaurant" className="text-gray-400 hover:text-gray-300 transition-colors">
              Restaurants
            </Link>
            
            {authenticated ? (
              <>
                <Link href="/restaurant/manage" className="text-gray-400 hover:text-gray-300 transition-colors">
                  My Restaurants
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}