import { Printer } from 'lucide-react';

export default function TotalBar({ total, hasData, setShowPreview, generateReceipt, clearAll }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md text-center mt-6">
      <h2 className="font-bold text-xl text-gray-800 dark:text-white">
        Total: <span className="text-green-600 dark:text-green-400">KES {total}</span>
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <button
          onClick={() => setShowPreview(true)}
          disabled={!hasData}
          className={`bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 ${!hasData && 'opacity-50 cursor-not-allowed'}`}
        >
          <Printer size={18} /> Preview Receipt
        </button>
        <button
          onClick={generateReceipt}
          disabled={!hasData}
          className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 ${!hasData && 'opacity-50 cursor-not-allowed'}`}
        >
          <Printer size={18} /> Generate Receipt
        </button>
        <button
          onClick={clearAll}
          className="text-red-600 hover:text-red-800 underline text-sm mt-1 md:mt-0"
        >
          Clear All Entries
        </button>
      </div>
    </div>
  );
}