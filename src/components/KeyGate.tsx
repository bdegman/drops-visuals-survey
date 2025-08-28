import { useState } from 'react';

interface KeyGateProps {
  requiredKey: string;
  children: React.ReactNode;
}

export default function KeyGate({ requiredKey, children }: KeyGateProps) {
  const [inputKey, setInputKey] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === requiredKey) {
      setIsValid(true);
    }
  };

  if (isValid) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Access Required
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin key"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Access Admin Panel
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-400 text-center">
            Add ?key=YOUR_KEY to the URL for direct access
          </p>
        </div>
      </div>
    </div>
  );
}
