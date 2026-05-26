import { Ruler, Calculator, LayoutList } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 neu-bg-main shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="neu-elevated p-2.5 transition-transform duration-300">
            <Ruler className="w-6 h-6 neu-text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight neu-text-main">
              Cotizador Técnico - Flexo RS
            </h1>
            <p className="text-[10px] font-bold neu-text-sec uppercase tracking-wider">
              Ingeniería y Consulta de Herramentales
            </p>
          </div>
        </div>

        <div className="flex neu-concave p-1.5 rounded-[20px] flex-wrap sm:flex-nowrap gap-1">
          <button
            onClick={() => setActiveTab('cotizador')}
            className={`flex items-center gap-2 px-3 py-2 rounded-[16px] text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'cotizador' 
                ? 'neu-elevated neu-text-blue scale-100' 
                : 'neu-text-sec hover:neu-text-main scale-95 hover:scale-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Buscador de Troqueles
          </button>
          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-3 py-2 rounded-[16px] text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'inventario' 
                ? 'neu-elevated neu-text-blue scale-100' 
                : 'neu-text-sec hover:neu-text-main scale-95 hover:scale-100'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Catálogo de Troqueles
          </button>
          <button
            onClick={() => setActiveTab('cotizador_flexo')}
            className={`flex items-center gap-2 px-3 py-2 rounded-[16px] text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'cotizador_flexo' 
                ? 'neu-elevated neu-text-blue scale-100' 
                : 'neu-text-sec hover:neu-text-main scale-95 hover:scale-100'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            Cotizador Flexo
          </button>
        </div>
      </div>
    </header>
  );
}
