
import React from 'react';
import PrintIcon from './icons/PrintIcon';

interface HeaderProps {
  onPrint: () => void;
  isPrintDisabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onPrint, isPrintDisabled }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
             <h1 className="text-2xl font-bold text-gray-900">
                AI Workflow Chart Generator
             </h1>
          </div>
          <div className="flex items-center">
             <button
                onClick={onPrint}
                disabled={isPrintDisabled}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
             >
                <PrintIcon className="-ml-1 mr-2 h-5 w-5" />
                Print as PDF
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
