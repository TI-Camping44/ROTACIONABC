/* =====================================================================
   datos.js — Reporte de Stock y Rotación · Camping 44 S.A.
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para actualizar el reporte.
   index.html no se modifica nunca.

   Todos los montos van en MILLONES de guaraníes, sin separadores.
   Ejemplo: 3.615.000.000 se escribe 3615

   CATS ....... categorías y sus colores (no tocar)
   MARCAS ..... una línea por marca: monto a costo en cada categoría
                A / B / C = matriz ABC vigente
                SC = sin clasificación (armas y municiones, por regla)
                NC = sin categorizar (deuda de la matriz semestral)
   DETALLE .... ventas del período valuadas a costo
                [artículo, marca, categoría, composición, cliente, cantidad, costo unitario]
   MESES ...... etiquetas del eje del gráfico histórico
   SERIES ..... stock a costo de cada marca, un valor por mes (mismo orden que MESES)
   CMV6 ....... costo de la mercadería vendida en los últimos 6 meses, por marca

   ⚠ Los datos de abajo son FICTICIOS. Al reemplazarlos por reales,
     borrar la franja de "maqueta" del index.html.
   ===================================================================== */

var DATOS = {};

DATOS.CATS = [
  {k:"A",  lab:"A – Potenciar",        col:"var(--A)",  raw:"#B08A2E"},
  {k:"B",  lab:"B – Mantener",         col:"var(--B)",  raw:"#3D6E8C"},
  {k:"C",  lab:"C – Liquidar",         col:"var(--C)",  raw:"#A6432E"},
  {k:"SC", lab:"Sin clasificación",    col:"var(--SC)", raw:"#626C76"},
  {k:"NC", lab:"Sin categorizar",      col:"url(#hatch)", raw:"#8C7A57"}
];

DATOS.MARCAS = [
  {m:"Beretta",          tipo:"Armas",           A:320,B:210,C:95, SC:2850,NC:140},
  {m:"Glock",            tipo:"Armas",           A:180,B:90, C:40, SC:2110,NC:95},
  {m:"CBC",              tipo:"Municiones",      A:0,  B:0,  C:0,  SC:1470,NC:55},
  {m:"Taurus",           tipo:"Armas",           A:95, B:120,C:165,SC:1240,NC:60},
  {m:"CZ",               tipo:"Armas",           A:60, B:75, C:88, SC:890, NC:45},
  {m:"Varios",           tipo:"No reglamentado", A:150,B:190,C:420,SC:180, NC:390},
  {m:"Columbia",         tipo:"No reglamentado", A:380,B:240,C:310,SC:0,   NC:120},
  {m:"Sellier & Bellot", tipo:"Municiones",      A:0,  B:0,  C:0,  SC:980, NC:40},
  {m:"Coleman",          tipo:"No reglamentado", A:410,B:265,C:190,SC:0,   NC:85},
  {m:"Winchester",       tipo:"Municiones",      A:85, B:60, C:35, SC:720, NC:25},
  {m:"Bersa",            tipo:"Armas",           A:40, B:55, C:130,SC:610, NC:30},
  {m:"Nautika",          tipo:"No reglamentado", A:210,B:175,C:240,SC:0,   NC:70}
];

DATOS.DETALLE = [
  ["Pistola APX A1 Full 9x19","Beretta","SC","Arma + 2 cargadores 17u + estuche rígido","Seguridad Integral S.A.",18,14.2],
  ["Pistola G19 Gen5 9x19","Glock","SC","Arma + 3 cargadores 15u + kit limpieza","Armería del Este S.R.L.",22,11.1],
  ["Cartucho 9x19 FMJ 124gr (x1000)","CBC","SC","Caja x50 · pallet 20 cajas","Club de Tiro Villa Morra",26,7.4],
  ["Carpa Sundome 4P","Coleman","A","Carpa + sobretecho + bolsa + estacas","Consumidor final – mostrador",96,1.85],
  ["Pistola TX22 .22LR","Taurus","SC","Arma + 2 cargadores 16u","Cazadores del Chaco S.R.L.",31,5.2],
  ["Campera Powder Lite II","Columbia","A","Prenda individual","Consumidor final – mostrador",140,1.05],
  ["Cartucho .38 SPL SJHP (x500)","Sellier & Bellot","SC","Caja x50 · pallet 10 cajas","Policía Municipal – Luque",14,9.6],
  ["Rifle CZ 457 .22LR","CZ","SC","Rifle + cargador 5u + monta óptica","Club de Caza y Pesca Itá",9,13.8],
  ["Conservadora Xtreme 50QT","Coleman","A","Unidad + bandeja interna","Distribuidora San Blas",58,1.4],
  ["Chaleco táctico modular","Varios","B","Chaleco + 4 porta-cargadores + placa","Seguridad Integral S.A.",44,1.6],
  ["Cartucho cal. 12 Nº4 (x250)","Winchester","SC","Caja x25 · bulto 10 cajas","Cazadores del Chaco S.R.L.",21,3.1],
  ["Bolsa de dormir Trilha -5°","Nautika","B","Bolsa + funda compresora","Consumidor final – mostrador",72,0.82],
  ["Pistola Thunder Pro 9x19","Bersa","SC","Arma + 2 cargadores 17u","Armería del Este S.R.L.",11,5.0],
  ["Linterna táctica 1200lm","Varios","C","Linterna + batería + cargador","Consumidor final – mostrador",130,0.38],
  ["Mochila Trail 40L","Columbia","B","Unidad","Consumidor final – mostrador",84,0.55]
];

/* series de stock a costo, 12 meses (millones de Gs.) */
DATOS.MESES = ["sep 25","oct","nov","dic","ene 26","feb","mar","abr","may","jun","jul","ago"];
DATOS.SERIES = {
  "Beretta":         [2950,3120,3410,3380,3240,3690,3610,3480,3320,3150,3540,3615],
  "Glock":           [2180,2090,2460,2380,2250,2180,2620,2540,2410,2300,2560,2515],
  "CBC":             [1180,1420,1360,1180,1520,1390,1240,1580,1440,1290,1610,1525],
  "Taurus":          [1290,1340,1420,1480,1520,1560,1610,1650,1680,1700,1690,1680],
  "CZ":             [980,1040,1120,1090,1060,1180,1150,1120,1090,1140,1180,1158],
  "Varios":          [1050,1090,1140,1210,1180,1240,1280,1310,1290,1320,1350,1330],
  "Columbia":        [860,940,1080,1240,1150,1060,980,1120,1080,1010,1090,1050],
  "Sellier & Bellot":[840,910,880,1020,960,890,1040,1010,940,880,1060,1020],
  "Coleman":         [720,810,940,1090,1010,920,860,980,1040,890,910,950],
  "Winchester":      [690,740,820,780,860,810,750,880,840,790,950,925],
  "Bersa":           [640,680,720,760,790,820,850,870,880,890,880,865],
  "Nautika":         [520,560,610,690,650,600,640,700,720,660,710,695]
};
DATOS.CMV6 = {"Beretta":1980,"Glock":1760,"CBC":1610,"Taurus":620,"CZ":540,"Varios":890,
  "Columbia":1240,"Sellier & Bellot":980,"Coleman":980,"Winchester":760,"Bersa":240,"Nautika":410};


