import fs from 'fs';
import Papa from 'papaparse';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2_E93lvSpO4rVo6n8BercQ8_MCjtPtYk",
  authDomain: "cotizador-flexo-troqueladas.firebaseapp.com",
  projectId: "cotizador-flexo-troqueladas",
  storageBucket: "cotizador-flexo-troqueladas.firebasestorage.app",
  messagingSenderId: "701121746339",
  appId: "1:701121746339:web:1ba5dd6138e3b3e19f3616",
  measurementId: "G-N7XHW9W6TV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const numericFields = [
  'cilindro', 'repeat_in', 'repeat_mm', 'ancho_mm', 'largo_mm',
  'ancho_in', 'largo_in', 'gap_ancho', 'gap_avance', 'ancho_banda',
  'cavidades_ancho', 'cavidades_avance'
];

async function migrate() {
  console.log('Reading CSV...');
  const csvText = fs.readFileSync('listado_troqueles_2026.csv', 'utf8');
  
  Papa.parse(csvText, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    complete: async (results) => {
      const data = results.data;
      console.log(`Found ${data.length} records. Uploading to Firestore...`);
      
      let count = 0;
      
      // Procesar en lotes o secuencial para no sobrecargar
      for (const row of data) {
        // Asegurar nombres y limpiar
        const docData = {
          codigo_troquel: row.codigo_troquel?.trim() || '',
          cilindro: row.cilindro,
          repeat_in: row.repeat_in,
          repeat_mm: row.repeat_mm,
          ancho_mm: row.ancho_mm,
          largo_mm: row.largo_mm,
          ancho_in: row.ancho_in,
          largo_in: row.largo_in,
          gap_ancho: row.gap_ancho,
          gap_avance: row.gap_avance,
          ancho_banda: row.ancho_banda,
          precorte_integrado: row.precorte_integrado?.trim() || 'NO',
          cavidades_ancho: row.cavidades_ancho,
          cavidades_avance: row.cavidades_avance,
          forma: row.forma?.trim() || '',
          esquinas: row.esquinas?.trim() || '',
          precorte_entre_cavidades: row.precorte_entre_cavidades?.trim() || 'NO',
          familia_troquel: row.familia_troquel?.trim() || ''
        };

        // Convertir campos numéricos
        for (const field of numericFields) {
           const val = docData[field];
           if (val === undefined || val === null || val === '') {
             docData[field] = 0;
           } else if (typeof val === 'string') {
             // Reemplazar coma por punto si es necesario (ej. 2,5 -> 2.5)
             const parsed = Number(val.replace(',', '.'));
             docData[field] = isNaN(parsed) ? 0 : parsed;
           }
        }

        try {
          // Usar setDoc con doc() para forzar el ID a ser el codigo_troquel si está disponible,
          // o addDoc. Vamos a usar un doc() simple pero si el id ya existe se sobreescribe. 
          // Es mejor usar addDoc para IDs auto-generados o setDoc con un ID limpio. 
          // Usemos el codigo_troquel como id de documento si está limpio, sino addDoc.
          const id = docData.codigo_troquel.replace(/[^a-zA-Z0-9_-]/g, '') || `id_${count}`;
          await setDoc(doc(db, 'troqueles', id), docData);
          count++;
          if (count % 100 === 0) {
            console.log(`Uploaded ${count} records...`);
          }
        } catch (err) {
          console.error(`Error uploading record ${row.codigo_troquel}:`, err);
        }
      }
      
      console.log(`Migration complete. Successfully uploaded ${count} records.`);
      // eslint-disable-next-line no-undef
      process.exit(0);
    }
  });
}

migrate().catch(console.error);
