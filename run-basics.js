import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const foldersToProcess = ['Basics', 'Intermediate', 'Advanced'];

// Función recursiva para obtener todos los archivos .ts
function getAllTypeScriptFiles(dir, isRootFolder = true) {
  let files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const isDir = fs.lstatSync(fullPath).isDirectory();

    if (isDir) {
      // Para la carpeta raíz (Basics), incluir carpetas POO y modules
      if (isRootFolder && (item === 'POO' || item === 'modules')) {
        files = files.concat(getAllTypeScriptFiles(fullPath, false));
      } else if (!isRootFolder) {
        // Para subcarpetas, incluir todas las carpetas
        files = files.concat(getAllTypeScriptFiles(fullPath, false));
      }
    } else if (item.endsWith('.ts')) {
      // Agregar archivo .ts relativo a la raíz del proyecto
      const relativePath = path.relative(__dirname, fullPath);
      files.push(relativePath);
    }
  });

  return files;
}

// Obtener todos los archivos de las tres carpetas
let allFiles = [];
foldersToProcess.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  allFiles = allFiles.concat(getAllTypeScriptFiles(folderPath, true));
});

if (allFiles.length === 0) {
  console.log('No se encontraron archivos .ts en las carpetas: Basics, Intermediate, Advanced');
  process.exit(0);
}

console.log(`🚀 Ejecutando ${allFiles.length} archivo(s) de TypeScript...\n`);

// Ejecutar cada archivo
allFiles.forEach((file, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📄 [${index + 1}/${allFiles.length}] ${file}`);
  console.log('='.repeat(60));
  
  try {
    execSync(`node --loader ts-node/esm --no-warnings ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error al ejecutar ${file}`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Ejecución completada - ${allFiles.length} archivo(s) procesados`);