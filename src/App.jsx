import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { buscarTroquel } from './logic/searchEngine';
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Components
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import TroquelesCatalog from './components/TroquelesCatalog';
import CalculatorPanel from './components/CalculatorPanel';

function App() {
  const [activeTab, setActiveTab] = useState('cotizador'); // 'cotizador' | 'inventario'
  const [unit, setUnit] = useState('in'); // 'mm' | 'in'
  const [troquelesData, setTroquelesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculator state
  const [selectedTroquel, setSelectedTroquel] = useState(null);
  const [copied, setCopied] = useState(false);
  const [calcInputs, setCalcInputs] = useState({
    cantidadEtiquetas: 10000,
    etiquetasPorRollo: 1000,
    mermaArranque: 50,
    mermaOperacion: 2,
    anchoBanda: 0
  });

  const handleAbrirCalculadora = (troquel) => {
    setSelectedTroquel(troquel);
    setCalcInputs({
      cantidadEtiquetas: 10000,
      etiquetasPorRollo: 1000,
      mermaArranque: 50,
      mermaOperacion: 2,
      anchoBanda: troquel.ancho_banda || 0
    });
    setCopied(false);
  };

  const handleCalcInputChange = (e) => {
    const { name, value } = e.target;
    setCalcInputs(prev => ({ ...prev, [name]: value }));
  };

  // Math calculations
  const calcResultados = useMemo(() => {
    if (!selectedTroquel) return null;

    const Q = Number(calcInputs.cantidadEtiquetas) || 0;
    const N = Number(calcInputs.etiquetasPorRollo) || 1;
    const mermaArr = Number(calcInputs.mermaArranque) || 0;
    const mermaOp = Number(calcInputs.mermaOperacion) || 0;
    const anchoB = Number(calcInputs.anchoBanda) || Number(selectedTroquel.ancho_banda) || 0;

    const C_a = Number(selectedTroquel.cavidades_ancho) || 1;
    const C_v = Number(selectedTroquel.cavidades_avance) || 1;
    const repeatMm = Number(selectedTroquel.repeat_mm) || 0;

    const girosBase = Q / (C_a * C_v);
    const metrosNetos = (girosBase * repeatMm) / 1000;
    const metrosMerma = (metrosNetos * (mermaOp / 100)) + mermaArr;
    const metrosTotales = metrosNetos + metrosMerma;

    const anchoBandaM = (anchoB * 25.4) / 1000;
    const metrosCuadrados = metrosTotales * anchoBandaM;

    const largoRollo = (N * repeatMm) / (C_v * 1000);
    const rollos = Q / N;

    const girosTotales = (metrosTotales * 1000) / repeatMm;
    const etiquetasTotalesConMerma = Math.round(girosTotales * C_a * C_v);

    return {
      girosBase: Math.ceil(girosBase),
      metrosNetos: parseFloat(metrosNetos.toFixed(2)),
      metrosMerma: parseFloat(metrosMerma.toFixed(2)),
      metrosTotales: parseFloat(metrosTotales.toFixed(2)),
      metrosCuadrados: parseFloat(metrosCuadrados.toFixed(2)),
      largoRollo: parseFloat(largoRollo.toFixed(2)),
      rollos: parseFloat(rollos.toFixed(1)),
      etiquetasTotalesConMerma,
      anchoBandaMm: Math.round(anchoB * 25.4)
    };
  }, [selectedTroquel, calcInputs]);

  const handleCopiarResumen = () => {
    if (!selectedTroquel || !calcResultados) return;

    const texto = `--- RESUMEN DE PRODUCCIÓN Y MATERIAL ---
Troquel Código: ${selectedTroquel.codigo_troquel}
Medidas: ${selectedTroquel.ancho_mm} x ${selectedTroquel.largo_mm} mm
Vías / Cavidades al ancho: ${selectedTroquel.cavidades_ancho}
Cilindro (Dientes): ${selectedTroquel.cilindro || 'N/A'}
Desarrollo (Repeat): ${selectedTroquel.repeat_mm} mm

PARÁMETROS DE COTIZACIÓN:
- Cantidad de Etiquetas: ${Number(calcInputs.cantidadEtiquetas).toLocaleString()} uds
- Presentación: Rollos de ${Number(calcInputs.etiquetasPorRollo).toLocaleString()} uds
- Ancho de Banda: ${calcInputs.anchoBanda} in (${calcResultados.anchoBandaMm} mm)
- Merma de Arranque: ${calcInputs.mermaArranque} m
- Merma de Operación: ${calcInputs.mermaOperacion} %

RESULTADOS:
- Metros Lineales Netos: ${calcResultados.metrosNetos.toLocaleString()} m
- Metros de Merma: ${calcResultados.metrosMerma.toLocaleString()} m
- METROS TOTALES A PRODUCIR: ${calcResultados.metrosTotales.toLocaleString()} m
- Área de Material: ${calcResultados.metrosCuadrados.toLocaleString()} m²
- Largo por Rollo individual: ${calcResultados.largoRollo.toLocaleString()} m
- Cantidad de Rollos: ${calcResultados.rollos} rollos
- Etiquetas a Imprimir (con merma): ${calcResultados.etiquetasTotalesConMerma.toLocaleString()} uds
----------------------------------------`;

    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [formData, setFormData] = useState({
    ancho: '',
    largo: '',
    tolerancia: 0.5,
    forma: 'Rectangular',
    esquinas: 'Rectas',
    precorte_integrado: 'NO',
    precorte: 'NO'
  });

  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, 'troqueles'));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id_firestore: doc.id, ...doc.data() });
        });
        
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
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
          </div>
        )}
      </main>

      {/* Calculadora Slide-over Panel */}
      <CalculatorPanel 
        selectedTroquel={selectedTroquel}
        setSelectedTroquel={setSelectedTroquel}
        calcInputs={calcInputs}
        handleCalcInputChange={handleCalcInputChange}
        setCalcInputs={setCalcInputs}
        calcResultados={calcResultados}
        handleCopiarResumen={handleCopiarResumen}
        copied={copied}
      />
    </div>
  );
}

export default App;
