import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import KeyGate from '../components/KeyGate';
import { getAllOnboarding, getAllSurveys } from '../lib/supabase';

function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportOnboarding = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOnboarding();
      downloadCSV(data, 'onboarding.csv');
    } catch (error) {
      console.error('Failed to export onboarding data:', error);
      alert('Failed to export onboarding data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurveys();
      downloadCSV(data, 'surveys.csv');
    } catch (error) {
      console.error('Failed to export surveys:', error);
      alert('Failed to export surveys');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              Admin Panel
            </h1>
            
            <div className="space-y-4">
              <button
                onClick={handleExportOnboarding}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? 'Exporting...' : 'Export Onboarding Data (CSV)'}
              </button>
              
              <button
                onClick={handleExportSurveys}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? 'Exporting...' : 'Export Surveys (CSV)'}
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Export Information</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Onboarding: User registration data</li>
                <li>• Surveys: Visual impact ratings and comments for each video</li>
                <li>• All data includes session ID and user identifier</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [searchParams] = useSearchParams();
  const urlKey = searchParams.get('key');
  const requiredKey = import.meta.env.VITE_ADMIN_KEY;

  // If key is provided in URL and matches, bypass the gate
  if (urlKey === requiredKey) {
    return <AdminPanel />;
  }

  return (
    <KeyGate requiredKey={requiredKey}>
      <AdminPanel />
    </KeyGate>
  );
}
