import { Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="text-center flex flex-col items-center gap-2">
      <img src="/logo.png" alt="Cyber Café Logo" className="w-14 h-14 rounded-full shadow-md" />
      <h1 className="text-4xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">Cyber Café POS</h1>
      <p className="text-sm text-gray-500 dark:text-gray-300">Fast & simple billing system</p>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
}