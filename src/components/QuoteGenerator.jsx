import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, FileText, Printer, User, Tag, Sparkles, Sliders, Layers, Paintbrush, Settings, CheckCircle } from 'lucide-react';

// Temporary client mock data (ready to be replaced by real table)
const MOCK_CLIENTS = [
  { id: 'cliente_a', nombre: 'Cliente A', categoria: 'A' },
  { id: 'cliente_b', nombre: 'Cliente B', categoria: 'AA' },
  { id: 'cliente_c', nombre: 'Cliente C', categoria: 'AAA' },
];

// Margin levels for commercial pricing
const MARGIN_OPTIONS = [
  { key: 'precio1', label: 'Precio 1', margin: 0.50, pct: '50%' },
  { key: 'precio2', label: 'Precio 2', margin: 0.55, pct: '55%' },
  { key: 'precio3', label: 'Precio 3', margin: 0.60, pct: '60%' },
  { key: 'precio4', label: 'Precio 4', margin: 0.65, pct: '65%' },
];

export default function QuoteGenerator({ quoteData, setActiveTab }) {

  // Guard: no data
  if (!quoteData) {
    return (
      <div className="max-w-3xl mx-auto my-12 text-center p-8 neu-elevated rounded-[24px]">
        <div className="neu-concave p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <FileText className="w-8 h-8 neu-text-blue" />
        </div>
        <h2 className="text-xl font-bold neu-text-main mb-2">No hay datos de cotización</h2>
        <p className="text-sm neu-text-sec mb-6 max-w-md mx-auto">
          Para generar una cotización comercial, primero debes completar el cálculo de insumos en el cotizador flexo.
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

  const {
    selectedTroquel,
    savedMaterial,
    tipoEntrega,
    unidadesPorRollo,
    filasPorRollo,
    diametroCentro,
    mermaArranque,
    mermaOperacion,
    tipoTinta,
    coloresCount,
    acabadosSeleccionados,
    efectosSeleccionados,
    quantities,
    calculatedResults
  } = quoteData;

  // Client selection state
  const [selectedClientId, setSelectedClientId] = useState('');
  const selectedClient = MOCK_CLIENTS.find(c => c.id === selectedClientId) || null;

  // Pricing mode: 'global' | 'per_scale'
  const [pricingMode, setPricingMode] = useState('global');
  const [globalPriceKey, setGlobalPriceKey] = useState('precio1');
  const [perScalePriceKeys, setPerScalePriceKeys] = useState(
    () => calculatedResults.map(() => 'precio1')
  );

  // Print ref
  const printRef = useRef(null);

  const isRollo = tipoEntrega === 'Rollo';

  // Calculate prices for each scale and margin
  const pricingTable = useMemo(() => {
    return calculatedResults.map((res) => {
      const costoTotal = res.costoMaterial;
      const prices = {};
      MARGIN_OPTIONS.forEach(opt => {
        // Commercial margin formula: price = cost / (1 - margin)
        prices[opt.key] = costoTotal / (1 - opt.margin);
      });
      return {
        quantity: res.quantity,
        costoTotal,
        prices
      };
    });
  }, [calculatedResults]);

  // Get the selected price for a given scale index
  const getSelectedPriceKey = (idx) => {
    if (pricingMode === 'global') return globalPriceKey;
    return perScalePriceKeys[idx] || 'precio1';
  };

  const handlePerScaleChange = (idx, key) => {
    const updated = [...perScalePriceKeys];
    updated[idx] = key;
    setPerScalePriceKeys(updated);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Generate today's date formatted
  const today = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* ====== SCREEN VIEW (hidden on print) ====== */}
      <div className="space-y-8 animate-in fade-in duration-300 print-none">

        {/* Header / Back to calculator */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => setActiveTab('cotizador_flexo')}
              className="flex items-center gap-1 text-xs font-bold neu-text-sec hover:neu-text-main mb-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Volver al Cálculo de Insumos
            </button>
            <h2 className="text-2xl font-extrabold tracking-tight neu-text-main">
              Generar Cotización Comercial
            </h2>
            <p className="text-xs neu-text-sec mt-1">
              Resumen comercial para el troquel <span className="font-bold neu-text-blue">{selectedTroquel.codigo_troquel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-bold neu-btn-primary transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-[#005CB9] hover:bg-[#004a99]"
          >
            <Printer className="w-4 h-4" />
            Imprimir Cotización
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Column Left: Technical Summary + Client */}
          <div className="lg:col-span-5 space-y-6">

            {/* 1) Resumen Técnico - Troquel */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <Sparkles className="w-3.5 h-3.5 neu-text-blue" /> Troquel Seleccionado
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
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Geometría</span>
                  <span className="font-bold neu-text-main">{selectedTroquel.forma || 'N/A'}</span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Esquinas</span>
                  <span className="font-bold neu-text-main">{selectedTroquel.esquinas || 'N/A'}</span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Cilindro</span>
                  <span className="font-bold neu-text-main">{selectedTroquel.cilindro || 'N/A'} dientes</span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Ancho Banda</span>
                  <span className="font-extrabold neu-text-main">{selectedTroquel.ancho_banda || 0} in</span>
                </div>
              </div>
            </div>

            {/* 2) Resumen: Presentación */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <Sliders className="w-3.5 h-3.5 neu-text-blue" /> Presentación
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Tipo Entrega</span>
                  <span className="font-extrabold neu-text-main">{tipoEntrega}</span>
                </div>
                {isRollo && (
                  <>
                    <div className="neu-concave p-2.5">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Uds / Rollo</span>
                      <span className="font-bold neu-text-main">{unidadesPorRollo.toLocaleString()}</span>
                    </div>
                    <div className="neu-concave p-2.5">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Filas / Rollo</span>
                      <span className="font-bold neu-text-main">{filasPorRollo}</span>
                    </div>
                    <div className="neu-concave p-2.5">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Diámetro Centro</span>
                      <span className="font-bold neu-text-main">{diametroCentro}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 3) Resumen: Producción */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <Paintbrush className="w-3.5 h-3.5 neu-text-blue" /> Producción
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Especificación Tinta</span>
                  <span className="font-bold neu-text-main">{tipoTinta}</span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Colores</span>
                  <span className="font-extrabold neu-text-blue text-sm">{coloresCount}</span>
                </div>
                <div className="neu-concave p-2.5 col-span-2">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Acabados</span>
                  <span className="font-bold neu-text-main">{acabadosSeleccionados.join(', ')}</span>
                </div>
                <div className="neu-concave p-2.5 col-span-2">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Efectos</span>
                  <span className="font-bold neu-text-main">{efectosSeleccionados.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* 4) Observaciones de producción */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <Settings className="w-3.5 h-3.5 neu-text-blue" /> Observaciones de Producción
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Precorte Cavidades</span>
                  <span className="font-extrabold neu-text-main">
                    {selectedTroquel.precorte_entre_cavidades === 'SI' ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Precorte Integrado</span>
                  <span className="font-extrabold neu-text-main">
                    {selectedTroquel.precorte_integrado === 'SI' ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Material</span>
                  <span className="font-bold neu-text-main">{savedMaterial.familia}</span>
                </div>
                <div className="neu-concave p-2.5">
                  <span className="block text-[8px] font-bold uppercase neu-text-sec">Adhesivo</span>
                  <span className="font-bold neu-text-main capitalize">{savedMaterial.adhesivo}</span>
                </div>
              </div>
            </div>

            {/* 5) Selección de Cliente */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <User className="w-3.5 h-3.5 neu-text-blue" /> Cliente
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold neu-text-main">Seleccionar Cliente</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-xs"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                  >
                    <option value="">— Seleccionar —</option>
                    {MOCK_CLIENTS.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {selectedClient && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="neu-concave p-2.5 text-xs">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Cliente</span>
                      <span className="font-extrabold neu-text-main">{selectedClient.nombre}</span>
                    </div>
                    <div className="neu-concave p-2.5 text-xs">
                      <span className="block text-[8px] font-bold uppercase neu-text-sec">Categoría</span>
                      <span className="font-extrabold neu-text-blue text-sm">{selectedClient.categoria}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Escalas heredadas (resumen de cantidades) */}
            <div className="neu-elevated p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                <Layers className="w-3.5 h-3.5 neu-text-blue" /> Escalas de Cantidad ({quantities.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {quantities.map((q, idx) => (
                  <span key={`scale-badge-${idx}`} className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 neu-concave neu-text-blue">
                    #{idx + 1}: {q.toLocaleString()} uds
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Column Right: Pricing Table */}
          <div className="lg:col-span-7 space-y-6">

            {/* Pricing Mode Selector */}
            <div className="neu-elevated p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider neu-text-sec flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 neu-text-blue" /> Modo de Selección de Precio
                </h3>
              </div>
              <div className="flex neu-concave p-1.5 rounded-[18px]">
                {[
                  { key: 'global', label: 'Global (una opción para todas)' },
                  { key: 'per_scale', label: 'Por Escala (individual)' }
                ].map(mode => (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => setPricingMode(mode.key)}
                    className={`flex-1 py-2 px-3 text-[10px] font-bold rounded-[14px] transition-all duration-300 cursor-pointer text-center ${
                      pricingMode === mode.key
                        ? 'neu-elevated neu-text-blue scale-100'
                        : 'neu-text-sec hover:neu-text-main scale-95'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {pricingMode === 'global' && (
                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase neu-text-sec mb-2">Seleccionar precio global</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MARGIN_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setGlobalPriceKey(opt.key)}
                        className={`py-2.5 px-2 text-[10px] font-bold rounded-[12px] transition-all text-center cursor-pointer ${
                          globalPriceKey === opt.key
                            ? 'neu-concave text-[#005CB9] scale-[0.98]'
                            : 'neu-elevated text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span className="block text-[8px] font-bold uppercase text-slate-400">{opt.pct} utilidad</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Comparison Table (Desktop) */}
            <div className="hidden md:block overflow-x-auto neu-elevated p-4">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200/50 text-[9px] font-bold uppercase neu-text-sec">
                    <th className="py-3 px-3">Escala</th>
                    {MARGIN_OPTIONS.map(opt => (
                      <th key={opt.key} className="py-3 px-3 text-right">
                        {opt.label}
                        <span className="block text-[7px] font-medium normal-case text-slate-400">{opt.pct} utilidad</span>
                      </th>
                    ))}
                    {pricingMode === 'per_scale' && (
                      <th className="py-3 px-3 text-center">Selección</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pricingTable.map((row, idx) => {
                    const activeKey = getSelectedPriceKey(idx);
                    return (
                      <tr key={`price-row-${idx}`} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-extrabold neu-text-main">
                          {row.quantity.toLocaleString()} <span className="text-[9px] font-medium text-slate-400">uds</span>
                        </td>
                        {MARGIN_OPTIONS.map(opt => {
                          const isSelected = activeKey === opt.key;
                          return (
                            <td key={opt.key} className={`py-3.5 px-3 text-right font-extrabold transition-colors ${isSelected ? 'neu-text-blue bg-blue-50/30' : 'text-slate-600'}`}>
                              ${row.prices[opt.key].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              {isSelected && (
                                <CheckCircle className="w-3 h-3 text-[#005CB9] inline-block ml-1" />
                              )}
                            </td>
                          );
                        })}
                        {pricingMode === 'per_scale' && (
                          <td className="py-3.5 px-3 text-center">
                            <select
                              value={perScalePriceKeys[idx]}
                              onChange={(e) => handlePerScaleChange(idx, e.target.value)}
                              className="px-2 py-1.5 neu-concave text-[10px] font-bold neu-text-main outline-none focus:ring-1 focus:ring-blue-500/20 appearance-none cursor-pointer"
                              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em' }}
                            >
                              {MARGIN_OPTIONS.map(opt => (
                                <option key={opt.key} value={opt.key}>{opt.label} ({opt.pct})</option>
                              ))}
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pricing Cards (Mobile) */}
            <div className="block md:hidden space-y-4">
              {pricingTable.map((row, idx) => {
                const activeKey = getSelectedPriceKey(idx);
                return (
                  <div key={`price-card-mobile-${idx}`} className="neu-elevated p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase neu-text-sec">Escala #{idx + 1}</span>
                        <p className="text-base font-extrabold neu-text-main">
                          {row.quantity.toLocaleString()} <span className="text-[10px] font-medium neu-text-sec">uds</span>
                        </p>
                      </div>
                      {pricingMode === 'per_scale' && (
                        <select
                          value={perScalePriceKeys[idx]}
                          onChange={(e) => handlePerScaleChange(idx, e.target.value)}
                          className="px-2 py-1.5 neu-concave text-[10px] font-bold neu-text-main outline-none focus:ring-1 focus:ring-blue-500/20 appearance-none cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em' }}
                        >
                          {MARGIN_OPTIONS.map(opt => (
                            <option key={opt.key} value={opt.key}>{opt.label} ({opt.pct})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {MARGIN_OPTIONS.map(opt => {
                        const isSelected = activeKey === opt.key;
                        return (
                          <div key={opt.key} className={`neu-concave p-2.5 transition-colors ${isSelected ? 'bg-blue-50/30 ring-1 ring-blue-200/30' : ''}`}>
                            <span className="block text-[8px] font-bold uppercase neu-text-sec">{opt.label} ({opt.pct})</span>
                            <span className={`font-extrabold ${isSelected ? 'neu-text-blue' : 'neu-text-main'}`}>
                              ${row.prices[opt.key].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Print CTA */}
            <div className="neu-elevated p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="neu-concave p-3 shrink-0">
                  <Printer className="w-6 h-6 neu-text-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold neu-text-main">Cotización lista</h3>
                  <p className="text-[10px] neu-text-sec mt-0.5">
                    Revisa el resumen y los precios seleccionados antes de imprimir.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="shrink-0 flex items-center gap-2 px-6 py-3 text-sm font-bold neu-btn-primary transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-[#005CB9] hover:bg-[#004a99]"
              >
                <Printer className="w-4 h-4" />
                Imprimir Cotización
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ====== PRINT VIEW (only visible when printing) ====== */}
      <div className="print-only" ref={printRef}>
        <div style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#1D1D1F', padding: '0', maxWidth: '100%' }}>

          {/* Print Header */}
          <div style={{ borderBottom: '2px solid #005CB9', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#1D1D1F' }}>Cotización</h1>
              <p style={{ fontSize: '10px', color: '#6E6E73', marginTop: '4px', fontWeight: 600 }}>Cotizador Técnico – Flexo RS</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', color: '#6E6E73', fontWeight: 600 }}>Fecha: {today}</p>
              {selectedClient && (
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1D1D1F', marginTop: '2px' }}>
                  Cliente: {selectedClient.nombre} <span style={{ fontSize: '10px', color: '#005CB9' }}>({selectedClient.categoria})</span>
                </p>
              )}
            </div>
          </div>

          {/* Print: Technical Summary */}
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', color: '#005CB9' }}>Resumen Técnico</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '20px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Troquel</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{selectedTroquel.codigo_troquel}</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Dimensiones</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{selectedTroquel.ancho_mm} x {selectedTroquel.largo_mm} mm</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Material</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{savedMaterial.familia} ({savedMaterial.adhesivo})</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Entrega</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{tipoEntrega}{isRollo ? ` (${unidadesPorRollo.toLocaleString()} uds/rollo)` : ''}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Tintas</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{tipoTinta} ({coloresCount} colores)</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Acabados</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{acabadosSeleccionados.join(', ')}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Efectos</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{efectosSeleccionados.join(', ')}</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#6E6E73', borderBottom: '1px solid #eee' }}>Ancho Banda</td>
                <td style={{ padding: '4px 8px', fontWeight: 700, borderBottom: '1px solid #eee' }}>{selectedTroquel.ancho_banda || 0} in</td>
              </tr>
            </tbody>
          </table>

          {/* Print: Pricing Table */}
          <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', color: '#005CB9' }}>Escalas y Precios</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1D1D1F' }}>
                <th style={{ padding: '8px', textAlign: 'left', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>Escala (Etiquetas)</th>
                <th style={{ padding: '8px', textAlign: 'right', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>Precio Seleccionado (USD)</th>
              </tr>
            </thead>
            <tbody>
              {pricingTable.map((row, idx) => {
                const activeKey = getSelectedPriceKey(idx);
                const selectedPrice = row.prices[activeKey];
                return (
                  <tr key={`print-row-${idx}`} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>{row.quantity.toLocaleString()} uds</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#005CB9' }}>
                      ${selectedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Print Footer */}
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '12px', marginTop: '24px', fontSize: '9px', color: '#6E6E73', textAlign: 'center' }}>
            <p>Este documento es una cotización preliminar y no constituye un compromiso contractual.</p>
            <p style={{ marginTop: '4px' }}>Cotizador Técnico – Flexo RS · {today}</p>
          </div>
        </div>
      </div>
    </>
  );
}
