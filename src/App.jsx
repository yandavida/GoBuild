import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Calculator from './pages/Calculator';
import Admin from './pages/Admin';
import Quote from './pages/Quote';
import CNCSpec from './pages/CNCSpec';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-[#e8ecf1] flex flex-col">
        <header className="sticky top-0 z-40 bg-[#0f1b2d] text-white border-b border-[#1e3050]">
          <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-2.5">
            <div className="w-7 h-7 bg-amber-500 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#0f1b2d]">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-sm font-bold tracking-widest uppercase">GoBuild</h1>
              <span className="text-xs text-zinc-400 font-mono">מחשבון מחיצות גבס</span>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/cnc" element={<CNCSpec />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <NavBar />
      </div>
    </BrowserRouter>
  );
}
