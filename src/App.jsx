import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { buscarTroquel } from './logic/searchEngine';
import { supabase } from './supabase/config';

// Components
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import TroquelesCatalog from './components/TroquelesCatalog';
import FlexoQuoteCalculator from './components/FlexoQuoteCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('cotizador'); // 'cotizador' | 'inventario'
  const [unit, setUnit] = useState('in'); // 'mm' | 'in'
  const [troquelesData, setTroquelesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculator state
  const [selectedTroquel, setSelectedTroquel] = useState(null);

  const handleAbrirCalculadora = (troquel) => {
    setSelectedTroquel(troquel);
    setActiveTab('cotizador_flexo');
  };

  const [formData, setFormData] = useState({
    ancho: '',
    largo: '',
    tolerancia: 0.5,
    forma: 'Rectangular',
    esquinas: 'Rectas',
    precorte_integrado: 'NO',
    precorte: 'NO',
    colores: 1
  });

  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('troqueles')
          .select('*');

        if (error) {
          console.error("Error fetching troqueles from Supabase:", error.message);
          return;
        }

        // Map Supabase boolean fields back to 'SI'/'NO' strings
        // so the existing search engine and UI logic remain untouched.
        const docs = data.map((row) => ({
          ...row,
          precorte_integrado: row.precorte_integrado ? 'SI' : 'NO',
          precorte_entre_cavidades: row.precorte_entre_cavidades ? 'SI' : 'NO',
        }));
        
        // Prioridad Inicial global
        docs.sort((a, b) => {
          const foco = "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
          if (a.familia_troquel === foco && b.familia_troquel !== foco) return -1;
          if (a.familia_troquel !== foco && b.familia_troquel === foco) return 1;
          return 0;
        });

        setTroquelesData(docs);
      } catch (error) {
        console.error("Error fetching troqueles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newForm = { ...prev, [name]: value };

      // Si el ancho y largo son iguales, forzar la forma a Cuadrado
      if ((name === 'ancho' || name === 'largo') && newForm.ancho !== '' && newForm.largo !== '') {
        if (Number(newForm.ancho) === Number(newForm.largo)) {
          newForm.forma = 'Cuadrado';
        } else if (newForm.forma === 'Cuadrado') {
          newForm.forma = 'Rectangular'; // Volver a Rectangular si ya no es cuadrado
        }
      }

      // Si la forma es Circular, forzar esquinas a N/A
      if (name === 'forma' && value === 'Circular') {
        newForm.esquinas = 'N/A';
      } else if (name === 'forma' && prev.forma === 'Circular' && value !== 'Circular') {
        newForm.esquinas = 'Rectas'; // Valor por defecto si sale de Circular
      }

      return newForm;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const input = {
      ...formData,
      tolerancia: Number(formData.tolerancia)
    };

    if (formData.ancho !== '') {
      input.ancho = unit === 'in' ? Number(formData.ancho) * 25.4 : Number(formData.ancho);
    }
    if (formData.largo !== '') {
      input.largo = unit === 'in' ? Number(formData.largo) * 25.4 : Number(formData.largo);
    }

    const results = buscarTroquel(troquelesData, input);
    setResultados(results);
  };

  return (
    <div className="min-h-screen neu-bg-main neu-text-main font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Navbar/Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-4 space-y-8 min-h-[calc(100vh-6rem)]">
        
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-slate-700 relative z-10" />
            </div>
            <p className="text-lg font-bold mt-6 text-slate-800">
              Sincronizando Base de Datos...
            </p>
            <p className="text-xs font-medium text-slate-500 mt-2">
              Cargando {troquelesData.length} troqueles en catálogo
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* TABS CONTENT */}
            {activeTab === 'cotizador' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <SearchForm 
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  unit={unit}
                  setUnit={setUnit}
                />
                
                {/* Resultados */}
                <div className="lg:col-span-7">
                  <SearchResults 
                    resultados={resultados}
                    handleAbrirCalculadora={handleAbrirCalculadora}
                  />
                </div>
              </div>
            )}

            {activeTab === 'inventario' && (
              <TroquelesCatalog 
                troquelesData={troquelesData}
                handleAbrirCalculadora={handleAbrirCalculadora}
              />
            )}

            {activeTab === 'cotizador_flexo' && (
              <FlexoQuoteCalculator 
                selectedTroquel={selectedTroquel}
                setSelectedTroquel={setSelectedTroquel}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
