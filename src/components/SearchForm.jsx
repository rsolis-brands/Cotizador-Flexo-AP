import { Search, Shapes, Component, ArrowRight } from 'lucide-react';

export default function SearchForm({ formData, handleChange, handleSubmit, unit, setUnit }) {
  return (
    <div className="lg:col-span-5 neu-elevated rounded-[24px] p-6 h-fit relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="neu-concave p-2">
            <Search className="w-5 h-5 neu-text-blue" />
          </div>
          <h2 className="text-lg font-bold neu-text-main">
            Criterios de Búsqueda
          </h2>
        </div>

        {/* Selector de Unidades */}
        <div className="flex neu-concave p-1">
          {['mm', 'in'].map(u => (
            <label key={`unit-${u}`} className="cursor-pointer relative">
              <input
                type="radio"
                name="unit_selector"
                value={u}
                checked={unit === u}
                onChange={(e) => setUnit(e.target.value)}
                className="sr-only"
              />
              <span className={`block px-3 py-1 text-[10px] font-bold uppercase rounded-[14px] transition-all duration-300 ${unit === u ? 'neu-elevated neu-text-blue scale-100' : 'neu-text-sec hover:neu-text-main scale-95'}`}>
                {u}
              </span>
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Medidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold neu-text-main">Ancho Etiqueta <span className="neu-text-sec font-medium">({unit})</span></label>
            <input
              type="number"
              step="0.01"
              name="ancho"
              value={formData.ancho}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-semibold neu-text-main placeholder:text-slate-400 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold neu-text-main">Largo Etiqueta <span className="neu-text-sec font-medium">({unit})</span></label>
            <input
              type="number"
              step="0.01"
              name="largo"
              value={formData.largo}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-semibold neu-text-main placeholder:text-slate-400 text-sm"
              required
            />
          </div>
        </div>

        {/* Tolerancia Slider */}
        <div className="neu-concave p-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-bold neu-text-main">Tolerancia de Búsqueda</label>
            <span className="text-xs font-bold neu-text-blue neu-elevated px-2.5 py-0.5 rounded-[12px]">
              ± {Number(formData.tolerancia).toFixed(1)} mm
            </span>
          </div>
          <input
            type="range"
            name="tolerancia"
            min="0.0"
            max="5.0"
            step="0.5"
            value={formData.tolerancia}
            onChange={handleChange}
            className="w-full h-2 neu-concave rounded-full appearance-none cursor-pointer accent-[#005CB9] focus:outline-none"
          />
          <div className="flex justify-between text-[10px] neu-text-sec mt-2 font-bold">
            <span>0.0 mm</span>
            <span>5.0 mm</span>
          </div>
        </div>

        {/* Selects: Forma y Esquinas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold neu-text-main flex items-center gap-1.5">
              <Shapes className="w-3.5 h-3.5 neu-text-sec" /> Geometría (Forma)
            </label>
            <select
              name="forma"
              value={formData.forma}
              onChange={handleChange}
              className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="Rectangular">Rectangular</option>
              <option value="Cuadrado">Cuadrado</option>
              <option value="Circular">Circular</option>
              <option value="Variada">Variada</option>
              <option value="Ovalo">Ovalo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold neu-text-main flex items-center gap-1.5">
              <Component className="w-3.5 h-3.5 neu-text-sec" /> Tipo de Esquina
            </label>
            <select
              name="esquinas"
              value={formData.esquinas}
              onChange={handleChange}
              className="w-full px-3 py-2.5 neu-concave focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold neu-text-main appearance-none cursor-pointer text-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231D1D1F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="Rectas">Rectas</option>
              <option value="Redondas">Redondas</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
        </div>



        {/* Switches */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between p-3.5 neu-elevated transition-colors">
            <span className="text-xs font-bold neu-text-main">Precorte Integrado (Línea)</span>
            <div className="flex neu-concave p-1">
              {['SI', 'NO'].map(op => (
                <label key={`int-${op}`} className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="precorte_integrado"
                    value={op}
                    checked={formData.precorte_integrado === op}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`block px-3 py-1 text-[10px] font-bold rounded-[14px] transition-all duration-300 ${formData.precorte_integrado === op ? 'neu-elevated neu-text-blue scale-100' : 'neu-text-sec hover:neu-text-main scale-95'}`}>
                    {op}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 neu-elevated transition-colors">
            <span className="text-xs font-bold neu-text-main">Precorte entre Cavidades</span>
            <div className="flex neu-concave p-1">
              {['SI', 'NO'].map(op => (
                <label key={`cav-${op}`} className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="precorte"
                    value={op}
                    checked={formData.precorte === op}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`block px-3 py-1 text-[10px] font-bold rounded-[14px] transition-all duration-300 ${formData.precorte === op ? 'neu-elevated neu-text-blue scale-100' : 'neu-text-sec hover:neu-text-main scale-95'}`}>
                    {op}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 neu-btn-primary font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
        >
          <span>Buscar Troqueles Compatibles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
