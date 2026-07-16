import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env.local
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log("Fetching schema info for 'companies'...");
  
  // Method 1: Fetch OpenAPI spec with headers
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    if (res.ok) {
      const spec = await res.json();
      console.log("\n--- 'companies' OpenAPI Schema ---");
      const companiesDef = spec.definitions?.companies;
      if (companiesDef) {
        console.log("Properties:", Object.keys(companiesDef.properties));
        console.log("Details:", JSON.stringify(companiesDef.properties, null, 2));
      } else {
        console.log("Could not find 'companies' definition in spec.");
      }
      
      console.log("\n--- 'company_members' OpenAPI Schema ---");
      const membersDef = spec.definitions?.company_members;
      if (membersDef) {
        console.log("Properties:", Object.keys(membersDef.properties));
      }
    } else {
      console.error("Failed to fetch OpenAPI spec (headers version):", res.status, res.statusText);
    }
  } catch (err) {
    console.error("Error fetching OpenAPI:", err);
  }

  // Method 2: Query a row from companies to inspect columns of returned object
  try {
    console.log("\nQuerying a row from 'companies' table...");
    const { data, error } = await supabase.from('companies').select('*').limit(1);
    if (error) {
      console.error("Error querying companies:", error.message);
    } else if (data && data.length > 0) {
      console.log("Found row in companies table:", data[0]);
      console.log("Returned row keys (columns):", Object.keys(data[0]));
    } else {
      console.log("No rows in 'companies' table.");
    }
  } catch (err) {
    console.error("Error running query:", err);
  }
}

inspectSchema();
