'use client';

import React from 'react';

export default function TestSimpleReactPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple React Test</h1>
        <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
          <p className="text-sm text-gray-600 mb-2">Simple React Test - No useEffect</p>
          <div className="w-[500px] h-[300px] border border-blue-500 bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4"></div>
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
              <p className="mt-4 text-sm">This should render immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
