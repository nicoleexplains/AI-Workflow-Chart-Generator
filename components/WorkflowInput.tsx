import React, { useState } from 'react';

interface WorkflowInputProps {
  onGenerate: (description: string) => void;
  isLoading: boolean;
}

const WorkflowInput: React.FC<WorkflowInputProps> = ({ onGenerate, isLoading }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const exampleDescription = "The process starts with a 'Client Kick-off' meeting. After that, we 'Gather Requirements'. If the requirements are clear, we move to 'Design Phase'. If not, we have another 'Clarification Meeting' and go back to gathering requirements. From the design phase, we proceed to 'Development', then 'Testing'. Finally, the process ends with 'Project Deployment'.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
        setError('Please enter a workflow description.');
        return;
    }
    setError(null);
    onGenerate(description);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Describe Your Workflow</h2>
        <div className="flex-grow flex flex-col">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full flex-grow p-4 text-base leading-relaxed text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
            placeholder="Describe the steps, decisions, and flow of your project. For example: Start with a client kick-off meeting, then gather requirements. If requirements are clear, move to design..."
            disabled={isLoading}
          />
           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
           <button
             type="submit"
             className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
             disabled={isLoading}
           >
             {isLoading ? 'Generating...' : 'Generate Chart'}
           </button>
           <button
            type="button"
            onClick={() => setDescription(exampleDescription)}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200"
            disabled={isLoading}
           >
            Load Example
           </button>
        </div>
      </form>
    </div>
  );
};

export default WorkflowInput;