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
    <div className="glass-panel rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Catálogo General de Troqueles</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wider">
            {troquelesData.length} Herramentales Registrados
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 text-xs font-semibold transition-all shadow-sm"
            placeholder="Buscar por código o forma..."
            value={inventarioSearch}
            onChange={(e) => {
              setInventarioSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/60">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">CÓDIGO</th>
                <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">DIMENSIONES (mm)</th>
                <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">GEOMETRÍA</th>
                <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">FAMILIA</th>
                <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">CILINDRO</th>
                <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentInventarioItems.length > 0 ? (
                currentInventarioItems.map((t, i) => {
                  const esFoco = t.familia_troquel === "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
                  return (
                    <tr key={t.codigo_troquel + i} className={`hover:bg-slate-50/50 transition-colors group ${esFoco ? 'bg-blue-50/10' : 'bg-white'}`}>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className={`text-xs font-bold transition-colors ${esFoco ? 'text-blue-800' : 'text-slate-800'}`}>
                          {t.codigo_troquel}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-600">
                          {t.ancho_mm} <span className="text-slate-350 mx-0.5">x</span> {t.largo_mm}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/40">
                          {t.forma}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {esFoco ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200/50 text-[10px] rounded font-bold tracking-wide">
                            FLEXIBLES RECT
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500">
                            {t.familia_troquel || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-bold text-slate-500">
                        {t.cilindro || '-'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleAbrirCalculadora(t)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-white bg-slate-50 hover:bg-slate-900 rounded border border-slate-200 hover:border-slate-900 transition-all cursor-pointer shadow-sm"
                        >
                          <Calculator className="w-3 h-3" />
                          Calcular
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-2 text-slate-300" />
                      <p className="text-sm font-bold text-slate-500">Sin resultados</p>
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
          <p className="text-xs font-semibold text-slate-500">
            Mostrando <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredInventario.length)}</span> de <span className="font-bold text-slate-700">{filteredInventario.length}</span>
          </p>
          <div className="flex items-center gap-1.5 bg-slate-105 p-0.5 rounded-lg border border-slate-200/50">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-650 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-205"
            >
              Anterior
            </button>
            <div className="px-2.5 font-bold text-xs text-slate-500">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-650 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-205"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
