
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import WorkflowInput from './components/WorkflowInput';
import WorkflowChart from './components/WorkflowChart';
import { generateWorkflow } from './services/geminiService';
import type { WorkflowData } from './types';
import LoadingSpinner from './components/icons/LoadingSpinner';

const App: React.FC = () => {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChart = useCallback(async (description: string) => {
    setIsLoading(true);
    setError(null);
    setWorkflowData(null);

    try {
      const data = await generateWorkflow(description);
      setWorkflowData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate workflow chart. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePrint = () => {
    if (workflowData) {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header onPrint={handlePrint} isPrintDisabled={!workflowData} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <WorkflowInput onGenerate={handleGenerateChart} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-xl shadow-md p-4 min-h-[600px] flex items-center justify-center border border-gray-200">
              {isLoading && (
                <div className="text-center">
                  <LoadingSpinner className="h-12 w-12 mx-auto text-indigo-600" />
                  <p className="mt-4 text-lg font-medium text-gray-600">Generating your workflow...</p>
                  <p className="text-sm text-gray-500">This might take a moment.</p>
                </div>
              )}
              {error && (
                <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg">An Error Occurred</h3>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && !workflowData && (
                 <div className="text-center text-gray-500">
                    <p className="text-xl font-semibold">Welcome to the AI Workflow Chart Generator</p>
                    <p className="mt-2">Describe your project's workflow in the panel on the left to get started.</p>
                </div>
              )}
              {workflowData && (
                <div id="chart-container" className="w-full h-full printable-area">
                  <WorkflowChart data={workflowData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
