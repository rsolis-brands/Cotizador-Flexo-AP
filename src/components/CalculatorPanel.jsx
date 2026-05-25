import { X, Calculator, Sparkles, Sliders, Ruler, AlertCircle, Copy, Check } from 'lucide-react';

export default function CalculatorPanel({
  selectedTroquel,
  setSelectedTroquel,
  calcInputs,
  handleCalcInputChange,
  setCalcInputs,
  calcResultados,
  handleCopiarResumen,
  copied
}) {
  if (!selectedTroquel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background backdrop blur */}
        <div 
          onClick={() => setSelectedTroquel(null)}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-lg animate-in slide-in-from-right duration-300">
            <div className="flex h-full flex-col overflow-y-scroll glass-panel-dark text-slate-100 shadow-2xl">
              
              {/* Header */}
              <div className="bg-slate-950 px-6 py-6 text-white relative border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTroquel(null)}
                  className="absolute top-6 right-6 rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/5">
                    <Calculator className="w-5 h-5 text-slate-200" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-white" id="slide-over-title">
                    Cálculo Técnico de Insumos
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Optimización y volumetría de producción para herramental <span className="font-semibold text-slate-200">{selectedTroquel.codigo_troquel}</span>
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 px-6 py-6 space-y-6 bg-slate-900/20 overflow-y-auto">
                
                {/* Ficha Técnica del Troquel */}
                <div className="bg-slate-900/40 rounded-xl p-4.5 border border-white/5 shadow-sm space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-slate-400" /> ESPECIFICACIÓN DEL HERRAMENTAL
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Medidas</p>
                      <p className="text-xs font-semibold text-slate-200">{selectedTroquel.ancho_mm} x {selectedTroquel.largo_mm} mm</p>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Vías al Ancho</p>
                      <p className="text-xs font-semibold text-slate-200">{selectedTroquel.cavidades_ancho} vías</p>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Rep. Avance</p>
                      <p className="text-xs font-semibold text-slate-200">{selectedTroquel.cavidades_avance} rep.</p>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Cilindro Base</p>
                      <p className="text-xs font-semibold text-slate-200">{selectedTroquel.cilindro || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Desarrollo (Repeat)</p>
                      <p className="text-xs font-semibold text-slate-200">{selectedTroquel.repeat_mm} mm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-4.5 border border-white/5 shadow-sm space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2.5">
                    <Sliders className="w-3 h-3 text-slate-400" /> PARÁMETROS DE PRODUCCIÓN
                  </h3>

                  {/* Cantidad requerida */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-350">Volumen Requerido (Etiquetas)</label>
                      <span className="text-[11px] font-semibold text-slate-400">{Number(calcInputs.cantidadEtiquetas).toLocaleString()} uds</span>
                    </div>
                    <input
                      type="number"
                      name="cantidadEtiquetas"
                      value={calcInputs.cantidadEtiquetas}
                      onChange={handleCalcInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/35 outline-none font-semibold text-white transition-all text-sm"
                    />
                    {/* Botones rápidos */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[5000, 10000, 25000, 50000, 100000].map(val => (
                        <button
                          key={`preset-${val}`}
                          type="button"
                          onClick={() => setCalcInputs(prev => ({ ...prev, cantidadEtiquetas: val }))}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border cursor-pointer ${
                            calcInputs.cantidadEtiquetas === val
                              ? 'bg-white text-slate-950 border-white shadow-sm'
                              : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-white/10'
                          }`}
                        >
                          {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Etiquetas por Rollo */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-355">Cantidad por Rollo</label>
                      <input
                        type="number"
                        name="etiquetasPorRollo"
                        value={calcInputs.etiquetasPorRollo}
                        onChange={handleCalcInputChange}
                        min="1"
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/35 outline-none font-semibold text-white transition-all text-sm"
                      />
                    </div>

                    {/* Ancho de Banda */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-355">Ancho Banda (in)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="anchoBanda"
                        value={calcInputs.anchoBanda}
                        onChange={handleCalcInputChange}
                        min="0"
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/35 outline-none font-semibold text-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Merma Arranque */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-355">Merma de Montaje (m)</label>
                      <input
                        type="number"
                        name="mermaArranque"
                        value={calcInputs.mermaArranque}
                        onChange={handleCalcInputChange}
                        min="0"
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/35 outline-none font-semibold text-white transition-all text-sm"
                      />
                    </div>

                    {/* Merma Operación */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-355">Merma Op. (%)</label>
                        <span className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/15 px-1.5 py-0.2 rounded">{calcInputs.mermaOperacion}%</span>
                      </div>
                      <input
                        type="number"
                        name="mermaOperacion"
                        value={calcInputs.mermaOperacion}
                        onChange={handleCalcInputChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:border-white/35 outline-none font-semibold text-white transition-all text-sm"
                      />
                    </div>
                  </div>

                </div>

                {/* Resultados del Cálculo */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    RESUMEN DE RENDIMIENTO DE INSUMOS
                  </h3>

                  {/* Tarjeta de Metros Totales (Hero) */}
                  <div className="bg-slate-950 text-white rounded-xl p-4.5 border border-white/10 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metros Lineales Totales de Producción</p>
                      <p className="text-3xl font-extrabold tracking-tight mt-1 text-white">
                        {calcResultados?.metrosTotales?.toLocaleString()} <span className="text-lg font-medium text-slate-400">m</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">
                        {calcResultados?.metrosNetos?.toLocaleString()} m netos + {calcResultados?.metrosMerma?.toLocaleString()} m de merma técnica
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <Ruler className="w-8 h-8 text-slate-400" />
                    </div>
                  </div>

                  {/* Grid de Métricas secundarias */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Consumo de Material (m²)</p>
                      <p className="text-base font-bold text-slate-200 mt-0.5">{calcResultados?.metrosCuadrados?.toLocaleString()} m²</p>
                      <p className="text-[9px] text-slate-500 font-semibold">Banda: {calcResultados?.anchoBandaMm} mm</p>
                    </div>

                    <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Longitud por Rollo (m)</p>
                      <p className="text-base font-bold text-slate-200 mt-0.5">{calcResultados?.largoRollo?.toLocaleString()} m</p>
                      <p className="text-[9px] text-slate-500 font-semibold">{calcInputs.etiquetasPorRollo?.toLocaleString()} etiq/rollo</p>
                    </div>

                    <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cantidad de Rollos</p>
                      <p className="text-base font-bold text-slate-200 mt-0.5">{calcResultados?.rollos} rollos</p>
                      <p className="text-[9px] text-slate-500 font-semibold">{selectedTroquel.cavidades_ancho} vías de salida</p>
                    </div>

                    <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ciclos de Giro de Cilindro</p>
                      <p className="text-base font-bold text-slate-200 mt-0.5">{calcResultados?.girosBase?.toLocaleString()} giros</p>
                      <p className="text-[9px] text-slate-500 font-semibold">{selectedTroquel.cavidades_ancho * selectedTroquel.cavidades_avance} etiq/giro</p>
                    </div>
                  </div>

                  {/* Info alert */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-450 shrink-0 mt-0.5" />
                    <div>
                      Nota de control de producción: Para cumplir con el volumen neto solicitado de {Number(calcInputs.cantidadEtiquetas).toLocaleString()} etiquetas distribuidas en {calcResultados?.rollos} rollos de {Number(calcInputs.etiquetasPorRollo).toLocaleString()} unidades, se requiere procesar un total de <span className="font-semibold text-slate-200">{calcResultados?.etiquetasTotalesConMerma?.toLocaleString()} etiquetas</span>, compensando las mermas técnicas de montaje y operación especificadas.
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="bg-slate-955 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTroquel(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                
                <button
                  type="button"
                  onClick={handleCopiarResumen}
                  className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' 
                      : 'bg-gradient-to-r from-blue-700 via-purple-600 to-emerald-500 hover:from-blue-800 hover:via-purple-700 hover:to-emerald-600 shadow-sm'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Datos Técnicos</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
