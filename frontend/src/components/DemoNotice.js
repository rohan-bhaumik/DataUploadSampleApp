import React from 'react';

function DemoNotice() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>GitHub Pages Demo Mode</strong>
            <br />
            This is a demo version running on GitHub Pages. The backend API is not available, so data persistence is disabled. 
            <a 
              href="https://github.com/rohan-bhaumik/DataUploadSampleApp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline hover:no-underline"
            >
              View the full repository
            </a> to run with database functionality.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DemoNotice;
