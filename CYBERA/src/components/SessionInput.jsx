import { Monitor, PlusCircle, Trash2 } from 'lucide-react';

export default function SessionInput({ sessions, computer, duration, setComputer, setDuration, addSession, removeSession }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Monitor size={20} /> New Session
      </h2>
      <div className="space-y-3">
        <input className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={computer} onChange={e => setComputer(e.target.value)} placeholder="Computer Name" />
        <input className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" />
        <button onClick={addSession} className="btn-blue"><PlusCircle size={18} /> Add Session</button>
      </div>
      <ul className="mt-4 text-sm text-gray-800 dark:text-gray-200 space-y-1">
        {sessions.length === 0 && <p className="text-gray-400 italic">No sessions added.</p>}
        {sessions.map((s, i) => (
          <li key={i} className="flex justify-between items-center">
            {s.computer} - {s.duration} min - KES {s.charge}
            <button onClick={() => removeSession(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}