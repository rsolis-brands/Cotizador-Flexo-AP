import { Search, Shapes, Component, ArrowRight } from 'lucide-react';

export default function SearchForm({ formData, handleChange, handleSubmit, unit, setUnit }) {
  return (
    <div className="lg:col-span-5 glass-panel rounded-2xl p-6 h-fit relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg border border-slate-200/60">
            <Search className="w-5 h-5 text-slate-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Criterios de Búsqueda
          </h2>
        </div>

        {/* Selector de Unidades */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
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
              <span className={`block px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all duration-300 ${unit === u ? 'bg-white text-slate-900 shadow-sm scale-100' : 'text-slate-500 hover:text-slate-800 scale-95'}`}>
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
            <label className="block text-xs font-bold text-slate-700">Ancho Etiqueta <span className="text-slate-400 font-medium">({unit})</span></label>
            <input
              type="number"
              step="0.01"
              name="ancho"
              value={formData.ancho}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all outline-none font-semibold text-slate-800 placeholder:text-slate-350 shadow-sm text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Largo Etiqueta <span className="text-slate-400 font-medium">({unit})</span></label>
            <input
              type="number"
              step="0.01"
              name="largo"
              value={formData.largo}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all outline-none font-semibold text-slate-800 placeholder:text-slate-355 shadow-sm text-sm"
              required
            />
          </div>
        </div>

        {/* Tolerancia Slider */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-bold text-slate-700">Tolerancia de Búsqueda</label>
            <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-sm">
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
            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-800 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
            <span>0.0 mm</span>
            <span>5.0 mm</span>
          </div>
        </div>

        {/* Selects: Forma y Esquinas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Shapes className="w-3.5 h-3.5 text-slate-500" /> Geometría (Forma)
            </label>
            <select
              name="forma"
              value={formData.forma}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 outline-none font-semibold text-slate-700 shadow-sm appearance-none cursor-pointer text-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="Rectangular">Rectangular</option>
              <option value="Cuadrada">Cuadrada</option>
              <option value="Circular">Circular</option>
              <option value="Variada">Variada</option>
              <option value="Ovalo">Ovalo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Component className="w-3.5 h-3.5 text-slate-500" /> Tipo de Esquina
            </label>
            <select
              name="esquinas"
              value={formData.esquinas}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 outline-none font-semibold text-slate-700 shadow-sm appearance-none cursor-pointer text-sm"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="Rectas">Rectas</option>
              <option value="Redondas">Redondas</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
        </div>

        {/* Switches */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/40 shadow-sm hover:bg-slate-100/50 transition-colors">
            <span className="text-xs font-bold text-slate-700">Precorte Integrado (Línea)</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 shadow-inner">
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
                  <span className={`block px-3 py-1 text-[10px] font-bold rounded-md transition-all duration-300 ${formData.precorte_integrado === op ? 'bg-white text-slate-900 shadow-sm scale-100' : 'text-slate-500 hover:text-slate-800 scale-95'}`}>
                    {op}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/40 shadow-sm hover:bg-slate-100/50 transition-colors">
            <span className="text-xs font-bold text-slate-700">Precorte entre Cavidades</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 shadow-inner">
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
                  <span className={`block px-3 py-1 text-[10px] font-bold rounded-md transition-all duration-300 ${formData.precorte === op ? 'bg-white text-slate-900 shadow-sm scale-100' : 'text-slate-500 hover:text-slate-800 scale-95'}`}>
                    {op}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-700 via-purple-600 to-emerald-500 hover:from-blue-800 hover:via-purple-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
        >
          <span>Buscar Troqueles Compatibles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
