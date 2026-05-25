import { useState, useMemo } from 'react';
import { Search, Calculator } from 'lucide-react';

export default function TroquelesCatalog({ troquelesData, handleAbrirCalculadora }) {
  const [inventarioSearch, setInventarioSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredInventario = useMemo(() => {
    return troquelesData.filter(t => {
      const query = inventarioSearch.toLowerCase();
      const code = (t.codigo_troquel || '').toLowerCase();
      const forma = (t.forma || '').toLowerCase();
      return code.includes(query) || forma.includes(query);
    });
  }, [troquelesData, inventarioSearch]);

  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);
  const currentInventarioItems = filteredInventario.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="neu-elevated rounded-[24px] p-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h2 className="text-lg font-bold neu-text-main tracking-tight">Catálogo General de Troqueles</h2>
          <p className="text-xs font-semibold neu-text-sec mt-0.5 uppercase tracking-wider">
            {troquelesData.length} Herramentales Registrados
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 neu-text-sec" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 neu-concave leading-5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold transition-all"
            placeholder="Buscar por código o forma..."
            value={inventarioSearch}
            onChange={(e) => {
              setInventarioSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-[20px] overflow-hidden neu-concave p-1">
        <div className="overflow-x-auto rounded-[18px]">
          <table className="min-w-full divide-y divide-slate-200/20">
            <thead>
              <tr>
                <th scope="col" className="px-5 py-4 text-left text-[10px] font-bold neu-text-sec uppercase tracking-wider">CÓDIGO</th>
                <th scope="col" className="px-5 py-4 text-left text-[10px] font-bold neu-text-sec uppercase tracking-wider">DIMENSIONES (mm)</th>
                <th scope="col" className="px-5 py-4 text-left text-[10px] font-bold neu-text-sec uppercase tracking-wider">GEOMETRÍA</th>
                <th scope="col" className="px-5 py-4 text-left text-[10px] font-bold neu-text-sec uppercase tracking-wider">FAMILIA</th>
                <th scope="col" className="px-5 py-4 text-left text-[10px] font-bold neu-text-sec uppercase tracking-wider">CILINDRO</th>
                <th scope="col" className="px-5 py-4 text-right text-[10px] font-bold neu-text-sec uppercase tracking-wider">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/20">
              {currentInventarioItems.length > 0 ? (
                currentInventarioItems.map((t, i) => {
                  const esFoco = t.familia_troquel === "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
                  return (
                    <tr key={t.codigo_troquel + i} className={`hover:bg-slate-50/20 transition-colors group`}>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className={`text-xs font-bold transition-colors ${esFoco ? 'neu-text-blue' : 'neu-text-main'}`}>
                          {t.codigo_troquel}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold neu-text-sec">
                          {t.ancho_mm} <span className="neu-text-sec mx-0.5">x</span> {t.largo_mm}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-[12px] text-[10px] font-bold neu-elevated neu-text-main">
                          {t.forma}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {esFoco ? (
                          <span className="px-3 py-1 neu-elevated neu-text-blue text-[10px] rounded-[12px] font-bold tracking-wide">
                            FLEXIBLES RECT
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium neu-text-sec">
                            {t.familia_troquel || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-bold neu-text-sec">
                        {t.cilindro || '-'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleAbrirCalculadora(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold neu-elevated neu-text-blue hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          Calcular
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center neu-text-sec">
                      <Search className="w-8 h-8 mb-2" />
                      <p className="text-sm font-bold">Sin resultados</p>
                      <p className="text-xs font-medium">No se encontraron troqueles para "{inventarioSearch}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 px-2">
          <p className="text-xs font-semibold neu-text-sec">
            Mostrando <span className="font-bold neu-text-main">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold neu-text-main">{Math.min(currentPage * itemsPerPage, filteredInventario.length)}</span> de <span className="font-bold neu-text-main">{filteredInventario.length}</span>
          </p>
          <div className="flex items-center gap-2 neu-concave p-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-[14px] text-xs font-bold neu-elevated neu-text-main hover:neu-text-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <div className="px-3 font-bold text-xs neu-text-main">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-[14px] text-xs font-bold neu-elevated neu-text-main hover:neu-text-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
