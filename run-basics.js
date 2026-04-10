import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basicsDir = path.join(__dirname, 'Basics');

// Función recursiva para obtener todos los archivos .ts
function getAllTypeScriptFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const isDir = fs.lstatSync(fullPath).isDirectory();

    if (isDir) {
      // Solo incluir carpetas POO y modules
      if (item === 'POO' || item === 'modules') {
        files = files.concat(getAllTypeScriptFiles(fullPath));
      }
    } else if (item.endsWith('.ts')) {
      // Agregar archivo .ts relativo a la raíz del proyecto
      const relativePath = path.relative(__dirname, fullPath);
      files.push(relativePath);
    }
  });

  return files;
}

const files = getAllTypeScriptFiles(basicsDir);

if (files.length === 0) {
  console.log('No se encontraron archivos .ts en la carpeta Basics');
  process.exit(0);
}

console.log(`Ejecutando ${files.length} archivo(s)...\n`);

// Ejecutar cada archivo
files.forEach((file, index) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📄 [${index + 1}/${files.length}] ${file}`);
  console.log('='.repeat(50));
  
  try {
    execSync(`node --loader ts-node/esm --no-warnings ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error al ejecutar ${file}`);
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Ejecución completada`);