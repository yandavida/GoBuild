import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Calculator from './pages/Calculator';
import Admin from './pages/Admin';
import Quote from './pages/Quote';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-slate-100 flex flex-col">
        <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
          <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-900">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-none tracking-wide">GoBuild</h1>
              <p className="text-xs text-brand-200 mt-0.5">מחשבון מחיצות גבס</p>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <NavBar />
      </div>
    </BrowserRouter>
  );
}
