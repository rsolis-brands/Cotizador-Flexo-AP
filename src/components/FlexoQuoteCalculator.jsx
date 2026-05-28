import { useState, useMemo, useEffect } from 'react';
import { Calculator, Sparkles, Sliders, Ruler, AlertCircle, Copy, Check, ChevronLeft, Layers, Paintbrush, Plus, Trash2 } from 'lucide-react';
import { inventarioCilindros } from '../logic/cilindros';

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

const ACABADOS_OPTIONS = [
  'Barniz acuoso mate',
  'Barniz acuoso brillante',
  'Barniz UV mate',
  'Barniz UV brillante',
  'Barniz imprimible',
  'Laminado mate',
  'Laminado brillante'
];

const EFECTOS_OPTIONS = [
  'Barniz UV reservado brillante',
  'Foil Hot Stamping',
  'Foil Cold'
];

export default function FlexoQuoteCalculator({ selectedTroquel, setSelectedTroquel, setActiveTab }) {
  // Lógica interna de roles (ocultar costos de fábrica a nivel de código)
  const showInternalCosts = true;

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

  // Material selection states (Instant matching)
  const [tempFamily, setTempFamily] = useState('Papel semibrillante');
  const [tempAdhesive, setTempAdhesive] = useState('hotmelt');
  const [savedMaterial, setSavedMaterial] = useState({
    familia: 'Papel semibrillante',
    adhesivo: 'hotmelt',
    costo_mt2: 0.337
  });

  // Presentation states
  const [tipoEntrega, setTipoEntrega] = useState('Rollo');
  const [unidadesPorRollo, setUnidadesPorRollo] = useState(1000);
  const [filasPorRollo, setFilasPorRollo] = useState(1);
  const [diametroCentro, setDiametroCentro] = useState('3"');

  // Wastes state
  const [mermaArranque, setMermaArranque] = useState(50);
  const [mermaOperacion, setMermaOperacion] = useState(2);

  // Inks & Colors states (Defaults to Sin Impresión / 0 Colors)
  const [tipoTinta, setTipoTinta] = useState('Sin impresión');
  const [coloresCount, setColoresCount] = useState(0);

  // Grouped Finishes & Effects (Both start at "Ninguno")
  const [acabadosSeleccionados, setAcabadosSeleccionados] = useState(['Ninguno']);
  const [efectosSeleccionados, setEfectosSeleccionados] = useState(['Ninguno']);

  // Dynamic Quantities scales (starts with only 5,000)
  const [quantities, setQuantities] = useState([5000]);
  const [bulkInput, setBulkInput] = useState('');

  // Auto-preset suggestions when ink type changes
  const handleTipoTintaChange = (value) => {
    setTipoTinta(value);
    if (value === 'Sin impresión') setColoresCount(0);
    else if (value === 'Pantone directo') setColoresCount(1);
    else if (value === 'CMYK') setColoresCount(4);
    else if (value === 'Combinado (CMYK + Pantone)') setColoresCount(6);
  };

  // Warehouse cylinder check (roller inventory)
  const rodillosDisponibles = useMemo(() => {
    if (!selectedTroquel || !selectedTroquel.cilindro) return 0;
    return inventarioCilindros.reduce((acc, c) => {
      if (Number(c.cilindro) === Number(selectedTroquel.cilindro)) {
        return acc + c.cantidad;
      }
      return acc;
    }, 0);
  }, [selectedTroquel]);

  // Reactive material matching
  useEffect(() => {
    const matched = MATERIAL_DATABASE.find(
      m => m.familia === tempFamily && m.adhesivo.toLowerCase() === tempAdhesive.toLowerCase()
    );
    if (matched) {
      setSavedMaterial(matched);
    }
  }, [tempFamily, tempAdhesive]);

  // Available adhesives for selected family
  const availableAdhesives = useMemo(() => {
    return [...new Set(
      MATERIAL_DATABASE
        .filter(m => m.familia === tempFamily)
        .map(m => m.adhesivo)
    )];
  }, [tempFamily]);

  // Presentation delivery toggle behaviour helper
  const isRollo = tipoEntrega === 'Rollo';

  // Toggle helpers for Finishes (Acabados)
  const handleAcabadoToggle = (option) => {
    if (option === 'Ninguno') {
      setAcabadosSeleccionados(['Ninguno']);
    } else {
      let updated = acabadosSeleccionados.filter(x => x !== 'Ninguno');
      if (updated.includes(option)) {
        updated = updated.filter(x => x !== option);
        if (updated.length === 0) {
          updated = ['Ninguno'];
        }
      } else {
        updated.push(option);
      }
      setAcabadosSeleccionados(updated);
    }
  };

  // Toggle helpers for Effects (Efectos)
  const handleEfectoToggle = (option) => {
    if (option === 'Ninguno') {
      setEfectosSeleccionados(['Ninguno']);
    } else {
      let updated = efectosSeleccionados.filter(x => x !== 'Ninguno');
      if (updated.includes(option)) {
        updated = updated.filter(x => x !== option);
        if (updated.length === 0) {
          updated = ['Ninguno'];
        }
      } else {
        updated.push(option);
      }
      setEfectosSeleccionados(updated);
    }
  };

  // Scales Bulk aggregate handler
  const handleCreateBulkQuantities = () => {
    if (!bulkInput.trim()) return;
    const parts = bulkInput.split(',');
    const newQtys = [...quantities];
    
    parts.forEach(part => {
      const cleanPart = part.trim();
      const numVal = Number(cleanPart);
      if (!isNaN(numVal) && numVal > 0) {
        // If value is less than 1000, treat as thousands (e.g. 5 -> 5000)
        const actualVal = numVal < 1000 ? numVal * 1000 : numVal;
        if (!newQtys.includes(actualVal) && newQtys.length < 10) {
          newQtys.push(actualVal);
        }
      }
    });
    
    // Sort ascending for a neat comparative display
    newQtys.sort((a, b) => a - b);
    setQuantities(newQtys);
    setBulkInput('');
  };

  const handleAddQuantityManual = () => {
    if (quantities.length >= 10) return;
    const lastQty = quantities[quantities.length - 1] || 0;
    const nextQty = lastQty ? lastQty + 5000 : 5000;
    setQuantities([...quantities, nextQty]);
  };

  const handleRemoveQuantity = (index) => {
    if (quantities.length <= 1) return;
    setQuantities(quantities.filter((_, i) => i !== index));
  };

  const handleQuantityValueChange = (index, value) => {
    const updated = [...quantities];
    updated[index] = Number(value) || 0;
    setQuantities(updated);
  };

  // Calculations for all scales
  const calculatedResults = useMemo(() => {
    const C_a = Number(selectedTroquel.cavidades_ancho) || 1;
    const C_v = Number(selectedTroquel.cavidades_avance) || 1;
    const repeatMm = Number(selectedTroquel.repeat_mm) || 0;
    const anchoB = Number(selectedTroquel.ancho_banda) || 0; // Banda fija
    const N = Number(unidadesPorRollo) || 1;
    const mermaArr = Number(mermaArranque) || 0;
    const mermaOp = Number(mermaOperacion) || 0;
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
  }, [selectedTroquel, unidadesPorRollo, mermaArranque, mermaOperacion, savedMaterial, quantities]);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyQuantitySummary = (index) => {
    const res = calculatedResults[index];
    if (!res) return;

    const acabadosStr = acabadosSeleccionados.join(', ');
    const efectosStr = efectosSeleccionados.join(', ');

    const presentationDetails = isRollo ? `
- Tipo de Entrega: Rollo
- Unidades por Rollo: ${unidadesPorRollo.toLocaleString()}
- Filas por Rollo: ${filasPorRollo}
- Diámetro del Centro: ${diametroCentro}` : `
- Tipo de Entrega: ${tipoEntrega} (Rollos inhabilitados)`;

    const costDetails = showInternalCosts ? `
Costo m²: $${savedMaterial.costo_mt2.toFixed(3)}
COSTO MATERIAL TOTAL: $${res.costoMaterial.toLocaleString()} USD
Costo Unit. Insumo: $${res.quantity > 0 ? (res.costoMaterial / res.quantity).toFixed(5) : '0.00'} USD` : '';

    const texto = `--- RESUMEN DE COTIZACIÓN (${res.quantity.toLocaleString()} uds) ---
Troquel Código: ${selectedTroquel.codigo_troquel}
Medidas: ${selectedTroquel.ancho_mm} x ${selectedTroquel.largo_mm} mm
Material: ${savedMaterial.familia} (${savedMaterial.adhesivo})
Ancho de Banda: ${selectedTroquel.ancho_banda || 0} in
${costDetails}

PRESENTACIÓN: ${presentationDetails}
Precorte Cavidades: ${selectedTroquel.precorte_entre_cavidades || 'NO'}
Precorte Integrado: ${selectedTroquel.precorte_integrado || 'NO'}

PARÁMETROS DE MERMA:
- Merma Montaje: ${mermaArranque} m
- Merma Operación: ${mermaOperacion} %

TINTAS Y COLORES:
- Especificación: ${tipoTinta}
- Cantidad de Colores: ${coloresCount}
- Rodillos Disponibles: ${rodillosDisponibles} (en cilindro ${selectedTroquel.cilindro || 'N/A'})

ACABADOS Y EFECTOS:
- Acabados: ${acabadosStr}
- Efectos: ${efectosStr}

RESULTADOS VOLUMÉTRICOS:
- Metros Netos: ${res.metrosNetos.toLocaleString()} m
- Metros de Merma: ${res.metrosMerma.toLocaleString()} m
- METROS TOTALES: ${res.metrosTotales.toLocaleString()} m
- Área Material: ${res.metrosCuadrados.toLocaleString()} m²
- Cantidad de Rollos: ${res.rollos} rollos (solo aplica si entrega es Rollo)
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

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column Left: Input Flow (Linear, Direct, Modular, Decoupled) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1) Ficha Técnica del Troquel */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Sparkles className="w-3.5 h-3.5 neu-text-blue" /> 1) Ficha Técnica del Troquel
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Código</span>
                <span className="font-extrabold neu-text-main">{selectedTroquel.codigo_troquel}</span>
              </div>
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Dimensiones</span>
                <span className="font-extrabold neu-text-main">{selectedTroquel.ancho_mm} x {selectedTroquel.largo_mm} mm</span>
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
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Repeat Avance</span>
                <span className="font-bold neu-text-main">{selectedTroquel.repeat_mm} mm</span>
              </div>
              {/* Ancho de Banda - Consistent grid cell style */}
              <div className="neu-concave p-2.5">
                <span className="block text-[8px] font-bold uppercase neu-text-sec">Ancho Banda</span>
                <span className="font-extrabold neu-text-main">{selectedTroquel.ancho_banda || 0} in</span>
              </div>
            </div>
          </div>

          {/* 2) Módulo: Presentación */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Sliders className="w-3.5 h-3.5 neu-text-blue" /> 2) Presentación
            </h3>

            <div className="space-y-3">
              {/* Tipo de entrega */}
              <div className="space-y-1">
                <label className="block text-xs font-bold neu-text-main">Tipo de entrega</label>
                <select
                  value={tipoEntrega}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                  className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  <option value="Rollo">Rollo</option>
                  <option value="Folded">Folded</option>
                  <option value="En unidad">En unidad</option>
                </select>
              </div>

              {/* Unidades por rollo */}
              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isRollo ? 'neu-text-main' : 'text-slate-400'}`}>Unidades por rollo</label>
                <input
                  type="number"
                  min="1"
                  disabled={!isRollo}
                  value={unidadesPorRollo}
                  onChange={(e) => setUnidadesPorRollo(Number(e.target.value) || 1)}
                  className={`w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-xs transition-all ${isRollo ? 'neu-text-main' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* Filas por rollo */}
              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isRollo ? 'neu-text-main' : 'text-slate-400'}`}>Filas por rollo</label>
                <input
                  type="number"
                  min="1"
                  disabled={!isRollo}
                  value={filasPorRollo}
                  onChange={(e) => setFilasPorRollo(Number(e.target.value) || 1)}
                  className={`w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-xs transition-all ${isRollo ? 'neu-text-main' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* Diámetro de centro */}
              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isRollo ? 'neu-text-main' : 'text-slate-400'}`}>Diámetro de centro</label>
                <select
                  value={diametroCentro}
                  disabled={!isRollo}
                  onChange={(e) => setDiametroCentro(e.target.value)}
                  className={`w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold appearance-none text-xs transition-all ${isRollo ? 'neu-text-main cursor-pointer' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  <option value='1"'>1"</option>
                  <option value='1.5"'>1.5"</option>
                  <option value='3"'>3"</option>
                </select>
              </div>

              {/* Información heredada (Solo lectura) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/50">
                <div className="neu-concave p-2 text-[10px]">
                  <span className="block text-[8px] font-bold uppercase text-slate-400 leading-none mb-1">Precorte entre cavidades</span>
                  <span className="font-extrabold neu-text-main">
                    {selectedTroquel.precorte_entre_cavidades === 'SI' ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="neu-concave p-2 text-[10px]">
                  <span className="block text-[8px] font-bold uppercase text-slate-400 leading-none mb-1">Precorte integrado</span>
                  <span className="font-extrabold neu-text-main">
                    {selectedTroquel.precorte_integrado === 'SI' ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3) Módulo: Merma */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Sliders className="w-3.5 h-3.5 neu-text-blue" /> 3) Parámetros de Merma de Producción
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold neu-text-main">Merma Montaje (m)</label>
                <input
                  type="number"
                  min="0"
                  value={mermaArranque}
                  onChange={(e) => setMermaArranque(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold neu-text-main">Merma Operación (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={mermaOperacion}
                  onChange={(e) => setMermaOperacion(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4) Selección de Material */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Ruler className="w-3.5 h-3.5 neu-text-blue" /> 4) Selección de Material
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold neu-text-main">Familia de Material</label>
                <select
                  value={tempFamily}
                  onChange={(e) => setTempFamily(e.target.value)}
                  className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs"
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
                  className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs uppercase"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  {availableAdhesives.map(adh => (
                    <option key={adh} value={adh}>{adh}</option>
                  ))}
                </select>
              </div>

              {savedMaterial && showInternalCosts && (
                <div className="neu-concave p-3 rounded-[12px] bg-blue-50/10 border border-blue-100/5 mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="neu-text-sec">Costo de Insumo base:</span>
                    <span className="font-extrabold neu-text-blue text-sm">${savedMaterial.costo_mt2.toFixed(3)} USD / m²</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5) Módulo: Tintas y Colores (Con Validación de Rodillos en Tiempo Real) */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Paintbrush className="w-3.5 h-3.5 neu-text-blue" /> 5) Tintas y Colores
            </h3>

            {/* Especificaciones de tinta */}
            <div className="space-y-1">
              <label className="block text-xs font-bold neu-text-main">Especificaciones de tinta</label>
              <select
                value={tipoTinta}
                onChange={(e) => handleTipoTintaChange(e.target.value)}
                className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
              >
                <option value="Sin impresión">Sin impresión</option>
                <option value="Pantone directo">Pantone directo</option>
                <option value="CMYK">CMYK</option>
                <option value="Combinado (CMYK + Pantone)">Combinado (CMYK + Pantone)</option>
              </select>
            </div>

            {/* Cantidad de Colores (Pills / Manual editable) */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold neu-text-main">
                Cantidad de Colores: <span className="neu-text-blue font-extrabold text-sm">{coloresCount}</span>
              </label>
              <div className="flex flex-wrap gap-1.5 neu-concave p-1.5 justify-between">
                {[...Array(11)].map((_, i) => {
                  const num = i; // 0 to 10
                  const isActive = coloresCount === num;
                  return (
                    <button
                      key={`col-btn-${num}`}
                      type="button"
                      onClick={() => setColoresCount(num)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all cursor-pointer ${isActive ? 'bg-[#005CB9] text-white scale-110 shadow-md' : 'neu-text-sec hover:neu-text-main hover:bg-slate-100'}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AUTOMATIC WAREHOUSE ROLLER VALIDATION */}
            {selectedTroquel.cilindro && (
              <div className="pt-2">
                {rodillosDisponibles >= coloresCount ? (
                  <div className="p-3 rounded-[12px] bg-green-50/20 border border-green-200/20 text-green-700 text-[10px] font-bold flex items-start gap-2 animate-in fade-in duration-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                    <span>
                      Rodillos disponibles suficientes para {coloresCount} colores ({rodillosDisponibles} rodillos en cilindro {selectedTroquel.cilindro})
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-[12px] bg-red-50/20 border border-red-200/20 text-red-700 text-[10px] font-bold flex items-start gap-2 animate-in fade-in duration-300">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>
                      Faltan {coloresCount - rodillosDisponibles} rodillos para imprimir {coloresCount} colores en cilindro {selectedTroquel.cilindro} (Disponibles: {rodillosDisponibles})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 6) Módulo: Acabados Especiales (Dividido en Acabados y Efectos) */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Sparkles className="w-3.5 h-3.5 neu-text-blue" /> 6) Acabados y Efectos
            </h3>

            {/* Grupo 1: Acabados */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase neu-text-sec">Grupo: Acabados</label>
              
              <div className="grid grid-cols-2 gap-1.5">
                {/* Ninguno Acabado */}
                <button
                  type="button"
                  onClick={() => handleAcabadoToggle('Ninguno')}
                  className={`py-2 px-2 text-[9px] font-bold rounded-[10px] transition-all text-center border-none cursor-pointer col-span-2 ${acabadosSeleccionados.includes('Ninguno') ? 'neu-concave text-[#005CB9] scale-[0.98]' : 'neu-elevated text-slate-500 hover:text-slate-800'}`}
                >
                  Ninguno (Acabados)
                </button>
                {ACABADOS_OPTIONS.map((a) => {
                  const active = acabadosSeleccionados.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAcabadoToggle(a)}
                      className={`py-2 px-2 text-[9px] font-bold rounded-[10px] transition-all text-center border-none cursor-pointer ${active ? 'neu-concave text-[#005CB9] scale-[0.98]' : 'neu-elevated text-slate-500 hover:text-slate-800'}`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grupo 2: Efectos */}
            <div className="space-y-2 pt-2 border-t border-slate-200/50">
              <label className="block text-[10px] font-bold uppercase neu-text-sec">Grupo: Efectos</label>
              
              <div className="grid grid-cols-2 gap-1.5">
                {/* Ninguno Efecto */}
                <button
                  type="button"
                  onClick={() => handleEfectoToggle('Ninguno')}
                  className={`py-2 px-2 text-[9px] font-bold rounded-[10px] transition-all text-center border-none cursor-pointer col-span-2 ${efectosSeleccionados.includes('Ninguno') ? 'neu-concave text-[#005CB9] scale-[0.98]' : 'neu-elevated text-slate-500 hover:text-slate-800'}`}
                >
                  Ninguno (Efectos)
                </button>
                {EFECTOS_OPTIONS.map((e) => {
                  const active = efectosSeleccionados.includes(e);
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleEfectoToggle(e)}
                      className={`py-2 px-2 text-[9px] font-bold rounded-[10px] transition-all text-center border-none cursor-pointer ${active ? 'neu-concave text-[#005CB9] scale-[0.98]' : 'neu-elevated text-slate-500 hover:text-slate-800'}`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 7) Escalas de Cantidad (Con Agregación Rápida Bulk) */}
          <div className="neu-elevated p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
              <Layers className="w-3.5 h-3.5 neu-text-blue" /> 7) Escalas de Cantidad ({quantities.length}/10)
            </h3>

            {/* Agregación Rápida Bulk */}
            <div className="space-y-1.5 p-3.5 neu-concave rounded-[16px]">
              <label className="block text-[9px] font-bold uppercase text-slate-500">Agregación Rápida Bulk</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Ej: 1, 5, 10, 15 (en miles)"
                  className="flex-1 px-3 py-2 neu-concave font-semibold text-xs neu-text-main outline-none focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleCreateBulkQuantities}
                  className="px-4 py-2 text-xs font-bold neu-btn-primary cursor-pointer hover:bg-slate-800"
                >
                  Crear
                </button>
              </div>
              <span className="block text-[8px] text-slate-400 leading-tight">
                Separa por comas. Valores &lt; 1000 se multiplican por 1,000 automáticamente.
              </span>
            </div>

            {/* Manual adding / grid inputs list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase text-slate-400">Edición de escalas</span>
                {quantities.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddQuantityManual}
                    className="px-2.5 py-1 text-[9px] font-bold neu-btn-primary flex items-center gap-1 cursor-pointer transition-all hover:bg-slate-800"
                  >
                    <Plus className="w-3 h-3" /> Añadir Manual
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {quantities.map((qty, idx) => (
                  <div key={`qty-scale-${idx}`} className="flex items-center gap-1">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={qty || ''}
                        onChange={(e) => handleQuantityValueChange(idx, e.target.value)}
                        placeholder="Ej: 5000"
                        className="w-full pl-6 pr-2 py-1.5 neu-concave font-bold text-xs neu-text-blue outline-none focus:ring-1 focus:ring-blue-500/20 text-center"
                      />
                    </div>
                    {quantities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuantity(idx)}
                        className="p-1.5 neu-concave hover:neu-text-red cursor-pointer transition-colors"
                        title="Eliminar escala"
                      >
                        <Trash2 className="w-3 h-3 text-slate-500 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Column Right: Responsive Comparative Results */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex items-center justify-between pl-2 border-l-4 border-blue-500">
            <h3 className="text-xs font-bold uppercase tracking-wider neu-text-main">
              Comparativa de Rendimiento y Costos por Volumen
            </h3>
            <span className="text-[9px] font-bold neu-text-sec px-2 py-0.5 neu-concave">
              Recálculo Instantáneo
            </span>
          </div>

          {/* DESKTOP VIEW: Side-by-Side Comparison Table */}
          <div className="hidden md:block overflow-x-auto neu-elevated p-4">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200/50 text-[9px] font-bold uppercase neu-text-sec">
                  <th className="py-3 px-3">Escala (Etiquetas)</th>
                  <th className="py-3 px-3">Metros Totales</th>
                  <th className="py-3 px-3">Rollos</th>
                  <th className="py-3 px-3">Desglose (Neto + Merma)</th>
                  <th className="py-3 px-3">Área (m²)</th>
                  {showInternalCosts && <th className="py-3 px-3 text-right">Costo Total (USD)</th>}
                  {showInternalCosts && <th className="py-3 px-3 text-right">Costo Unit. (USD)</th>}
                  <th className="py-3 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {calculatedResults.map((res, idx) => (
                  <tr key={`res-row-${idx}`} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold neu-text-main">
                      {res.quantity.toLocaleString()} <span className="text-[9px] font-medium text-slate-400">uds</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">
                      {res.metrosTotales.toLocaleString()} m
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">
                      {isRollo ? `${res.rollos} rollos` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[10px]">
                      {res.metrosNetos}m + {res.metrosMerma}m
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {res.metrosCuadrados.toLocaleString()} m²
                    </td>
                    {showInternalCosts && (
                      <td className="py-3.5 px-3 text-right font-extrabold neu-text-blue">
                        ${res.costoMaterial.toLocaleString()}
                      </td>
                    )}
                    {showInternalCosts && (
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-800">
                        {res.quantity > 0 ? `$${(res.costoMaterial / res.quantity).toFixed(5)}` : '$0.00'}
                      </td>
                    )}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        disabled={res.quantity <= 0}
                        onClick={() => handleCopyQuantitySummary(idx)}
                        className="p-1.5 neu-concave hover:neu-text-blue transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mx-auto flex items-center justify-center"
                        title="Copiar datos técnicos de esta cantidad"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 neu-text-sec" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW: Stacked Elegant Cards */}
          <div className="block md:hidden space-y-4">
            {calculatedResults.map((res, idx) => (
              <div 
                key={`result-card-mobile-${idx}`} 
                className="neu-elevated p-5 space-y-4 hover:-translate-y-0.5 transition-transform duration-300 relative overflow-hidden"
              >
                {/* Hero Quantity Badge */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase neu-text-sec">Escala #{idx + 1}</span>
                    <p className="text-base font-extrabold neu-text-main">
                      {res.quantity.toLocaleString()} <span className="text-[10px] font-medium neu-text-sec">etiquetas</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={res.quantity <= 0}
                    onClick={() => handleCopyQuantitySummary(idx)}
                    className="p-2 neu-concave hover:neu-text-blue transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copiar datos técnicos de esta cantidad"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 neu-text-sec" />
                    )}
                  </button>
                </div>

                {/* Technical data desglosado */}
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
                    <span className="block text-[8px] font-bold uppercase neu-text-sec">Entrega</span>
                    <span className="font-extrabold neu-text-main">
                      {isRollo ? `${res.rollos} rollos` : tipoEntrega}
                    </span>
                  </div>

                  <div className="neu-concave p-2">
                    <span className="block text-[8px] font-bold uppercase neu-text-sec">Neto + Merma</span>
                    <span className="font-semibold neu-text-sec">{res.metrosNetos}m + {res.metrosMerma}m</span>
                  </div>
                </div>

                {/* Price banner for mobile */}
                {showInternalCosts && (
                  <div className="neu-concave p-3 rounded-[12px] bg-blue-50/10 flex justify-between items-center mt-2">
                    <div>
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Costo Total Material</span>
                      <span className="text-xs font-black neu-text-blue">${res.costoMaterial.toLocaleString()} USD</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Costo Unitario</span>
                      <span className="text-[10px] font-extrabold neu-text-main">
                        {res.quantity > 0 ? `$${(res.costoMaterial / res.quantity).toFixed(5)}` : '$0.00'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Calculation Formula Alert */}
          <div className="neu-concave p-4 text-[10px] neu-text-sec leading-relaxed flex items-start gap-3 mt-4">
            <AlertCircle className="w-4 h-4 neu-text-blue shrink-0 mt-0.5" />
            <div>
              El cálculo de consumo se basa en la fórmula técnica oficial de flexografía: 
              <span className="font-semibold neu-text-main"> Metros Lineales Totales × Ancho de Banda ({selectedTroquel.ancho_banda || 0} in converted to meters) × Costo/m²</span> del adhesivo seleccionado. 
              El cálculo incluye las mermas de montaje fijas más la merma de operación porcentual.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
