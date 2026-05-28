import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// Custom .env loader to avoid external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key to bypass RLS since we disabled public write
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project-id') || supabaseServiceKey.includes('your-service-role-key')) {
  console.error('ERROR: Please configure valid Supabase credentials (VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in the .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const numericFields = [
  'cilindro', 'repeat_in', 'repeat_mm', 'ancho_mm', 'largo_mm',
  'ancho_in', 'largo_in', 'gap_ancho', 'gap_avance', 'ancho_banda',
  'cavidades_ancho', 'cavidades_avance'
];

function cleanString(str) {
  return str ? str.trim() : '';
}

function parseBoolean(str) {
  const cleaned = cleanString(str).toUpperCase();
  return cleaned === 'SI' || cleaned === 'YES' || cleaned === 'TRUE' || cleaned === '1';
}

async function runMigration() {
  const csvFilePath = 'listado_troqueles_2026.csv';
  if (!fs.existsSync(csvFilePath)) {
    console.error(`ERROR: CSV file not found at ${csvFilePath}`);
    process.exit(1);
  }

  console.log('Reading and parsing CSV...');
  const csvText = fs.readFileSync(csvFilePath, 'utf8');

  Papa.parse(csvText, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    complete: async (results) => {
      const data = results.data;
      console.log(`Found ${data.length} total rows in CSV. Starting validation...`);

      const errors = [];
      const seenCodigos = new Set();
      const validRecords = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const lineNum = i + 2; // Line 1 is header
        const codigo = cleanString(row.codigo_troquel);

        // 1. Validate empty/missing codigo_troquel
        if (!codigo) {
          errors.push(`[Línea ${lineNum}] codigo_troquel está vacío.`);
          continue;
        }

        // 2. Validate duplicates
        if (seenCodigos.has(codigo)) {
          errors.push(`[Línea ${lineNum}] codigo_troquel duplicado: "${codigo}".`);
          continue;
        }
        seenCodigos.add(codigo);

        // 3. Validate numeric fields
        const numericData = {};
        let rowHasNumericError = false;

        for (const field of numericFields) {
          const rawVal = row[field];
          if (rawVal === undefined || rawVal === null || rawVal === '') {
            numericData[field] = 0;
          } else {
            // Replace comma with dot if necessary
            const cleanedVal = String(rawVal).replace(',', '.').trim();
            const parsed = Number(cleanedVal);
            if (isNaN(parsed)) {
              errors.push(`[Línea ${lineNum}] Campo "${field}" tiene un valor numérico inválido: "${rawVal}".`);
              rowHasNumericError = true;
            } else {
              numericData[field] = parsed;
            }
          }
        }

        if (rowHasNumericError) {
          continue;
        }

        // Prepare record for insertion
        const record = {
          codigo_troquel: codigo,
          cilindro: numericData.cilindro,
          repeat_in: numericData.repeat_in,
          repeat_mm: numericData.repeat_mm,
          ancho_mm: numericData.ancho_mm,
          largo_mm: numericData.largo_mm,
          ancho_in: numericData.ancho_in,
          largo_in: numericData.largo_in,
          gap_ancho: numericData.gap_ancho,
          gap_avance: numericData.gap_avance,
          ancho_banda: numericData.ancho_banda,
          precorte_integrado: parseBoolean(row.precorte_integrado),
          cavidades_ancho: numericData.cavidades_ancho,
          cavidades_avance: numericData.cavidades_avance,
          forma: cleanString(row.forma),
          esquinas: cleanString(row.esquinas),
          precorte_entre_cavidades: parseBoolean(row.precorte_entre_cavidades),
          familia_troquel: cleanString(row.familia_troquel)
        };

        validRecords.push(record);
      }

      if (errors.length > 0) {
        console.error('\n--- ERRORES DE VALIDACIÓN ENCONTRADOS ---');
        errors.forEach(err => console.error(err));
        console.error(`\nSe encontraron ${errors.length} errores. Corrija el CSV antes de continuar.`);
        process.exit(1);
      }

      console.log(`Validation passed! ${validRecords.length} records are valid.`);
      console.log('Uploading to Supabase (using upsert by codigo_troquel)...');

      // Upload in chunks of 100 to avoid request size limits or timeouts
      const chunkSize = 100;
      let successCount = 0;

      for (let i = 0; i < validRecords.length; i += chunkSize) {
        const chunk = validRecords.slice(i, i + chunkSize);
        
        const { error } = await supabase
          .from('troqueles')
          .upsert(chunk, { onConflict: 'codigo_troquel' });

        if (error) {
          console.error(`Error uploading chunk ${i / chunkSize + 1}:`, error.message);
          process.exit(1);
        } else {
          successCount += chunk.length;
          console.log(`Uploaded ${successCount}/${validRecords.length} records...`);
        }
      }

      console.log(`\nMigration completed successfully. ${successCount} records upserted.`);
      process.exit(0);
    }
  });
}

runMigration().catch(err => {
  console.error('Unhandled migration error:', err);
  process.exit(1);
});
