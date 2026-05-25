import { FileStack, AlertCircle, Calculator } from 'lucide-react';

export default function SearchResults({ resultados, handleAbrirCalculadora }) {
  if (resultados === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/30 rounded-2xl border-2 border-slate-200 border-dashed text-slate-400 min-h-[500px]">
        <div className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-slate-200/40">
          <FileStack className="w-10 h-10 text-slate-500/80" />
        </div>
        <p className="text-lg font-bold text-slate-800">
          Consulta Técnica de Troqueles
        </p>
        <p className="text-slate-500 text-xs mt-2 text-center max-w-xs leading-relaxed">
          Ingrese las dimensiones de la etiqueta y tolerancia requerida para buscar coincidencias en el catálogo de troqueles.
        </p>
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm min-h-[350px]">
        <div className="bg-white p-3 rounded-full shadow-sm mb-1 border border-red-100">
          <AlertCircle className="w-8 h-8 text-red-650" />
        </div>
        <h3 className="text-red-955 font-bold text-lg">Sin Coincidencias Detectadas</h3>
        <p className="text-red-800/80 font-medium text-xs max-w-xs leading-relaxed">
          No se identificaron herramentales que coincidan exactamente con las especificaciones técnicas ingresadas. Considere ampliar el rango de tolerancia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
          Herramentales Compatibles
          <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] py-0.5 px-2.5 rounded-full shadow-sm font-bold">
            {resultados.length} coincidencia{resultados.length > 1 ? 's' : ''}
          </span>
        </h3>
      </div>
      <div className="grid gap-4">
        {resultados.map((troquel, idx) => {
          const esFoco = troquel.familia_troquel === "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
          
          return (
            <div
              key={troquel.codigo_troquel + idx}
              className={`p-5 rounded-xl border relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-default group ${
                esFoco
                  ? 'bg-gradient-to-br from-white to-blue-50/20 border-blue-200/70 shadow-sm'
                  : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              {esFoco && (
                <div className="absolute top-0 right-0 bg-blue-900 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm border-l border-b border-blue-900">
                  Troquel de Línea
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Código de Herramental</p>
                  <h4 className="text-xl font-extrabold tracking-tight text-slate-800">
                    {troquel.codigo_troquel}
                  </h4>
                </div>
                <div className="sm:text-right bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dimensiones (A x L)</p>
                  <p className="text-lg font-extrabold text-slate-800 tracking-tight">
                    {troquel.ancho_mm}<span className="text-slate-300 font-medium mx-1 text-sm">x</span>{troquel.largo_mm} <span className="text-xs text-slate-400 font-semibold">mm</span>
                  </p>
                </div>
              </div>
              {/* Indicadores de Precorte */}
              <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                {troquel.precorte_entre_cavidades && troquel.precorte_entre_cavidades !== 'NO' ? (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Precorte Cavidades: {troquel.precorte_entre_cavidades}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-200/40">
                    Sin Precorte Cavidades
                  </span>
                )}

                {troquel.precorte_integrado === 'SI' ? (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/60 shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                    </span>
                    Precorte Integrado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-200/40">
                    Sin Precorte Integrado
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200/60">
                    {troquel.familia_troquel || 'Sin Familia'}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60">
                    {troquel.forma}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-auto flex-wrap sm:flex-nowrap">
                  {troquel.cilindro && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-850 border border-amber-200/40">
                      Cilindro: {troquel.cilindro}
                    </span>
                  )}
                  <button
                    onClick={() => handleAbrirCalculadora(troquel)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-emerald-500 hover:from-blue-800 hover:via-purple-700 hover:to-emerald-600 text-white rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="w-3 h-3" />
                    Calcular Insumos
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
