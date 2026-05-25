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
          className="absolute inset-0 bg-[rgba(29,29,31,0.18)] backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-lg animate-in slide-in-from-right duration-300">
            <div className="flex h-full flex-col overflow-y-scroll neu-bg-modal neu-text-main shadow-2xl">
              
              {/* Header */}
              <div className="px-6 py-6 relative z-10">
                <button
                  type="button"
                  onClick={() => setSelectedTroquel(null)}
                  className="absolute top-6 right-6 rounded-full p-2 neu-text-sec hover:neu-text-red transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="neu-concave p-2">
                    <Calculator className="w-5 h-5 neu-text-blue" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight neu-text-main" id="slide-over-title">
                    Cálculo Técnico de Insumos
                  </h2>
                </div>
                <p className="text-xs neu-text-sec">
                  Optimización y volumetría de producción para herramental <span className="font-semibold neu-text-main">{selectedTroquel.codigo_troquel}</span>
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 px-6 py-2 space-y-6 overflow-y-auto">
                
                {/* Ficha Técnica del Troquel */}
                <div className="neu-elevated p-5 space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> ESPECIFICACIÓN DEL HERRAMENTAL
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="neu-concave p-3">
                      <p className="text-[9px] neu-text-sec font-bold uppercase">Medidas</p>
                      <p className="text-xs font-semibold neu-text-main">{selectedTroquel.ancho_mm} x {selectedTroquel.largo_mm} mm</p>
                    </div>
                    <div className="neu-concave p-3">
                      <p className="text-[9px] neu-text-sec font-bold uppercase">Vías al Ancho</p>
                      <p className="text-xs font-semibold neu-text-main">{selectedTroquel.cavidades_ancho} vías</p>
                    </div>
                    <div className="neu-concave p-3">
                      <p className="text-[9px] neu-text-sec font-bold uppercase">Rep. Avance</p>
                      <p className="text-xs font-semibold neu-text-main">{selectedTroquel.cavidades_avance} rep.</p>
                    </div>
                    <div className="neu-concave p-3">
                      <p className="text-[9px] neu-text-sec font-bold uppercase">Cilindro Base</p>
                      <p className="text-xs font-semibold neu-text-main">{selectedTroquel.cilindro || 'N/A'}</p>
                    </div>
                    <div className="neu-concave p-3">
                      <p className="text-[9px] neu-text-sec font-bold uppercase">Desarrollo (Repeat)</p>
                      <p className="text-xs font-semibold neu-text-main">{selectedTroquel.repeat_mm} mm</p>
                    </div>
                  </div>
                </div>

                <div className="neu-elevated p-5 space-y-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 pb-1">
                    <Sliders className="w-3 h-3" /> PARÁMETROS DE PRODUCCIÓN
                  </h3>

                  {/* Cantidad requerida */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold neu-text-main">Volumen Requerido (Etiquetas)</label>
                      <span className="text-[11px] font-semibold neu-text-blue">{Number(calcInputs.cantidadEtiquetas).toLocaleString()} uds</span>
                    </div>
                    <input
                      type="number"
                      name="cantidadEtiquetas"
                      value={calcInputs.cantidadEtiquetas}
                      onChange={handleCalcInputChange}
                      min="1"
                      className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main transition-all text-sm"
                    />
                    {/* Botones rápidos */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[5000, 10000, 25000, 50000, 100000].map(val => (
                        <button
                          key={`preset-${val}`}
                          type="button"
                          onClick={() => setCalcInputs(prev => ({ ...prev, cantidadEtiquetas: val }))}
                          className={`px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer rounded-[14px] ${
                            calcInputs.cantidadEtiquetas === val
                              ? 'neu-elevated neu-text-blue'
                              : 'neu-concave neu-text-sec hover:neu-text-main'
                          }`}
                        >
                          {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Etiquetas por Rollo */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold neu-text-main">Cantidad por Rollo</label>
                      <input
                        type="number"
                        name="etiquetasPorRollo"
                        value={calcInputs.etiquetasPorRollo}
                        onChange={handleCalcInputChange}
                        min="1"
                        className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main transition-all text-sm"
                      />
                    </div>

                    {/* Ancho de Banda */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold neu-text-main">Ancho Banda (in)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="anchoBanda"
                        value={calcInputs.anchoBanda}
                        onChange={handleCalcInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {/* Merma Arranque */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold neu-text-main">Merma de Montaje (m)</label>
                      <input
                        type="number"
                        name="mermaArranque"
                        value={calcInputs.mermaArranque}
                        onChange={handleCalcInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main transition-all text-sm"
                      />
                    </div>

                    {/* Merma Operación */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold neu-text-main">Merma Op. (%)</label>
                        <span className="text-[10px] font-bold neu-text-blue">{calcInputs.mermaOperacion}%</span>
                      </div>
                      <input
                        type="number"
                        name="mermaOperacion"
                        value={calcInputs.mermaOperacion}
                        onChange={handleCalcInputChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main transition-all text-sm"
                      />
                    </div>
                  </div>

                </div>

                {/* Resultados del Cálculo */}
                <div className="space-y-4 pb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 pl-2">
                    RESUMEN DE RENDIMIENTO DE INSUMOS
                  </h3>

                  {/* Tarjeta de Metros Totales (Hero) */}
                  <div className="neu-elevated p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold neu-text-sec uppercase tracking-wider">Metros Lineales Totales de Producción</p>
                      <p className="text-3xl font-extrabold tracking-tight mt-1 neu-text-blue">
                        {calcResultados?.metrosTotales?.toLocaleString()} <span className="text-lg font-medium neu-text-main">m</span>
                      </p>
                      <p className="text-[10px] neu-text-sec font-semibold mt-1">
                        {calcResultados?.metrosNetos?.toLocaleString()} m netos + {calcResultados?.metrosMerma?.toLocaleString()} m de merma técnica
                      </p>
                    </div>
                    <div className="neu-concave p-4">
                      <Ruler className="w-8 h-8 neu-text-blue" />
                    </div>
                  </div>

                  {/* Grid de Métricas secundarias */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="neu-elevated p-4">
                      <p className="text-[9px] font-bold neu-text-sec uppercase tracking-wider">Consumo de Material (m²)</p>
                      <p className="text-base font-bold neu-text-main mt-0.5">{calcResultados?.metrosCuadrados?.toLocaleString()} m²</p>
                      <p className="text-[9px] neu-text-sec font-semibold mt-1">Banda: {calcResultados?.anchoBandaMm} mm</p>
                    </div>

                    <div className="neu-elevated p-4">
                      <p className="text-[9px] font-bold neu-text-sec uppercase tracking-wider">Longitud por Rollo (m)</p>
                      <p className="text-base font-bold neu-text-main mt-0.5">{calcResultados?.largoRollo?.toLocaleString()} m</p>
                      <p className="text-[9px] neu-text-sec font-semibold mt-1">{calcInputs.etiquetasPorRollo?.toLocaleString()} etiq/rollo</p>
                    </div>

                    <div className="neu-elevated p-4">
                      <p className="text-[9px] font-bold neu-text-sec uppercase tracking-wider">Cantidad de Rollos</p>
                      <p className="text-base font-bold neu-text-main mt-0.5">{calcResultados?.rollos} rollos</p>
                      <p className="text-[9px] neu-text-sec font-semibold mt-1">{selectedTroquel.cavidades_ancho} vías de salida</p>
                    </div>

                    <div className="neu-elevated p-4">
                      <p className="text-[9px] font-bold neu-text-sec uppercase tracking-wider">Ciclos de Giro de Cilindro</p>
                      <p className="text-base font-bold neu-text-main mt-0.5">{calcResultados?.girosBase?.toLocaleString()} giros</p>
                      <p className="text-[9px] neu-text-sec font-semibold mt-1">{selectedTroquel.cavidades_ancho * selectedTroquel.cavidades_avance} etiq/giro</p>
                    </div>
                  </div>

                  {/* Info alert */}
                  <div className="neu-concave p-4 text-[10px] neu-text-sec leading-relaxed flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 neu-text-blue shrink-0 mt-0.5" />
                    <div>
                      Nota de control de producción: Para cumplir con el volumen neto solicitado de {Number(calcInputs.cantidadEtiquetas).toLocaleString()} etiquetas distribuidas en {calcResultados?.rollos} rollos de {Number(calcInputs.etiquetasPorRollo).toLocaleString()} unidades, se requiere procesar un total de <span className="font-semibold neu-text-main">{calcResultados?.etiquetasTotalesConMerma?.toLocaleString()} etiquetas</span>, compensando las mermas técnicas de montaje y operación especificadas.
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-5 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTroquel(null)}
                  className="px-5 py-3 text-xs font-bold neu-text-sec hover:neu-text-main transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                
                <button
                  type="button"
                  onClick={handleCopiarResumen}
                  className="flex items-center justify-center gap-2 px-6 py-3 neu-btn-primary font-bold transition-all cursor-pointer text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
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
