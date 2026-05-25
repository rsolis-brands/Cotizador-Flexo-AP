import { Ruler, Calculator, LayoutList } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 shadow-sm transition-transform duration-300">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Cotizador Técnico - Flexo RS
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ingeniería y Consulta de Herramentales
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('cotizador')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'cotizador' 
                ? 'bg-slate-950 text-white shadow-sm scale-100' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 scale-95 hover:scale-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Buscador de Troqueles
          </button>
          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'inventario' 
                ? 'bg-slate-950 text-white shadow-sm scale-100' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 scale-95 hover:scale-100'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Catálogo de Troqueles
          </button>
        </div>
      </div>
    </header>
  );
}
