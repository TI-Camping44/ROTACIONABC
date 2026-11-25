/*
 * Arma la vista sin valorización en la carpeta vista/.
 *
 * Es el mismo reporte, pero en unidades: para las áreas que necesitan ver qué
 * mercadería hay y dónde (por ejemplo Marketing), sin el costo. Se publica en
 * https://ti-camping44.github.io/ROTACIONABC/vista/
 *
 * Qué hace:
 *  · vista/datos.js: copia del datos.js con SOLO los campos de la lista de
 *    abajo. En el stock y en los artículos, el valor a costo se reemplaza por
 *    la cantidad. Todo lo de la Parte 2 (histórico, costo de venta, rotación)
 *    queda afuera. Si mañana el script de la planilla agrega un campo nuevo,
 *    no pasa a la vista hasta que se lo sume acá a propósito.
 *  · vista/index.html: copia exacta del index.html. La página reconoce
 *    SIN_VALOR en los datos y se dibuja en unidades, sin la Parte 2.
 *  · vista/LOGOC44.png: copia del logo, para que la página lo encuentre.
 *
 * Antes de escribir, verifica que no quede ningún monto: si algo no cierra,
 * sale con error sin tocar nada.
 *
 * Uso: node .github/scripts/vista-sin-valor.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const marca = 'var DATOS = ';
const original = fs.readFileSync('datos.js', 'utf8');
const inicio = original.indexOf(marca);
const fin = original.lastIndexOf(';');
if (inicio < 0 || fin < inicio) {
  console.error(`No encontré "${marca}…;" en datos.js. No toco nada.`);
  process.exit(1);
}
const D = JSON.parse(original.slice(inicio + marca.length, fin));

/* Campos que pasan tal cual: ninguno lleva guaraníes. */
const TAL_CUAL = ['CATS', 'GENERADO', 'EMPRESA', 'PARAMS', 'NO_COMERCIAL'];

/* Artículo: [ref, nombre, marca, tipo, dep, cat, cal, cantidad, valor, familia, control] */
const A_CANT = 7, A_VAL = 8;

const V = { SIN_VALOR: true };
TAL_CUAL.forEach(function (k) { if (D[k] !== undefined) V[k] = D[k]; });

V.STOCK = (D.STOCK || []).map(function (r) {
  const q = Number(r.q) || 0;
  return { m: r.m, tipo: r.tipo, dep: r.dep, cat: r.cat, cal: r.cal, fam: r.fam,
           ctl: r.ctl, abc: r.abc, q: q, v: q };
});

V.ARTICULOS = (D.ARTICULOS || []).map(function (a) {
  const b = a.slice();
  b[A_VAL] = Number(a[A_CANT]) || 0;
  return b;
});

/* La Parte 2 sale de las capas de valorización: no va en la vista. */
V.MESES = []; V.MESES_VENTA = []; V.MESES_ROT = D.MESES_ROT || 6;
['SERIES', 'SERIES_ART', 'SERIES_FAM', 'SERIES_MT', 'SERIES_FT',
 'CMV6', 'CMV6_FAM', 'CMV6_MT', 'CMV6_FT'].forEach(function (k) { V[k] = {}; });
V.ROT_ART = [];

/* ---------------- verificación ---------------- */
const errores = [];
V.STOCK.forEach(function (r, i) {
  if (r.v !== r.q) errores.push('STOCK[' + i + '] tiene un valor distinto de la cantidad');
});
V.ARTICULOS.forEach(function (a, i) {
  if (a[A_VAL] !== (Number(a[A_CANT]) || 0)) errores.push('ARTICULOS[' + i + '] conserva el valor a costo');
});
if (V.STOCK.length !== (D.STOCK || []).length) errores.push('STOCK no tiene las mismas filas');
if (V.ARTICULOS.length !== (D.ARTICULOS || []).length) errores.push('ARTICULOS no tiene las mismas filas');
if (errores.length) {
  console.error('La vista no quedó sin valorización. No toco nada.\n' + errores.slice(0, 10).join('\n'));
  process.exit(1);
}

/* ---------------- escritura ---------------- */
const carpeta = 'vista';
fs.mkdirSync(carpeta, { recursive: true });
const encabezado =
  '/* Vista sin valorización: generada por .github/scripts/vista-sin-valor.js\n' +
  '   a partir del datos.js del ' + (D.GENERADO || '—') + '. Cifras en unidades, sin costos.\n' +
  '   No editar a mano: se rehace en cada publicación. */\n\n';
fs.writeFileSync(path.join(carpeta, 'datos.js'), encabezado + marca + JSON.stringify(V) + ';\n');
fs.copyFileSync('index.html', path.join(carpeta, 'index.html'));
if (fs.existsSync('LOGOC44.png')) fs.copyFileSync('LOGOC44.png', path.join(carpeta, 'LOGOC44.png'));

const kb = function (f) { return Math.round(fs.statSync(f).size / 1024).toLocaleString('es-PY') + ' KB'; };
console.log('Vista sin valorización lista: ' + V.STOCK.length + ' filas de stock, ' +
  V.ARTICULOS.length + ' artículos, datos ' + kb(path.join(carpeta, 'datos.js')) + '.');
