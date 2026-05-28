import { FileStack, AlertCircle, Calculator } from 'lucide-react';
import { inventarioCilindros } from '../logic/cilindros';

export default function SearchResults({ resultados, handleAbrirCalculadora, coloresRequeridos = 1 }) {
  if (resultados === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 neu-concave min-h-[500px]">
        <div className="neu-elevated p-4 mb-4">
          <FileStack className="w-10 h-10 neu-text-sec" />
        </div>
        <p className="text-lg font-bold neu-text-main">
          Consulta Técnica de Troqueles
        </p>
        <p className="neu-text-sec text-xs mt-2 text-center max-w-xs leading-relaxed">
          Ingrese las dimensiones de la etiqueta y tolerancia requerida para buscar coincidencias en el catálogo de troqueles.
        </p>
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="neu-concave p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[350px]">
        <div className="neu-elevated p-3 mb-1">
          <AlertCircle className="w-8 h-8 neu-text-red" />
        </div>
        <h3 className="neu-text-red font-bold text-lg">Sin Coincidencias Detectadas</h3>
        <p className="neu-text-sec font-medium text-xs max-w-xs leading-relaxed">
          No se identificaron herramentales que coincidan exactamente con las especificaciones técnicas ingresadas. Considere ampliar el rango de tolerancia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between neu-elevated p-4">
        <h3 className="text-base font-bold neu-text-main flex items-center gap-2.5">
          Herramentales Compatibles
          <span className="neu-concave neu-text-blue text-[10px] py-1 px-3 font-bold">
            {resultados.length} coincidencia{resultados.length > 1 ? 's' : ''}
          </span>
        </h3>
      </div>
      <div className="grid gap-6">
        {resultados.map((troquel, idx) => {
          const esFoco = troquel.familia_troquel === "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
          
          let cantidadCilindros = 0;
          if (troquel.cilindro) {
             cantidadCilindros = inventarioCilindros.reduce((acc, c) => {
               if (Number(c.cilindro) === Number(troquel.cilindro)) {
                 return acc + c.cantidad;
               }
               return acc;
             }, 0);
          }
          
          return (
            <div
              key={troquel.codigo_troquel + idx}
              className="p-6 relative overflow-hidden transition-all duration-300 neu-elevated"
            >
              {esFoco && (
                <div className="absolute top-0 right-0 bg-[#005CB9] text-white text-[9px] font-bold px-3 py-1 rounded-bl-[16px] uppercase tracking-wider">
                  Troquel de Línea
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                <div>
                  <p className="text-[10px] font-bold neu-text-sec uppercase tracking-wider mb-0.5">Código de Herramental</p>
                  <h4 className="text-xl font-extrabold tracking-tight neu-text-main">
                    {troquel.codigo_troquel}
                  </h4>
                </div>
                <div className="sm:text-right neu-concave p-3">
                  <p className="text-[9px] font-bold neu-text-sec uppercase tracking-wider mb-0.5">Dimensiones (A x L)</p>
                  <p className="text-lg font-extrabold neu-text-blue tracking-tight">
                    {troquel.ancho_mm}<span className="neu-text-sec font-medium mx-1 text-sm">x</span>{troquel.largo_mm} <span className="text-xs neu-text-sec font-semibold">mm</span>
                  </p>
                </div>
              </div>
              {/* Indicadores de Precorte */}
              <div className="mt-5 flex flex-wrap gap-2 relative z-10">
                {troquel.precorte_entre_cavidades && troquel.precorte_entre_cavidades !== 'NO' ? (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 neu-concave neu-text-main">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#005CB9]"></span>
                    </span>
                    Precorte Cavidades: {troquel.precorte_entre_cavidades}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider px-3 py-1.5 neu-concave neu-text-sec">
                    Sin Precorte Cavidades
                  </span>
                )}

                {troquel.precorte_integrado === 'SI' ? (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 neu-concave neu-text-main">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#005CB9]"></span>
                    </span>
                    Precorte Integrado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider px-3 py-1.5 neu-concave neu-text-sec">
                    Sin Precorte Integrado
                  </span>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold px-3 py-1.5 neu-concave neu-text-sec">
                    {troquel.familia_troquel || 'Sin Familia'}
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1.5 neu-concave neu-text-sec">
                    {troquel.forma}
                  </span>
                  {troquel.ancho_banda && (
                    <span className="text-[10px] font-bold px-3 py-1.5 neu-concave neu-text-blue bg-blue-50/50">
                      Banda: {troquel.ancho_banda} in
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-auto flex-wrap sm:flex-nowrap">
                  {troquel.cilindro && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold px-3 py-1.5 neu-concave neu-text-main">
                        Cilindro: {troquel.cilindro}
                      </span>
                      {cantidadCilindros > 0 ? (
                        <span className="text-[9px] font-bold px-2 py-1 rounded-[10px] bg-green-100 text-green-700">
                          Rodillos en inventario ({cantidadCilindros})
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-1 rounded-[10px] bg-red-100 text-red-700">
                          Sin rodillos en inventario
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => handleAbrirCalculadora(troquel)}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold neu-btn-primary transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-[#2C2C2E] hover:bg-[#005CB9] hover:text-white"
                    >
                      <Calculator className="w-4 h-4 text-blue-400" />
                      Cotizar este Troquel
                    </button>
                    <span className="text-[9px] font-medium text-slate-400 leading-tight">
                      Ir directo al cotizador
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
