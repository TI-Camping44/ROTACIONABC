/*
 * Reescribe datos.js sin sangría.
 *
 * El script de Apps Script publica datos.js con JSON.stringify(datos, null, 2):
 * unas 148.000 líneas y 2,3 MB. Sin la sangría el archivo baja a ~1,3 MB y
 * el navegador descarga ~15 % menos (GitHub Pages ya lo comprime).
 *
 * Solo cambia la forma, nunca los datos: antes de escribir, compara el
 * contenido original con el compactado y, si no son idénticos, sale con
 * error sin tocar el archivo. Si ya está compacto, no hace nada.
 *
 * Uso: node .github/scripts/compactar-datos.js datos.js
 */
'use strict';
const fs = require('fs');

const ruta = process.argv[2] || 'datos.js';
const original = fs.readFileSync(ruta, 'utf8');

const marca = 'var DATOS = ';
const inicio = original.indexOf(marca);
const fin = original.lastIndexOf(';');
if (inicio < 0 || fin < inicio) {
  console.error(`No encontré "${marca}…;" en ${ruta}. No toco nada.`);
  process.exit(1);
}

const encabezado = original.slice(0, inicio);
let datos;
try {
  datos = JSON.parse(original.slice(inicio + marca.length, fin));
} catch (e) {
  console.error(`${ruta} no tiene un JSON válido después de "${marca}": ${e.message}. No toco nada.`);
  process.exit(1);
}

const compacto = encabezado + marca + JSON.stringify(datos) + ';\n';

/* Verificación: el archivo compactado tiene que dar exactamente los mismos datos. */
const leer = texto => JSON.parse(texto.slice(texto.indexOf(marca) + marca.length, texto.lastIndexOf(';')));
if (JSON.stringify(leer(compacto)) !== JSON.stringify(datos)) {
  console.error('El resultado compactado no coincide con el original. No toco nada.');
  process.exit(1);
}

if (compacto === original) {
  console.log(`${ruta} ya está compacto. Nada que hacer.`);
  process.exit(0);
}

fs.writeFileSync(ruta, compacto);
const kb = n => Math.round(n / 1024).toLocaleString('es-PY') + ' KB';
console.log(`${ruta}: ${kb(Buffer.byteLength(original))} -> ${kb(Buffer.byteLength(compacto))}`);
