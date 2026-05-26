import { useState, useMemo, useEffect } from 'react';
import { Calculator, Sparkles, Sliders, Ruler, AlertCircle, Copy, Check, ChevronLeft, Save } from 'lucide-react';

const MATERIAL_DATABASE = [
  { familia: 'Transferencia térmica', adhesivo: 'hotmelt', costo_mt2: 0.382 },
  { familia: 'Papel semibrillante', adhesivo: 'hotmelt', costo_mt2: 0.337 },
  { familia: 'BOPP Blanco', adhesivo: 'hotmelt', costo_mt2: 0.353 },
  { familia: 'BOPP Transparente', adhesivo: 'hotmelt', costo_mt2: 0.482 },
  { familia: 'Termico Directo Eco', adhesivo: 'hotmelt', costo_mt2: 0.790 },
  { familia: 'Papel semibrillante', adhesivo: 'Acrílico', costo_mt2: 0.337 },
  { familia: 'BOPP Blanco', adhesivo: 'Acrílico', costo_mt2: 0.353 },
  { familia: 'BOPP Transparente', adhesivo: 'Acrílico', costo_mt2: 0.482 },
  { familia: 'Termico Directo Eco', adhesivo: 'Acrílico', costo_mt2: 0.790 }
];

export default function FlexoQuoteCalculator({ selectedTroquel, setSelectedTroquel, setActiveTab }) {
  // If no troquel is selected, display a call to action
  if (!selectedTroquel) {
    return (
      <div className="max-w-3xl mx-auto my-12 text-center p-8 neu-elevated rounded-[24px]">
        <div className="neu-concave p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Calculator className="w-8 h-8 neu-text-blue" />
        </div>
        <h2 className="text-xl font-bold neu-text-main mb-2">No se ha seleccionado ningún troquel</h2>
        <p className="text-sm neu-text-sec mb-6 max-w-md mx-auto">
          Para realizar una cotización de etiquetas flexográficas, primero debes buscar o seleccionar un troquel de nuestro catálogo.
        </p>
        <button
          onClick={() => setActiveTab('cotizador')}
          className="neu-btn-primary font-bold px-6 py-3 transition-all cursor-pointer text-xs"
        >
          Ir al Buscador de Troqueles
        </button>
      </div>
    );
  }

  // Material select states
  const [tempFamily, setTempFamily] = useState('Papel semibrillante');
  const [tempAdhesive, setTempAdhesive] = useState('hotmelt');
  const [savedMaterial, setSavedMaterial] = useState({
    familia: 'Papel semibrillante',
    adhesivo: 'hotmelt',
    costo_mt2: 0.337
  });

  // Calculate parameters
  const [calcParams, setCalcParams] = useState({
    etiquetasPorRollo: 1000,
    mermaArranque: 50,
    mermaOperacion: 2,
    anchoBanda: selectedTroquel.ancho_banda || 0
  });

  // Update anchoBanda when selectedTroquel changes
  useEffect(() => {
    if (selectedTroquel) {
      setCalcParams(prev => ({
        ...prev,
        anchoBanda: selectedTroquel.ancho_banda || 0
      }));
    }
  }, [selectedTroquel]);

  // Available adhesives for selected family
  const availableAdhesives = useMemo(() => {
    const adhesives = MATERIAL_DATABASE
      .filter(m => m.familia === tempFamily)
      .map(m => m.adhesivo);
    return [...new Set(adhesives)];
  }, [tempFamily]);

  // Ensure adhesive selection is valid when family changes
  useEffect(() => {
    if (!availableAdhesives.includes(tempAdhesive) && availableAdhesives.length > 0) {
      setTempAdhesive(availableAdhesives[0]);
    }
  }, [availableAdhesives, tempAdhesive]);

  // Save selected material to lock in price
  const handleSaveMaterial = () => {
    const matched = MATERIAL_DATABASE.find(
      m => m.familia === tempFamily && m.adhesivo.toLowerCase() === tempAdhesive.toLowerCase()
    );
    if (matched) {
      setSavedMaterial(matched);
    }
  };

  // 6 Quantities
  const [quantities, setQuantities] = useState([5000, 10000, 25000, 50000, 100000, 200000]);

  const handleQuantityChange = (index, value) => {
    const updated = [...quantities];
    updated[index] = Number(value) || 0;
    setQuantities(updated);
  };

  // Calculations for all 6 quantities
  const calculatedResults = useMemo(() => {
    const C_a = Number(selectedTroquel.cavidades_ancho) || 1;
    const C_v = Number(selectedTroquel.cavidades_avance) || 1;
    const repeatMm = Number(selectedTroquel.repeat_mm) || 0;
    const anchoB = Number(calcParams.anchoBanda) || 0;
    const N = Number(calcParams.etiquetasPorRollo) || 1;
    const mermaArr = Number(calcParams.mermaArranque) || 0;
    const mermaOp = Number(calcParams.mermaOperacion) || 0;
    const costM2 = savedMaterial ? savedMaterial.costo_mt2 : 0;

    return quantities.map((Q) => {
      if (Q <= 0) {
        return {
          quantity: Q,
          girosBase: 0,
          metrosNetos: 0,
          metrosMerma: 0,
          metrosTotales: 0,
          metrosCuadrados: 0,
          largoRollo: 0,
          rollos: 0,
          etiquetasTotalesConMerma: 0,
          costoMaterial: 0
        };
      }

      const girosBase = Q / (C_a * C_v);
      const metrosNetos = (girosBase * repeatMm) / 1000;
      const metrosMerma = (metrosNetos * (mermaOp / 100)) + mermaArr;
      const metrosTotales = metrosNetos + metrosMerma;

      const anchoBandaM = (anchoB * 25.4) / 1000;
      const metrosCuadrados = metrosTotales * anchoBandaM;
      const costoMaterial = metrosCuadrados * costM2;

      const largoRollo = (N * repeatMm) / (C_v * 1000);
      const rollos = Q / N;

      const girosTotales = (metrosTotales * 1000) / repeatMm;
      const etiquetasTotalesConMerma = Math.round(girosTotales * C_a * C_v);

      return {
        quantity: Q,
        girosBase: Math.ceil(girosBase),
        metrosNetos: parseFloat(metrosNetos.toFixed(2)),
        metrosMerma: parseFloat(metrosMerma.toFixed(2)),
        metrosTotales: parseFloat(metrosTotales.toFixed(2)),
        metrosCuadrados: parseFloat(metrosCuadrados.toFixed(2)),
        largoRollo: parseFloat(largoRollo.toFixed(2)),
        rollos: parseFloat(rollos.toFixed(1)),
        etiquetasTotalesConMerma,
        costoMaterial: parseFloat(costoMaterial.toFixed(2))
      };
    });
  }, [selectedTroquel, calcParams, savedMaterial, quantities]);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyQuantitySummary = (index) => {
    const res = calculatedResults[index];
    if (!res) return;

    const texto = `--- RESUMEN DE COTIZACIÓN (${res.quantity.toLocaleString()} uds) ---
Troquel Código: ${selectedTroquel.codigo_troquel}
Medidas: ${selectedTroquel.ancho_mm} x ${selectedTroquel.largo_mm} mm
Material: ${savedMaterial.familia} (${savedMaterial.adhesivo})
Costo m²: $${savedMaterial.costo_mt2.toFixed(3)}

PARÁMETROS:
- Presentación: Rollos de ${calcParams.etiquetasPorRollo.toLocaleString()} uds
- Ancho de Banda: ${calcParams.anchoBanda} in
- Merma Montaje: ${calcParams.mermaArranque} m
- Merma Operación: ${calcParams.mermaOperacion} %

RESULTADOS:
- Metros Netos: ${res.metrosNetos.toLocaleString()} m
- Metros de Merma: ${res.metrosMerma.toLocaleString()} m
- METROS TOTALES: ${res.metrosTotales.toLocaleString()} m
- Área Material: ${res.metrosCuadrados.toLocaleString()} m²
- Cantidad de Rollos: ${res.rollos} rollos
- COSTO MATERIAL TOTAL: $${res.costoMaterial.toLocaleString()}
----------------------------------------`;

    navigator.clipboard.writeText(texto).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header / Back to search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => setActiveTab('cotizador')}
            className="flex items-center gap-1 text-xs font-bold neu-text-sec hover:neu-text-main mb-2 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Volver al Buscador
          </button>
          <h2 className="text-2xl font-extrabold tracking-tight neu-text-main">
            Cotizador de Etiquetas Flexográficas
          </h2>
          <p className="text-xs neu-text-sec mt-1">
            Gestión de costeo y volumetría de insumos para el troquel <span className="font-bold neu-text-blue">{selectedTroquel.codigo_troquel}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column Left: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ficha Técnica */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Sparkles className="w-3.5 h-3.5 neu-text-blue" /> Especificaciones del Troquel
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Código</span>
                <span className="font-bold neu-text-main">{selectedTroquel.codigo_troquel}</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Medidas</span>
                <span className="font-bold neu-text-main">{selectedTroquel.ancho_mm} x {selectedTroquel.largo_mm} mm</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Vías Ancho</span>
                <span className="font-bold neu-text-main">{selectedTroquel.cavidades_ancho} vías</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Rep. Avance</span>
                <span className="font-bold neu-text-main">{selectedTroquel.cavidades_avance} rep.</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Cilindro</span>
                <span className="font-bold neu-text-main">{selectedTroquel.cilindro || 'N/A'} dientes</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Repeat</span>
                <span className="font-bold neu-text-main">{selectedTroquel.repeat_mm} mm</span>
              </div>
            </div>
          </div>

          {/* Selección de Material */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Ruler className="w-3.5 h-3.5 neu-text-blue" /> 2) Selección de Material
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold neu-text-main">Familia de Material</label>
                <select
                  value={tempFamily}
                  onChange={(e) => setTempFamily(e.target.value)}
                  className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  {[...new Set(MATERIAL_DATABASE.map(m => m.familia))].map(family => (
                    <option key={family} value={family}>{family}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold neu-text-main">Tipo de Adhesivo</label>
                <select
                  value={tempAdhesive}
                  onChange={(e) => setTempAdhesive(e.target.value)}
                  className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs uppercase"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  {availableAdhesives.map(adh => (
                    <option key={adh} value={adh}>{adh}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveMaterial}
                className="w-full py-2.5 px-4 neu-btn-primary font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs mt-4"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Material Seleccionado</span>
              </button>
            </div>

            {/* Locked-in Material Info */}
            {savedMaterial && (
              <div className="neu-concave p-3 rounded-[12px] bg-blue-50/20 border border-blue-100/10 space-y-1.5 text-xs">
                <p className="font-bold neu-text-blue">Material Seleccionado</p>
                <div className="flex justify-between">
                  <span className="neu-text-sec">Familia:</span>
                  <span className="font-semibold neu-text-main">{savedMaterial.familia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="neu-text-sec">Adhesivo:</span>
                  <span className="font-semibold neu-text-main uppercase">{savedMaterial.adhesivo}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/50 pt-1.5 mt-1">
                  <span className="neu-text-sec font-bold">Costo por m²:</span>
                  <span className="font-extrabold neu-text-blue text-sm">${savedMaterial.costo_mt2.toFixed(3)} USD</span>
                </div>
              </div>
            )}
          </div>

          {/* Parámetros Generales */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Sliders className="w-3.5 h-3.5 neu-text-blue" /> Parámetros Técnicos
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold neu-text-main">Ancho Banda (in)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcParams.anchoBanda}
                    onChange={(e) => setCalcParams(prev => ({ ...prev, anchoBanda: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold neu-text-main">Etiq. por Rollo</label>
                  <input
                    type="number"
                    value={calcParams.etiquetasPorRollo}
                    onChange={(e) => setCalcParams(prev => ({ ...prev, etiquetasPorRollo: Number(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold neu-text-main">Merma Montaje (m)</label>
                  <input
                    type="number"
                    value={calcParams.mermaArranque}
                    onChange={(e) => setCalcParams(prev => ({ ...prev, mermaArranque: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold neu-text-main">Merma Op. (%)</label>
                  <input
                    type="number"
                    value={calcParams.mermaOperacion}
                    onChange={(e) => setCalcParams(prev => ({ ...prev, mermaOperacion: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Column Right: Quantities & Results */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Inputs de 6 Cantidades */}
          <div className="neu-elevated p-6 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Sliders className="w-3.5 h-3.5 neu-text-blue" /> 3) Simulación de Cantidades
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {quantities.map((qty, idx) => (
                <div key={`qty-input-${idx}`} className="space-y-1">
                  <label className="block text-[9px] font-bold neu-text-sec uppercase">Cantidad {idx + 1}</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                    className="w-full px-2 py-2 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-extrabold text-center neu-text-blue text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tabla/Grid de Resultados Comparativa */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 pl-2">
              Comparativa de Rendimiento y Costos por Volumen
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculatedResults.map((res, idx) => (
                <div key={`result-card-${idx}`} className="neu-elevated p-5 space-y-4 hover:-translate-y-0.5 transition-transform duration-300 relative overflow-hidden">
                  
                  {/* Hero Quantity Badge */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[9px] font-bold uppercase neu-text-sec">Volumen {idx + 1}</span>
                      <p className="text-base font-extrabold neu-text-main">
                        {res.quantity.toLocaleString()} <span className="text-[10px] font-medium neu-text-sec">etiquetas</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={res.quantity <= 0}
                      onClick={() => handleCopyQuantitySummary(idx)}
                      className="p-1.5 neu-concave hover:neu-text-blue transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Copiar datos técnicos de esta cantidad"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 neu-text-sec" />
                      )}
                    </button>
                  </div>

                  {/* Calculations Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="neu-concave p-2">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Metros Totales</span>
                      <span className="font-extrabold neu-text-main">{res.metrosTotales.toLocaleString()} m</span>
                    </div>

                    <div className="neu-concave p-2">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Consumo Material</span>
                      <span className="font-extrabold neu-text-main">{res.metrosCuadrados.toLocaleString()} m²</span>
                    </div>

                    <div className="neu-concave p-2">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Rollos de Salida</span>
                      <span className="font-extrabold neu-text-main">{res.rollos} rollos</span>
                    </div>

                    <div className="neu-concave p-2">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Neto + Merma</span>
                      <span className="font-semibold neu-text-sec">{res.metrosNetos}m + {res.metrosMerma}m</span>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="neu-concave p-3 rounded-[12px] bg-blue-50/10 flex justify-between items-center mt-2">
                    <div>
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Costo Total Material</span>
                      <span className="text-sm font-black neu-text-blue">${res.costoMaterial.toLocaleString()} USD</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Costo Unit. Insumo</span>
                      <span className="text-[10px] font-extrabold neu-text-main">
                        {res.quantity > 0 ? `$${(res.costoMaterial / res.quantity).toFixed(5)}` : '$0.00'}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Info alert */}
            <div className="neu-concave p-4 text-[10px] neu-text-sec leading-relaxed flex items-start gap-3 mt-4">
              <AlertCircle className="w-4 h-4 neu-text-blue shrink-0 mt-0.5" />
              <div>
                El cálculo del costo de material se basa estrictamente en la fórmula: 
                <span className="font-semibold neu-text-main"> Metros Lineales Totales (incluyendo mermas) × Ancho de Banda (m) × Costo/m²</span> del adhesivo seleccionado.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
