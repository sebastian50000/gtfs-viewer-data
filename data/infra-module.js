/* ============================================================
   Modulo Vias Exclusivas / Infraestructura (KMZ) - SEREMITT Biobio
   Fase 1: datos + panel/tabla + filtros + totales
   Fase 2: geometria en mapa + importar KMZ + editar + persistencia
   Se carga como archivo externo desde index.html
   ============================================================ */
(function(){
'use strict';

var st=document.createElement('style'); st.id='infra-css'; st.textContent="\n#infra-panel{position:fixed;top:70px;right:12px;width:470px;max-width:calc(100vw - 24px);height:calc(100vh - 90px);background:#141b2e;border:1px solid #2b3a55;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.55);z-index:1400;display:none;flex-direction:column;font-family:'Segoe UI',system-ui,sans-serif;color:#e6edf7;}\n#infra-panel.open{display:flex;}\n.infra-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#0f172a;border-bottom:1px solid #2b3a55;border-radius:12px 12px 0 0;cursor:move;}\n.infra-head b{font-size:14px;color:#38bdf8;letter-spacing:.3px;}\n.infra-head .infra-x{background:#ef4444;border:none;color:#fff;width:26px;height:26px;border-radius:6px;cursor:pointer;font-weight:700;}\n.infra-head .infra-x:hover{background:#dc2626;}\n.infra-toolbar{display:flex;gap:6px;padding:7px 12px;border-bottom:1px solid #223049;background:#0f172a;flex-wrap:wrap;}\n.infra-tb{flex:1;min-width:96px;background:#1e293b;border:1px solid #334155;color:#cbd5e1;border-radius:7px;padding:6px 8px;font-size:11.5px;font-weight:700;cursor:pointer;}\n.infra-tb:hover{background:#27364d;color:#fff;}\n.infra-tb:disabled{opacity:.45;cursor:default;}\n.infra-tb.active{background:#38bdf8;color:#08131f;border-color:#38bdf8;}\n.infra-filters{padding:8px 12px;border-bottom:1px solid #223049;display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#111a2c;}\n.infra-filters select,.infra-filters input{width:100%;background:#0b1120;border:1px solid #2b3a55;color:#e6edf7;border-radius:6px;padding:5px 7px;font-size:12px;}\n.infra-filters .infra-q{grid-column:1 / span 2;}\n.infra-totals{display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid #223049;background:#0d1424;flex-wrap:wrap;}\n.infra-chip{flex:1;min-width:88px;background:#111c33;border:1px solid #23324c;border-radius:8px;padding:6px 8px;text-align:center;}\n.infra-chip .v{font-size:15px;font-weight:800;color:#7dd3fc;}\n.infra-chip .l{font-size:9.5px;color:#8ea3c0;text-transform:uppercase;letter-spacing:.4px;margin-top:1px;}\n.infra-tablewrap{flex:1;overflow:auto;}\ntable.infra-tbl{width:100%;border-collapse:collapse;font-size:11.5px;}\ntable.infra-tbl thead th{position:sticky;top:0;background:#0f1a2e;color:#9db4d6;font-weight:700;padding:6px 6px;text-align:left;border-bottom:1px solid #2b3a55;white-space:nowrap;cursor:pointer;user-select:none;}\ntable.infra-tbl thead th:hover{color:#38bdf8;}\ntable.infra-tbl tbody td{padding:5px 6px;border-bottom:1px solid #1b2740;vertical-align:top;}\ntable.infra-tbl tbody tr{cursor:pointer;}\ntable.infra-tbl tbody tr:hover{background:#182642;}\ntable.infra-tbl tbody tr.sel{background:#1e3a5f;outline:1px solid #38bdf8;}\n.infra-kmz{font-weight:800;color:#e2e8f0;text-align:center;}\n.infra-badge{display:inline-block;padding:1px 6px;border-radius:9px;font-size:9.5px;font-weight:800;color:#fff;}\n.infra-badge.C{background:#6366f1;}\n.infra-badge.P{background:#0ea5e9;}\n.infra-badge.O{background:#64748b;}\n.infra-est{display:flex;align-items:center;gap:5px;}\n.infra-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}\n.infra-geo{font-size:12px;text-align:center;}\n.infra-km{text-align:right;font-variant-numeric:tabular-nums;font-weight:700;color:#cbd5e1;}\n.infra-foot{padding:6px 12px;border-top:1px solid #223049;background:#0f172a;font-size:10.5px;color:#8ea3c0;border-radius:0 0 12px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}\n.infra-legend{display:flex;gap:8px;flex-wrap:wrap;}\n.infra-legend span{display:flex;align-items:center;gap:3px;}\n.ctrl.infra-active{background:#38bdf8 !important;color:#08131f !important;}\n.infra-editbar{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:1500;background:#0f172a;border:1px solid #38bdf8;border-radius:10px;padding:8px 14px;display:none;gap:10px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,.6);color:#e6edf7;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;}\n.infra-editbar.on{display:flex;}\n.infra-editbar b{color:#38bdf8;}\n.infra-editbar .km{color:#7dd3fc;font-weight:800;}\n.infra-editbar button{border:none;border-radius:7px;padding:6px 10px;font-weight:700;cursor:pointer;font-size:12px;}\n.infra-eb-save{background:#22c55e;color:#04210f;}\n.infra-eb-undo{background:#f59e0b;color:#231600;}\n.infra-eb-cancel{background:#ef4444;color:#fff;}\n.infra-vtx{background:#38bdf8;border:2px solid #fff;border-radius:50%;width:12px;height:12px;box-shadow:0 0 0 1px #0f172a;}\n";
document.head.appendChild(st);
var st2=document.createElement('style'); st2.textContent='#infra-panel{min-width:320px;min-height:240px;}.infra-rz{position:absolute;z-index:7;}.infra-rz-n{top:-3px;left:12px;right:12px;height:8px;cursor:ns-resize;}.infra-rz-s{bottom:-3px;left:12px;right:12px;height:8px;cursor:ns-resize;}.infra-rz-e{right:-3px;top:12px;bottom:12px;width:8px;cursor:ew-resize;}.infra-rz-w{left:-3px;top:12px;bottom:12px;width:8px;cursor:ew-resize;}.infra-rz-ne{top:-4px;right:-4px;width:16px;height:16px;cursor:nesw-resize;}.infra-rz-nw{top:-4px;left:-4px;width:16px;height:16px;cursor:nwse-resize;}.infra-rz-sw{bottom:-4px;left:-4px;width:16px;height:16px;cursor:nesw-resize;}.infra-rz-se{bottom:-1px;right:-1px;width:18px;height:18px;cursor:nwse-resize;color:#64748b;display:flex;align-items:flex-end;justify-content:flex-end;font-size:13px;}.infra-rz-se:hover{color:#38bdf8;}.infra-modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1600;display:none;align-items:center;justify-content:center;}.infra-modal-ov.on{display:flex;}.infra-modal{background:#141b2e;border:1px solid #2b3a55;border-radius:12px;width:540px;max-width:94vw;max-height:90vh;overflow:auto;color:#e6edf7;font-family:Segoe UI,system-ui,sans-serif;box-shadow:0 12px 48px rgba(0,0,0,.6);}.infra-modal h3{margin:0;padding:12px 16px;background:#0f172a;border-bottom:1px solid #2b3a55;color:#38bdf8;font-size:14px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;}.infra-modal h3 .x{cursor:pointer;color:#ef4444;font-weight:700;}.infra-modal .bd{padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;}.infra-fld{display:flex;flex-direction:column;gap:3px;font-size:11px;}.infra-fld.full{grid-column:1 / span 2;}.infra-fld label{color:#8ea3c0;}.infra-fld input,.infra-fld select,.infra-fld textarea{background:#0b1120;border:1px solid #2b3a55;color:#e6edf7;border-radius:6px;padding:6px 8px;font-size:12px;font-family:inherit;}.infra-fld textarea{resize:vertical;min-height:44px;}.infra-modal .ft{padding:10px 16px;border-top:1px solid #2b3a55;display:flex;justify-content:space-between;gap:8px;}.infra-modal .ft button{border:none;border-radius:7px;padding:8px 14px;font-weight:700;cursor:pointer;font-size:12px;}.infra-mb-save{background:#22c55e;color:#04210f;}.infra-mb-del{background:#ef4444;color:#fff;}.infra-mb-cancel{background:#334155;color:#e6edf7;}.infra-ed{cursor:cell;}.infra-ed:hover{outline:1px dashed rgba(56,189,248,.5);outline-offset:-1px;}.infra-cell-ed{width:100%;box-sizing:border-box;background:#0b1120;border:1px solid #38bdf8;color:#e6edf7;border-radius:4px;padding:2px 4px;font-size:11px;font-family:inherit;}'; document.head.appendChild(st2);
var st3=document.createElement('style'); st3.textContent='.infra-arrow{background:none;border:1px solid #2b3a55;color:#8ea3c0;border-radius:4px;cursor:pointer;padding:1px 8px;font-size:11px;line-height:1.4;}.infra-arrow:hover{background:#1e293b;color:#e6edf7;border-color:#38bdf8;}.infra-arrow:disabled{opacity:.35;cursor:default;}.infra-dir-arrow{background:none;border:none;}'; document.head.appendChild(st3);

var INFRA_SEED = {"records":[{"id":1,"kmz":1,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"SAN PEDRO DE LA PAZ","calle":"Av. Pedro Aguirre Cerda","bip":"","km":2.5,"tramo":"entre Diagonal Biobio - Pincheira","estado":"Ejecutado y en Operación","anio":"2005","uf":1096431.0,"monto":43857240000,"conserv":231169471.0,"obs":""},{"id":2,"kmz":2,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Calle O'Higgins","bip":"","km":1.66,"tramo":"entre Av. Paicavi - Av. Prat","estado":"Ejecutado y en Operación","anio":"2006","uf":null,"monto":358200000.0,"conserv":null,"obs":""},{"id":3,"kmz":3,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CHIGUAYANTE","calle":"Av. Manuel Rodriguez","bip":"","km":4.7,"tramo":"entre Santa Sofia - 12 de Octubre","estado":"Ejecutado y en Operación","anio":"2007","uf":1056136.0,"monto":42245440000,"conserv":416477490.0,"obs":"Se conservó el 2019-2020 con un monto total de $354.877.178 + $49.135.352 = $404.012.530 (4,7km de corredor 5,6km de obra)"},{"id":4,"kmz":4,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CONCEPCION","calle":"Av. Paicavi","bip":"","km":2.6,"tramo":"entre Calle Nueva - Av. Los Carrera","estado":"Ejecutado y en Operación","anio":"2007","uf":922227.0,"monto":36889080000,"conserv":148975743.0,"obs":""},{"id":5,"kmz":5,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Prat","bip":"","km":1.8,"tramo":"entre Victor Lamas - Viaducto 21 de Mayo","estado":"Ejecutado y en Operación","anio":"2007","uf":null,"monto":null,"conserv":97340684.21,"obs":"Tramo 6 - Se conservo PRAT y CARRERA DEM el 2022 por un monto de 410.994.000"},{"id":6,"kmz":6,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CORONEL","calle":"Av. Manuel Montt","bip":"30086583-0","km":1.9,"tramo":"entre By Pass -  Calle Colcura","estado":"Ejecutado y en Operación","anio":"2012","uf":347896.0,"monto":13915840000,"conserv":null,"obs":"CPRREDOR TRAMO 1"},{"id":7,"kmz":7,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TALCAHUANO","calle":"Perez Gacitúa","bip":"30086528-0","km":1.0,"tramo":"entre Plaza El Ancla - Calle Hualpén","estado":"Ejecutado pero Sin Dectretar","anio":"2012","uf":173055.3333,"monto":6922213333,"conserv":null,"obs":"Tramo 1\nFalta decretar Tramo"},{"id":8,"kmz":7,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TALCAHUANO","calle":"Jordan Valdivieso","bip":"30086528-0","km":0.35,"tramo":"entre Plaza El Ancla - Calle Hualpén","estado":"Ejecutado pero Sin Dectretar","anio":"2012","uf":173055.3333,"monto":6922213333,"conserv":null,"obs":"Tramo 1\nFalta decretar Tramo"},{"id":9,"kmz":7,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TALCAHUANO","calle":"Av. Blanco Encalada","bip":"30086528-0","km":1.45,"tramo":"entre Plaza El Ancla - Calle Hualpén","estado":"Ejecutado pero Sin Dectretar","anio":"2012","uf":173055.3333,"monto":6922213333,"conserv":null,"obs":"Tramo 1\nFalta decretar Tramo"},{"id":10,"kmz":8,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CORONEL","calle":"Av. Manuel Montt","bip":"30093518-0","km":1.46,"tramo":"entre Calles Colcura - Los Laboreos","estado":"Ejecutado y en Operación","anio":"2013","uf":244744.0,"monto":9789760000,"conserv":null,"obs":"CORREDOR TRAMO 2"},{"id":11,"kmz":9,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"TALCAHUANO","calle":"Av. Colón","bip":"30102135-0","km":4.3,"tramo":"entre Calle Hualpen  - Puente Perales","estado":"Ejecutado y en Operación","anio":"2014","uf":852426.0,"monto":34097040000,"conserv":null,"obs":"Tramo 2"},{"id":12,"kmz":10,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Freire","bip":"","km":1.7,"tramo":"entre Av. Paicavi - Av. Prat","estado":"Ejecutado y en Operación","anio":"2015 Y 2017","uf":null,"monto":null,"conserv":null,"obs":"FRIRE ETAPA 1 (0,9km Anibal Pinto - Prat) EJECUTADO EL 2015  -  FREIRE ETAPA 2 (0,8km Av. Paicaví - Anibal Pinto) EJECUTADO EL 2017"},{"id":13,"kmz":12,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CONCEPCION","calle":"Av. 21 DE Mayo","bip":"30123647-0","km":2.15,"tramo":"entre Av. Alessandri - Viaducto 21 de Mayo","estado":"Ejecutado y en Operación","anio":"2017","uf":467569.0,"monto":18702760000,"conserv":null,"obs":"Tramo 5"},{"id":14,"kmz":13,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"HUALPEN","calle":"Av. Colón","bip":"30123633-2","km":1.1,"tramo":"entre Los Copihues - Av. Alessandri","estado":"Ejecutado y en Operación","anio":"2017","uf":1020363.0,"monto":40814520000,"conserv":null,"obs":"Tramo 4B"},{"id":15,"kmz":14,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"San Martín","bip":"","km":1.8,"tramo":"entre Padre Hurtado - Galvarino","estado":"Ejecutado y en Operación","anio":"2017","uf":null,"monto":null,"conserv":null,"obs":"Falta decretar tramo entre Padre Hurtado y Prat y frente a Hospital (0.35km)"},{"id":16,"kmz":15,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Av. Paicaví; etapa II hacia Norte","bip":"","km":0.6,"tramo":"entre San Martin - Av. Los Carrera","estado":"Ejecutado y en Operación","anio":"2017","uf":null,"monto":null,"conserv":null,"obs":""},{"id":17,"kmz":16,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Av. Paicaví; etapa II hacia Sur","bip":"","km":0.5,"tramo":"entre O'Higgins - Av. Los Carrera","estado":"Ejecutado y en Operación","anio":"2017","uf":null,"monto":null,"conserv":null,"obs":""},{"id":18,"kmz":17,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Av. Los carrera","bip":"","km":2.6,"tramo":"entre Av. Irarrazabal - Av. Paicavi","estado":"Ejecutado y en Operación","anio":"2017","uf":699818.0,"monto":27992720000,"conserv":140603210.5,"obs":"Se conservo PRAT y CARRERA DEM el 2022 por un monto de 410.994.000"},{"id":19,"kmz":18,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Av. Los carrera","bip":"","km":3.2,"tramo":"entre Av. Paicavi - Av. Prat","estado":"Ejecutado y en Operación","anio":"2019","uf":699818.0,"monto":27992720000,"conserv":524328840.3,"obs":"La conservacion el 2017 costo $351.278.735 Se conservo PRAT y CARRERA DEM el 2022 por un monto de $410.994.000"},{"id":20,"kmz":19,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"PENCO","calle":"O'Higgins","bip":"","km":0.17,"tramo":"entre Roberto Ovalle y Talcahuano","estado":"Ejecutado pero Sin Dectretar","anio":"2021","uf":null,"monto":8756049.75,"conserv":8756049.75,"obs":"Fondo Covid - 4494-5-LE23 (ejecucion de PSB)"},{"id":21,"kmz":20,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"PENCO","calle":"Talcahuano","bip":"","km":0.12,"tramo":"entre Ohiggins y Las Heras","estado":"Ejecutado pero Sin Dectretar","anio":"2021","uf":null,"monto":6180741,"conserv":6180741.0,"obs":"Fondo Covid - 4494-5-LE23 (ejecucion de PSB)"},{"id":22,"kmz":21,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"PENCO","calle":"Las Heras","bip":"","km":0.51,"tramo":"entre Talcahuano y Maipú","estado":"Ejecutado pero Sin Dectretar","anio":"2021","uf":null,"monto":26268149.25,"conserv":26268149.25,"obs":"Fondo Covid - 4494-5-LE23 (ejecucion de PSB)"},{"id":23,"kmz":22,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"LOS ÁNGELES","calle":"Villagrán","bip":"2408-30-LE21","km":1.4,"tramo":"entre Tucaple y Ricardo Vicuña","estado":"Ejecutado y en Operación","anio":"2021","uf":null,"monto":37857500.0,"conserv":37857500.0,"obs":"Fondo Covid"},{"id":24,"kmz":23,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"LOS ÁNGELES","calle":"Valdivia","bip":"2408-30-LE22","km":1.4,"tramo":"entre Tucaple y Ricardo Vicuña","estado":"Ejecutado y en Operación","anio":"2021","uf":null,"monto":36194274.0,"conserv":36194274.0,"obs":"Fondo Covid"},{"id":25,"kmz":24,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"LOS ÁNGELES","calle":"Almgro","bip":"","km":1.4,"tramo":"entre Tucaple y Ricardo Vicuña","estado":"Ejecutado y en Operación","anio":"2021","uf":null,"monto":37857500.0,"conserv":37857500.0,"obs":"Fondo Covid"},{"id":26,"kmz":25,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"LOS ÁNGELES","calle":"Mendoza","bip":"","km":1.4,"tramo":"entre Tucaple y Ricardo Vicuña","estado":"Ejecutado y en Operación","anio":"2021","uf":null,"monto":36194274.0,"conserv":36194274.0,"obs":"Fondo Covid"},{"id":27,"kmz":33,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CONCEPCION","calle":"Collao","bip":"30112465-0","km":1.31,"tramo":"entre Plaza Acevedo – Camino Nonguén","estado":"Con Financiamiento - Ejecución","anio":"2030","uf":436794.0,"monto":17471760000,"conserv":null,"obs":""},{"id":28,"kmz":34,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Novoa","bip":"","km":1.39,"tramo":"entre Plaza Acevedo – Camino Nonguén","estado":"Con Financiamiento - Ejecución","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":29,"kmz":35,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CONCEPCION","calle":"Av. Nonguén","bip":"","km":1.44,"tramo":"entre Av. Collao - El Vergel","estado":"Con Financiamiento - Ejecución","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":30,"kmz":36,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"HUALPEN","calle":"Av. Colón","bip":"30123633-1","km":1.8,"tramo":"entre Las Golondrinas - Los Copihues","estado":"Con Financiamiento - Ejecución","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":"Tramo 4A  - Quiebra CVV"},{"id":31,"kmz":37,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"TALCAHUANO","calle":"Av. Colón","bip":"30123633-0","km":1.9,"tramo":"entre Puente Perales - Av. Las Golondrinas","estado":"Con Financiamiento - Ejecución","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":"Tramo 3"},{"id":32,"kmz":38,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CORONEL","calle":"Av. Manuel Montt","bip":"30134246-0","km":4.8,"tramo":"entre Los Laboreos - Pedro Aguirre Cerda","estado":"Con Diseño - Sin Financiamiento","anio":"2030","uf":559854.0,"monto":22394160000,"conserv":null,"obs":"CORREDOR TRAMO 3 MONTO ESTUDIO (EN LICITACION PERO EL TERMINO SE ESTIMA A FINES 2023)"},{"id":33,"kmz":39,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"TALCAHUANO","calle":"Autopista Ccp - Thno","bip":"","km":4.7,"tramo":"entre Puente Perales - El trebol","estado":"Ingresó a Concesiones del MOP","anio":"2028","uf":1049727.0,"monto":41989080000,"conserv":null,"obs":""},{"id":34,"kmz":40,"seccion":"ACTUALES","tipo":"No definido","comuna":"CONCEPCION","calle":"Bulnes","bip":"","km":0.75,"tramo":"Av. Paicaví - Lientur","estado":"Prefactibilidad en desarrollo","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":35,"kmz":41,"seccion":"ACTUALES","tipo":"No definido","comuna":"CONCEPCION","calle":"Camilo Henriquez","bip":"","km":1.57,"tramo":"Lientur - Av. Andalien","estado":"Prefactibilidad en desarrollo","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":36,"kmz":42,"seccion":"ACTUALES","tipo":"No definido","comuna":"CONCEPCION","calle":"Camilo Henriquez","bip":"","km":0.3,"tramo":"Av. Andalien - Ruta 150","estado":"Prefactibilidad en desarrollo","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":37,"kmz":43,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"SAN PEDRO DE LA PAZ","calle":"Ruta 160","bip":"","km":8.3,"tramo":"entre Limite Comunal - Diagonal Biobio","estado":"Ingresó a Concesiones del MOP","anio":"2028","uf":3732363,"monto":149294520000,"conserv":null,"obs":"Ejecutará Concesiones eliminando el KMZ 29"},{"id":38,"kmz":44,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CORONEL","calle":"Ruta 160","bip":"","km":7.74,"tramo":"entre By Pass -  Limite comunal","estado":"Ingresó a Concesiones del MOP","anio":"2028","uf":1889508.0,"monto":75580320000,"conserv":null,"obs":"Ejecutará Concesiones eliminando el KMZ 30"},{"id":39,"kmz":45,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"CONCEPCION","calle":"Ruta 150","bip":"","km":2.54,"tramo":"entre Rotonda Bonilla - Limite comunal","estado":"Ingresó a Concesiones del MOP","anio":"2028","uf":769799.0,"monto":30791960000,"conserv":null,"obs":"Ejecutará Concesiones"},{"id":40,"kmz":46,"seccion":"ACTUALES","tipo":"Corredor Segregado Centralizado, Bidireccional","comuna":"PENCO","calle":"Ruta 150","bip":"","km":5.87,"tramo":"entre Limite Comunal - Roberto Ovalle","estado":"Ingresó a Concesiones del MOP","anio":"2028","uf":1936163,"monto":77446520000,"conserv":null,"obs":"Ejecutará Concesiones"},{"id":41,"kmz":47,"seccion":"ACTUALES","tipo":"No definido","comuna":"CHIGUAYANTE","calle":"8 Oriente a Chiguayante","bip":"","km":3.1,"tramo":"Paso superior 8 Oriente y cruce Santa Sofia","estado":"Con Diseño - Sin Financiamiento","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":42,"kmz":48,"seccion":"ACTUALES","tipo":"No definido","comuna":"CHIGUAYANTE","calle":"8 Oriente a Concepcion","bip":"","km":3.0,"tramo":"Cruce Santa Sofia y Paso Superior 8 Oriente","estado":"Con Diseño - Sin Financiamiento","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":43,"kmz":49,"seccion":"ACTUALES","tipo":"No definido","comuna":"CONCEPCION","calle":"Pedro Valdivia a Concepcion","bip":"","km":2.36,"tramo":"Limite comunal Chiguayante y Victor Lamas","estado":"Prefactibilidad en desarrollo","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":44,"kmz":50,"seccion":"ACTUALES","tipo":"No definido","comuna":"CONCEPCION","calle":"Padre Hurtado y Pedro de Valdivia a Chiguayante","bip":"","km":2.71,"tramo":"Ohiggins y Limite comunal Chiguayante","estado":"Prefactibilidad en desarrollo","anio":"2030","uf":null,"monto":null,"conserv":null,"obs":""},{"id":45,"kmz":51,"seccion":"ACTUALES","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TALCAHUANO","calle":"Calle Colón entre Valdivia y Libertad","bip":"","km":0.6,"tramo":"Ohiggins y Limite comunal Chiguayante","estado":"Ejecutado pero Sin Dectretar","anio":"2025","uf":null,"monto":3499426058,"conserv":null,"obs":""},{"id":46,"kmz":11,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CORONEL","calle":"Av. Manuel Montt","bip":"30123672-0","km":8.86,"tramo":"Pedro Aguirre Cerda - Estero Manco","estado":"Ejecutado. Solo Pavimentos","anio":"2017","uf":617609.0,"monto":24704360000,"conserv":null,"obs":"CORREDOR TRAMO 4 SIN DECRETAR POR NO SACAR ESTACIONAMIENTOS (PAR VIAL PSB) NO ESTA OPERATIVO NO HAY PSB o CORREDOR Llego a ser Ejecutado, pero Solo Pavimentos"},{"id":47,"kmz":26,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TOMÉ","calle":"Ignacio Serrano","bip":"40029067-0","km":0.4,"tramo":"Nogueira hasta Brasil","estado":"Con Diseño - Sin Financiamiento","anio":"2022","uf":705.8824,"monto":28235294.12,"conserv":null,"obs":"No se adjudica la PSB por el consejo municipal. Llego a \"Con Diseño - Sin Financiamiento\""},{"id":48,"kmz":27,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"TOMÉ","calle":"Mariano Egaña","bip":"40029067-0","km":0.45,"tramo":"Brasil hasta Nogueira","estado":"Con Diseño - Sin Financiamiento","anio":"2022","uf":794.1176,"monto":31764705.88,"conserv":null,"obs":"No se adjudica la PSB por el consejo municipal. Llego a \"Con Diseño - Sin Financiamiento\""},{"id":49,"kmz":31,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CHIGUAYANTE","calle":"Camino Chiguayante","bip":"","km":4.3,"tramo":"entre Paso sobre nivel - Sanders","estado":"Ingeniería de detalles","anio":"2023","uf":null,"monto":null,"conserv":null,"obs":""},{"id":50,"kmz":32,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CHIGUAYANTE","calle":"Camino Chiguayante","bip":"","km":4.3,"tramo":"entre Sanders - Paso sobre nivel","estado":"Ingeniería de detalles","anio":"2023","uf":null,"monto":null,"conserv":null,"obs":""},{"id":51,"kmz":29,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"SAN PEDRO DE LA PAZ","calle":"Ruta 160","bip":"","km":4.8,"tramo":"entre Daniel Belmar hasta Los Parques","estado":"Ingeniería de detalles","anio":"2023","uf":null,"monto":null,"conserv":60000000.0,"obs":"MOP Ejecuta"},{"id":52,"kmz":30,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"CORONEL","calle":"Ruta 160","bip":"","km":3.8,"tramo":"entre Limite Comunal - Roberto Ovalle","estado":"Ingeniería de detalles","anio":"2023","uf":null,"monto":null,"conserv":60000000.0,"obs":"MOP Ejecuta"},{"id":53,"kmz":28,"seccion":"RECHAZADAS","tipo":"Via Exclusiva a la derecha. Unidireccional.","comuna":"SAN PEDRO DE LA PAZ","calle":"Puente Llacolén","bip":"","km":2.0,"tramo":"entre Limite Comunal - Roberto Ovalle","estado":"Rechazada","anio":"2023","uf":null,"monto":null,"conserv":60000000.0,"obs":"MOP Ejecuta. Se rechaza por el mismo MTT"}],"geom":{"8":{"name":"8) Corredor Coronel, Etapa II - Tramo Colcura - Los Laboreos","coords":[[-37.003276,-73.161739],[-37.003328,-73.162104],[-37.003177,-73.162316],[-37.003001,-73.162343],[-37.002856,-73.162307],[-37.002681,-73.162011],[-37.002444,-73.161324],[-37.002368,-73.161157],[-37.002207,-73.161009],[-37.001978,-73.160952],[-37.001681,-73.161061],[-37.001193,-73.161341],[-37.000829,-73.161532],[-36.999243,-73.162234],[-36.998622,-73.162456],[-36.998013,-73.162593],[-36.996678,-73.162801],[-36.995135,-73.162934],[-36.991395,-73.163122]],"provisional":false},"6":{"name":"6) Corredor de Coronel, Etapa I","coords":[[-36.974349,-73.16142],[-36.979241,-73.162559],[-36.989639,-73.16317],[-36.991383,-73.163122]],"provisional":false},"9":{"name":"9) Corredor Talcahuano - CCP, tramo 2","coords":[[-36.73201,-73.108668],[-36.732134,-73.108571],[-36.732503,-73.108219],[-36.733623,-73.106921],[-36.734294,-73.106167],[-36.734858,-73.10553],[-36.735587,-73.104647],[-36.736215,-73.10383],[-36.736814,-73.103031],[-36.737494,-73.102169],[-36.738047,-73.101468],[-36.7387,-73.100765],[-36.739358,-73.100111],[-36.740041,-73.09936],[-36.740856,-73.098848],[-36.741626,-73.098416],[-36.742603,-73.097895],[-36.74359,-73.09741],[-36.744402,-73.096988],[-36.744967,-73.096497],[-36.745609,-73.09588],[-36.746209,-73.095296],[-36.747021,-73.094835],[-36.748444,-73.094149],[-36.750969,-73.09309],[-36.752722,-73.092445],[-36.753975,-73.092253],[-36.755231,-73.091945],[-36.756608,-73.091381],[-36.75709,-73.091066],[-36.759424,-73.08978],[-36.761977,-73.088278],[-36.764226,-73.086912],[-36.765672,-73.08606]],"provisional":false},"13":{"name":"13) Corredor Talcahuano - CCP, Tramo 4B","coords":[[-36.798133,-73.085536],[-36.798284,-73.08549],[-36.798794,-73.085401],[-36.799347,-73.085214],[-36.799792,-73.085031],[-36.80036,-73.084678],[-36.800706,-73.084477],[-36.801086,-73.084117],[-36.803009,-73.081844],[-36.804057,-73.080933],[-36.806459,-73.079113]],"provisional":false},"12":{"name":"12) Corredor Talcahuano - CCP, Tramo 5","coords":[[-36.806574,-73.079202],[-36.807353,-73.078516],[-36.808528,-73.077138],[-36.809547,-73.075612],[-36.810817,-73.073136],[-36.811856,-73.071281],[-36.812631,-73.069778],[-36.813724,-73.068506],[-36.814696,-73.067625],[-36.815414,-73.067414],[-36.817711,-73.066975],[-36.818421,-73.066869],[-36.819595,-73.065901],[-36.821042,-73.064723]],"provisional":false},"1":{"name":"1)  Pedro Aguirre Cerda","coords":[[-36.837418,-73.119839],[-36.838017,-73.107994],[-36.83847,-73.102107],[-36.838594,-73.099485],[-36.838822,-73.095659],[-36.838868,-73.094372],[-36.838904,-73.091855]],"provisional":false},"3":{"name":"3) Manuel Rodríguez","coords":[[-36.917987,-73.027959],[-36.920426,-73.027256],[-36.923191,-73.026311],[-36.925928,-73.025092],[-36.928665,-73.023851],[-36.930867,-73.022936],[-36.932661,-73.022085],[-36.934959,-73.021091],[-36.9387,-73.019502],[-36.943473,-73.017404],[-36.95127,-73.014103],[-36.95219,-73.013815],[-36.952891,-73.013662],[-36.956194,-73.012995],[-36.956749,-73.012845],[-36.958293,-73.012021]],"provisional":false},"4":{"name":"4) Paicaví","coords":[[-36.799608,-73.057652],[-36.800834,-73.056737],[-36.801337,-73.056345],[-36.80692,-73.05273],[-36.814013,-73.048148],[-36.820468,-73.043973]],"provisional":false},"2":{"name":"2) Ohiggins","coords":[[-36.831058,-73.058158],[-36.830828,-73.057444],[-36.824184,-73.041643]],"provisional":true},"5":{"name":"5) Calle Prat","coords":[[-36.834437,-73.056099],[-36.835061,-73.056016],[-36.834023,-73.056249],[-36.833148,-73.056849],[-36.827031,-73.060865],[-36.823591,-73.062905],[-36.821103,-73.064642]],"provisional":false},"7":{"name":"7) Corredor Talcahuano - CCP, Tramo 1","coords":[[-36.731998,-73.108737],[-36.731195,-73.109201],[-36.730718,-73.109636],[-36.730099,-73.109962],[-36.729191,-73.109892],[-36.728442,-73.109552],[-36.727472,-73.108744],[-36.725937,-73.10735],[-36.724891,-73.106549],[-36.724371,-73.106483],[-36.724117,-73.10657],[-36.723828,-73.106753],[-36.723476,-73.107118],[-36.723202,-73.107472],[-36.722457,-73.1083],[-36.722349,-73.108453],[-36.722122,-73.108555],[-36.721903,-73.108618],[-36.721708,-73.108659],[-36.721352,-73.108475],[-36.721125,-73.108299],[-36.720709,-73.108135],[-36.720175,-73.108067],[-36.718074,-73.108549],[-36.716953,-73.108718],[-36.716652,-73.108818],[-36.716428,-73.10896],[-36.715353,-73.10929],[-36.714556,-73.110316],[-36.713555,-73.111787],[-36.712641,-73.113114],[-36.712072,-73.113886],[-36.711472,-73.114356],[-36.711226,-73.114433],[-36.71069,-73.114379]],"provisional":false},"10":{"name":"10) Freire","coords":[[-36.829055,-73.05961],[-36.822055,-73.042821]],"provisional":true},"14":{"name":"14) San Martín","coords":[[-36.832565,-73.058836],[-36.825176,-73.040935]],"provisional":true},"15":{"name":"15) Av. Paicaví, dirección Norte","coords":[[-36.825106,-73.04089],[-36.820265,-73.043894]],"provisional":true},"16":{"name":"16) Av. Paicaví, dirección Sur","coords":[[-36.82013,-73.044216],[-36.824138,-73.041656]],"provisional":true},"17":{"name":"17) Av. Carrera Tramo-1","coords":[[-36.814582,-73.030812],[-36.814702,-73.031418],[-36.819826,-73.043814]],"provisional":true},"18":{"name":"18) Av. Carrera Tramo-2","coords":[[-36.820357,-73.044796],[-36.826897,-73.060558]],"provisional":true},"19":{"name":"19) Penco - O'higgins","coords":[[-36.74156,-72.999874],[-36.740973,-72.998113]],"provisional":true},"20":{"name":"20) Penco - Talcahuano","coords":[[-36.7409,-72.998138],[-36.739897,-72.998653]],"provisional":true},"21":{"name":"21) Penco - Heras","coords":[[-36.739876,-72.998661],[-36.73808,-72.993406]],"provisional":true},"22":{"name":"22) Los Angeles - Villagran","coords":[[-37.472662,-72.3483],[-37.466355,-72.348184]],"provisional":true},"23":{"name":"23) Los Angeles - Valdivia","coords":[[-37.46619,-72.352078],[-37.472491,-72.352573]],"provisional":true},"24":{"name":"24) Los Angeles - Almagro","coords":[[-37.466247,-72.349522],[-37.472583,-72.349579]],"provisional":true},"25":{"name":"25) Los Angeles - Mendoza","coords":[[-37.472273,-72.353905],[-37.466259,-72.353663]],"provisional":true}}};

var Infra = window.Infra = {
  records: [], geom: {},
  filters: {seccion:'',tipo:'',estado:'',comuna:'',q:''},
  sort: {key:'kmz', dir:1},
  selectedId: null,
  map: { group:null, lines:{}, shown:false },
  edit: { kmz:null, coords:[], markers:[], line:null }
};

var ESTADO_COLORS = {
  'Ejecutado y en Operación':'#22c55e',
  'Ejecutado pero Sin Dectretar':'#14b8a6',
  'Ejecutado. Solo Pavimentos':'#84cc16',
  'Con Financiamiento - Ejecución':'#3b82f6',
  'Ingresó a Concesiones del MOP':'#6366f1',
  'Con Diseño - Sin Financiamiento':'#f97316',
  'Ingeniería de detalles':'#06b6d4',
  'Prefactibilidad en desarrollo':'#94a3b8',
  'Rechazada':'#ef4444'
};
function estadoColor(e){ return ESTADO_COLORS[e] || '#64748b'; }
function tipoClass(t){ t=(t||'').toLowerCase();
  if(t.indexOf('corredor')>=0) return 'C';
  if(t.indexOf('exclusiva')>=0) return 'P';
  return 'O';
}
function tipoLabel(t){ var c=tipoClass(t); return c==='C'?'Corredor':(c==='P'?'PSB':'N/D'); }
function fmtInt(n){ if(n==null||isNaN(n)) return '—'; return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
function fmtKm(n){ if(n==null||isNaN(n)) return '—'; return n.toFixed(2).replace('.',','); }
function fmtMM(n){ if(!n||isNaN(n)) return '$0'; return '$'+fmtInt(n/1e6)+' MM'; }
function geomState(kmz){ var g=Infra.geom[String(kmz)]; if(!g||!g.coords||!g.coords.length) return 'none'; return g.provisional?'prov':'ok'; }
function geomIcon(s){ return s==='ok'?'●':(s==='prov'?'◐':'○'); }
function geomColor(s){ return s==='ok'?'#22c55e':(s==='prov'?'#f59e0b':'#475569'); }

function loadSeed(){ Infra.records = INFRA_SEED.records.slice(); Infra.geom = INFRA_SEED.geom || {}; }
function uniq(arr){ return arr.filter(function(v,i){return arr.indexOf(v)===i;}); }
function esc(s){ s=(s==null?'':String(s)); return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function notify(msg){ if(typeof window.showCopyNotification==='function') window.showCopyNotification(msg); else console.log('[Infra] '+msg); }

/* ---- persistencia geometria (localStorage) ---- */
var LS_KEY='infra_geom_overrides_v1';
function loadOverrides(){
  try{ var o=JSON.parse(localStorage.getItem(LS_KEY)||'{}'); Object.keys(o).forEach(function(k){ Infra.geom[k]=o[k]; }); }catch(e){}
}
function saveOverride(kmz, obj){
  Infra.geom[String(kmz)]=obj;
  try{ var o=JSON.parse(localStorage.getItem(LS_KEY)||'{}'); o[String(kmz)]=obj; localStorage.setItem(LS_KEY,JSON.stringify(o)); }catch(e){}
}
function haversine(a,b){ var R=6371, toR=Math.PI/180;
  var dLat=(b[0]-a[0])*toR, dLon=(b[1]-a[1])*toR, la1=a[0]*toR, la2=b[0]*toR;
  var h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.sqrt(h));
}
function kmFromCoords(c){ if(!c||c.length<2) return 0; var t=0; for(var i=1;i<c.length;i++) t+=haversine(c[i-1],c[i]); return t; }
function recForKmz(kmz){ return Infra.records.filter(function(r){return r.kmz===kmz;}); }
function firstRec(kmz){ return recForKmz(kmz)[0]||null; }

function filtered(){
  var f=Infra.filters, q=(f.q||'').toLowerCase().trim();
  var out=Infra.records.filter(function(r){
    if(f.seccion && r.seccion!==f.seccion) return false;
    if(f.tipo && tipoClass(r.tipo)!==f.tipo) return false;
    if(f.estado && r.estado!==f.estado) return false;
    if(f.comuna && r.comuna!==f.comuna) return false;
    if(q){ var hay=[r.calle,r.tramo,r.obs,r.comuna,String(r.kmz),r.estado].join(' ').toLowerCase(); if(hay.indexOf(q)<0) return false; }
    return true;
  });
  var s=Infra.sort, k=s.key, d=s.dir;
  if(k){ out.sort(function(a,b){ var va=a[k], vb=b[k];
    if(k==='km'){ va=va==null?-1:va; vb=vb==null?-1:vb; }
    if(typeof va==='string') va=va.toLowerCase(); if(typeof vb==='string') vb=vb.toLowerCase();
    if(va<vb) return -1*d; if(va>vb) return 1*d; return (a.kmz-b.kmz);
  }); }  // k=null → orden manual (arreglo tal cual, para los botones ▲▼)
  return out;
}
function buildFilterOptions(){
  var recs=Infra.records;
  var estados=uniq(recs.map(function(r){return r.estado;})).filter(Boolean).sort();
  var comunas=uniq(recs.map(function(r){return r.comuna;})).filter(Boolean).sort();
  document.getElementById('infra-f-estado').innerHTML='<option value="">Todos los estados</option>'+estados.map(function(v){return '<option'+(v===Infra.filters.estado?' selected':'')+'>'+esc(v)+'</option>';}).join('');
  document.getElementById('infra-f-comuna').innerHTML='<option value="">Todas las comunas</option>'+comunas.map(function(v){return '<option'+(v===Infra.filters.comuna?' selected':'')+'>'+esc(v)+'</option>';}).join('');
}
function render(){
  backfillSentido();
  var rows=filtered(), km=0,kmTraz=0,monto=0,cons=0;
  rows.forEach(function(r){
    if(r.km)km+=r.km; if(r.monto)monto+=r.monto; if(r.conserv)cons+=r.conserv;
    var g=Infra.geom[String(r.kmz)];
    if(g&&g.coords&&g.coords.length>=2) kmTraz+=kmFromCoords(g.coords);
  });
  document.getElementById('infra-t-n').textContent=rows.length;
  document.getElementById('infra-t-km-hoja').textContent=fmtKm(km);
  document.getElementById('infra-t-km-traz').textContent=fmtKm(kmTraz);
  document.getElementById('infra-t-monto').textContent=fmtMM(monto);
  document.getElementById('infra-t-cons').textContent=fmtMM(cons);
  var html=rows.map(function(r){
    var gc=geomState(r.kmz), sel=(r.id===Infra.selectedId)?' class="sel"':'';
    var g=Infra.geom[String(r.kmz)]; var kmt=(g&&g.coords&&g.coords.length>=2)?kmFromCoords(g.coords):null;
    return '<tr'+sel+' data-id="'+r.id+'">'+
      '<td class="infra-kmz">'+r.kmz+'</td>'+
      '<td class="infra-ed" data-ed="tipo"><span class="infra-badge '+tipoClass(r.tipo)+'" title="'+esc(r.tipo)+' — doble clic para editar">'+tipoLabel(r.tipo)+'</span></td>'+
      '<td class="infra-ed" data-ed="sentido" style="text-align:center;font-weight:700;color:#94a3b8" title="Sentido (doble clic)">'+esc(r.sentido||'—')+'</td>'+
      '<td class="infra-ed" data-ed="comuna">'+esc(r.comuna)+'</td>'+
      '<td class="infra-ed" data-ed="calle" title="'+esc(r.tramo)+'">'+esc(r.calle)+'</td>'+
      '<td class="infra-ed" data-ed="tramo" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#94a3b8" title="'+esc(r.tramo)+' — doble clic para editar">'+esc(r.tramo||'—')+'</td>'+
      '<td class="infra-km infra-ed" data-ed="km">'+fmtKm(r.km)+'</td>'+
      '<td class="infra-km" style="color:'+geomColor(gc)+'" title="Km del trazado">'+(kmt!=null?fmtKm(kmt):'—')+'</td>'+
      '<td class="infra-ed" data-ed="estado"><span class="infra-est"><span class="infra-dot" style="background:'+estadoColor(r.estado)+'"></span>'+esc(r.estado)+'</span></td>'+
      '<td class="infra-ed" data-ed="anio" style="text-align:center">'+esc(r.anio)+'</td>'+
      '<td class="infra-geo" style="color:'+geomColor(gc)+'" title="'+(gc==='ok'?'Geometría OK':(gc==='prov'?'Geometría provisoria':'Sin geometría'))+'">'+geomIcon(gc)+'</td>'+
    '</tr>';
  }).join('');
  document.getElementById('infra-tbody').innerHTML=html || '<tr><td colspan="11" style="text-align:center;padding:20px;color:#64748b">Sin resultados</td></tr>';
  var info=document.getElementById('infra-foot-info'); if(info) info.textContent=rows.length+' de '+Infra.records.length+' tramos';
}
Infra.render=render;

var _editingCell=false;
function startCellEdit(td){
  if(_editingCell) return;
  var tr=td.closest('tr'); if(!tr) return; var id=parseInt(tr.dataset.id,10); var field=td.dataset.ed;
  var rec=Infra.records.filter(function(x){return x.id===id;})[0]; if(!rec) return;
  _editingCell=true;
  var cur=rec[field]; if(cur==null) cur='';
  var ctrl;
  if(field==='estado'||field==='tipo'||field==='sentido'){
    var opts=(field==='estado')?estadoOpts():(field==='tipo'?TIPO_OPTS:['','Uni','Bi']);
    ctrl=document.createElement('select'); ctrl.className='infra-cell-ed';
    opts.forEach(function(o){ var op=document.createElement('option'); op.textContent=o; if(String(o)===String(cur)) op.selected=true; ctrl.appendChild(op); });
  } else {
    ctrl=document.createElement('input'); ctrl.className='infra-cell-ed'; ctrl.type='text';
    ctrl.value=(field==='km')?String(cur).replace('.',','):String(cur);
  }
  td.innerHTML=''; td.appendChild(ctrl); ctrl.focus(); if(ctrl.select) try{ctrl.select();}catch(e){}
  var done=false;
  function commit(){ if(done) return; done=true; _editingCell=false;
    var v=ctrl.value;
    if(field==='km') rec.km=numOrNull(v); else rec[field]=v;
    persistRecords(); buildFilterOptions(); render();
    if(Infra.map && Infra.map.shown) drawLines();
    notify('KMZ '+rec.kmz+' · '+field+' actualizado');
  }
  function cancel(){ if(done) return; done=true; _editingCell=false; render(); }
  ctrl.addEventListener('blur', commit);
  ctrl.addEventListener('keydown', function(e){
    if(e.key==='Enter'){ e.preventDefault(); ctrl.blur(); }
    else if(e.key==='Escape'){ e.preventDefault(); ctrl.removeEventListener('blur',commit); cancel(); }
  });
  if(ctrl.tagName==='SELECT') ctrl.addEventListener('change', function(){ ctrl.blur(); });
}
function selectRow(id){ Infra.selectedId=(Infra.selectedId===id?null:id); render(); if(typeof Infra.onSelect==='function') Infra.onSelect(Infra.selectedId); }

var _rz=null;
function setupResize(panel){
  ['n','s','e','w','ne','nw','se','sw'].forEach(function(d){
    var h=document.createElement('div'); h.className='infra-rz infra-rz-'+d;
    if(d==='se'){ h.innerHTML='\u25E2'; h.title='Estirar'; }
    h.addEventListener('mousedown',function(e){ _startResize(e,panel,d); });
    panel.appendChild(h);
  });
  document.addEventListener('mousemove',_onResizeMove);
  document.addEventListener('mouseup',function(){ _rz=null; });
}
function _startResize(e,panel,dir){
  var r=panel.getBoundingClientRect();
  panel.style.left=r.left+'px'; panel.style.top=r.top+'px'; panel.style.right='auto'; panel.style.bottom='auto';
  _rz={dir:dir,sx:e.clientX,sy:e.clientY,l:r.left,t:r.top,w:r.width,h:r.height};
  e.preventDefault(); e.stopPropagation();
}
function _onResizeMove(e){
  if(!_rz) return; var p=document.getElementById('infra-panel'); if(!p) return;
  var d=_rz.dir, dx=e.clientX-_rz.sx, dy=e.clientY-_rz.sy;
  var minW=320,minH=240, maxW=window.innerWidth-8, maxH=window.innerHeight-8;
  var l=_rz.l,t=_rz.t,w=_rz.w,h=_rz.h;
  if(d.indexOf('e')>=0) w=Math.min(maxW,Math.max(minW,_rz.w+dx));
  if(d.indexOf('s')>=0) h=Math.min(maxH,Math.max(minH,_rz.h+dy));
  if(d.indexOf('w')>=0){ w=Math.min(maxW,Math.max(minW,_rz.w-dx)); l=_rz.l+(_rz.w-w); }
  if(d.indexOf('n')>=0){ h=Math.min(maxH,Math.max(minH,_rz.h-dy)); t=_rz.t+(_rz.h-h); }
  p.style.width=w+'px'; p.style.height=h+'px'; p.style.left=l+'px'; p.style.top=t+'px';
}
function resetPanel(p){ p=p||document.getElementById('infra-panel'); if(!p) return; p.style.left='auto'; p.style.right='12px'; p.style.top='70px'; p.style.bottom='auto'; p.style.width='470px'; p.style.height='calc(100vh - 90px)'; }
function recoverPanel(p){
  var r=p.getBoundingClientRect();
  var lost = isNaN(r.left) || r.width<40 || r.height<40 || r.left>window.innerWidth-80 || r.right<80 || r.top>window.innerHeight-40 || r.bottom<40;
  if(lost) resetPanel(p);
}
Infra.resetPanel=function(){ resetPanel(); };
function makeDraggable(panel, handle){
  var ox=0,oy=0,dragging=false;
  handle.addEventListener('mousedown',function(e){ if(e.target.id==='infra-close') return;
    dragging=true; var r=panel.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; panel.style.right='auto'; e.preventDefault(); });
  document.addEventListener('mousemove',function(e){ if(!dragging) return; panel.style.left=(e.clientX-ox)+'px'; panel.style.top=(e.clientY-oy)+'px'; });
  document.addEventListener('mouseup',function(){dragging=false;});
}
function buildPanel(){
  if(document.getElementById('infra-panel')) return;
  var p=document.createElement('div'); p.id='infra-panel';
  p.innerHTML=
    '<div class="infra-head" id="infra-head"><b>🛣️ Vías Exclusivas / Infraestructura</b><button class="infra-x" id="infra-close">✕</button></div>'+
    '<div class="infra-toolbar">'+
      '<button class="infra-tb" id="infra-tb-map">🗺️ Ver en mapa</button>'+
      '<button class="infra-tb" id="infra-tb-import">📥 Importar KMZ</button>'+
      '<button class="infra-tb" id="infra-tb-edit" disabled>✏️ Editar geometría</button>'+
      '<button class="infra-tb" id="infra-tb-kmz">⬇️ KMZ</button>'+
      '<button class="infra-tb" id="infra-tb-xls">⬇️ Tabla</button>'+
      '<button class="infra-tb" id="infra-tb-editdata" disabled>✏️ Datos</button>'+
      '<button class="infra-tb" id="infra-tb-copy" disabled>📋 Copiar</button>'+
      '<button class="infra-tb" id="infra-tb-group" disabled>🔗 Agrupar</button>'+
      '<button class="infra-tb" id="infra-tb-new">➕ Nuevo</button>'+
      '<button class="infra-tb" id="infra-tb-json">💾 JSON</button>'+
      '<input type="file" id="infra-file" accept=".kmz,.kml" style="display:none">'+
    '</div>'+
    '<div class="infra-filters">'+
      '<select id="infra-f-seccion"><option value="">Todas las secciones</option><option value="ACTUALES">Actuales / Proyectadas</option><option value="RECHAZADAS">Rechazadas</option></select>'+
      '<select id="infra-f-tipo"><option value="">Todos los tipos</option><option value="C">Corredor</option><option value="P">PSB (Vía exclusiva)</option><option value="O">No definido</option></select>'+
      '<select id="infra-f-estado"></select>'+
      '<select id="infra-f-comuna"></select>'+
      '<input class="infra-q" id="infra-f-q" type="text" placeholder="Buscar calle, tramo, observación...">'+
    '</div>'+
    '<div class="infra-totals">'+
      '<div class="infra-chip"><div class="v" id="infra-t-n">0</div><div class="l">Tramos</div></div>'+
      '<div class="infra-chip"><div class="v" id="infra-t-km-hoja">0</div><div class="l">Km hoja</div></div>'+
      '<div class="infra-chip"><div class="v" id="infra-t-km-traz" style="color:#22c55e">0</div><div class="l">Km traz.</div></div>'+
      '<div class="infra-chip"><div class="v" id="infra-t-monto">$0</div><div class="l">Inversión MM$</div></div>'+
      '<div class="infra-chip"><div class="v" id="infra-t-cons">$0</div><div class="l">Conserv. MM$</div></div>'+
      '<button id="infra-tb-dash" title="Resumen / dashboard" style="flex:0 0 auto;background:#1e293b;border:1px solid #334155;color:#cbd5e1;border-radius:8px;padding:0 12px;font-size:16px;cursor:pointer">📊</button>'+
    '</div>'+
    '<div class="infra-tablewrap"><table class="infra-tbl"><thead><tr>'+
      '<th data-k="kmz">KMZ</th><th data-k="tipo">Tipo</th><th data-k="sentido" title="Sentido (Uni/Bi)">Sent.</th><th data-k="comuna">Comuna</th><th data-k="calle">Calle</th><th data-k="tramo">Tramo</th><th data-k="km">Km hoja</th><th title="Km calculado del trazado (no se descarga aquí)">Km traz.</th><th data-k="estado">Estado</th><th data-k="anio">Año</th><th data-k="kmz" title="Geometría">Geo</th>'+
    '</tr></thead><tbody id="infra-tbody"></tbody></table></div>'+
    '<div class="infra-foot"><div class="infra-legend">'+
      '<span><span class="infra-geo" style="color:#22c55e">●</span>OK</span>'+
      '<span><span class="infra-geo" style="color:#f59e0b">◐</span>Provisoria</span>'+
      '<span><span class="infra-geo" style="color:#475569">○</span>Sin geom.</span>'+
      '<span style="margin:0 6px;color:#4a5a7a">|</span>'+
      '<button class="infra-arrow" id="infra-tb-up" disabled title="Subir tramo">▲</button>'+
      '<button class="infra-arrow" id="infra-tb-down" disabled title="Bajar tramo">▼</button>'+
    '</div><span id="infra-foot-info"></span></div>';
  document.body.appendChild(p);

  document.getElementById('infra-close').onclick=Infra.close;
  document.getElementById('infra-f-seccion').onchange=function(){Infra.filters.seccion=this.value;render();};
  document.getElementById('infra-f-tipo').onchange=function(){Infra.filters.tipo=this.value;render();};
  document.getElementById('infra-f-estado').onchange=function(){Infra.filters.estado=this.value;render();};
  document.getElementById('infra-f-comuna').onchange=function(){Infra.filters.comuna=this.value;render();};
  document.getElementById('infra-f-q').oninput=function(){Infra.filters.q=this.value;render();};
  document.getElementById('infra-tbody').addEventListener('click',function(e){ var tr=e.target.closest('tr'); if(!tr||!tr.dataset.id) return; selectRow(parseInt(tr.dataset.id,10)); });
  document.getElementById('infra-tbody').addEventListener('dblclick',function(e){ var td=e.target.closest('td.infra-ed'); if(!td) return; e.stopPropagation(); startCellEdit(td); });
  Array.prototype.forEach.call(p.querySelectorAll('thead th'),function(th){ th.onclick=function(){ var k=th.dataset.k; if(!k) return; if(Infra.sort.key===k) Infra.sort.dir*=-1; else {Infra.sort.key=k;Infra.sort.dir=1;} render(); }; });
  document.getElementById('infra-tb-map').onclick=function(){ toggleMap(); };
  document.getElementById('infra-tb-import').onclick=function(){ document.getElementById('infra-file').click(); };
  document.getElementById('infra-file').onchange=function(e){ if(e.target.files[0]) importKmz(e.target.files[0]); e.target.value=''; };
  document.getElementById('infra-tb-edit').onclick=function(){ if(Infra.selectedId) startEdit(); };
  document.getElementById('infra-tb-kmz').onclick=function(){ exportKmz(); };
  document.getElementById('infra-tb-xls').onclick=function(){ exportTabla(); };
  document.getElementById('infra-tb-editdata').onclick=function(){ if(Infra.selectedId){ var r=Infra.records.filter(function(x){return x.id===Infra.selectedId;})[0]; if(r) openEditForm(r); } };
  document.getElementById('infra-tb-new').onclick=function(){ openEditForm(null); };
  document.getElementById('infra-tb-json').onclick=function(){ exportDataJson(); };
  document.getElementById('infra-tb-dash').onclick=function(){ showResumen(); };
  document.getElementById('infra-tb-copy').onclick=function(){ copyRecord(); };
  document.getElementById('infra-tb-group').onclick=function(){ agruparSel(); };
  document.getElementById('infra-tb-up').onclick=function(){ moveUp(); };
  document.getElementById('infra-tb-down').onclick=function(){ moveDown(); };
  makeDraggable(p, document.getElementById('infra-head'));
  setupResize(p);
  document.getElementById('infra-head').addEventListener('dblclick',function(){ resetPanel(p); });
}
Infra.open=function(){ buildPanel(); buildFilterOptions(); render(); var _p=document.getElementById('infra-panel'); _p.classList.add('open'); recoverPanel(_p); var b=document.getElementById('btn-infra'); if(b) b.classList.add('infra-active'); };
Infra.close=function(){ var p=document.getElementById('infra-panel'); if(p) p.classList.remove('open'); var b=document.getElementById('btn-infra'); if(b) b.classList.remove('infra-active'); };
Infra.toggle=function(){ var p=document.getElementById('infra-panel'); if(p && p.classList.contains('open')) Infra.close(); else Infra.open(); };

/* ================= FASE 2: geometria ================= */
function lineStyle(kmz){
  var r=firstRec(kmz)||{}, g=Infra.geom[String(kmz)]||{};
  var st={color:estadoColor(r.estado), weight:(tipoClass(r.tipo)==='C')?6:4, opacity:.9};
  if(g.provisional){ st.dashArray='6,8'; st.opacity=.7; }
  return st;
}
function linePopup(kmz){
  var recs=recForKmz(kmz); if(!recs.length) return 'KMZ '+kmz;
  var g=Infra.geom[String(kmz)]||{}, kmGeo=g.coords?kmFromCoords(g.coords):null;
  var h='<div style="font-family:Segoe UI,sans-serif;min-width:210px">';
  h+='<div style="font-weight:800;color:#0ea5e9;font-size:13px;margin-bottom:3px">KMZ '+kmz+' · '+esc(recs[0].calle)+'</div>';
  h+='<div style="font-size:11px;color:#334155">'+esc(recs[0].comuna)+' — '+esc(recs[0].tipo)+'</div>';
  h+='<div style="font-size:11px;margin:4px 0"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+estadoColor(recs[0].estado)+';margin-right:4px"></span>'+esc(recs[0].estado)+'</div>';
  h+='<table style="font-size:11px;border-collapse:collapse">';
  h+='<tr><td style="color:#64748b;padding-right:8px">Km hoja</td><td style="font-weight:700">'+recs.map(function(r){return fmtKm(r.km);}).join(' + ')+'</td></tr>';
  if(kmGeo!=null) h+='<tr><td style="color:#64748b">Km trazado</td><td style="font-weight:700;color:'+(g.provisional?'#f59e0b':'#16a34a')+'">'+fmtKm(kmGeo)+(g.provisional?' (prov.)':'')+'</td></tr>';
  h+='</table>';
  if(recs[0].tramo) h+='<div style="font-size:10.5px;color:#475569;margin-top:4px">'+esc(recs[0].tramo)+'</div>';
  if(recs.length>1) h+='<div style="font-size:10px;color:#94a3b8;margin-top:3px">('+recs.length+' subtramos comparten esta geometría)</div>';
  return h+'</div>';
}
function drawLines(){
  if(typeof L==='undefined'||!window.App||!App.map) return;
  if(!Infra.map.group){ Infra.map.group=L.featureGroup().addTo(App.map); }
  Infra.map.group.clearLayers(); Infra.map.lines={};
  var seen={};
  Infra.records.forEach(function(r){
    var kmz=r.kmz; if(seen[kmz]) return; seen[kmz]=1;
    var g=Infra.geom[String(kmz)]; if(!g||!g.coords||g.coords.length<2) return;
    var pl=L.polyline(g.coords, lineStyle(kmz)); pl.bindPopup(linePopup(kmz));
    pl.on('click',function(){ var fr=firstRec(kmz); if(fr){ Infra.selectedId=fr.id; render(); if(!document.getElementById('infra-panel').classList.contains('open')) Infra.open(); if(typeof Infra.onSelect==='function') Infra.onSelect(fr.id); } });
    pl.addTo(Infra.map.group); Infra.map.lines[kmz]=pl;
  });
}
/* ---- Flechas de sentido sobre el tramo seleccionado ---- */
function clearArrows(){ if(Infra.map.arrows) Infra.map.arrows.clearLayers(); }
function addArrowMarker(ll, ang, bi){
  var glyph = bi ? '◀ ▶' : '▶';
  var html='<div style="transform:rotate('+ang+'deg);font-size:14px;line-height:1;color:#0f172a;'+
    'text-shadow:0 0 2px #fff,0 0 2px #fff,0 0 2px #fff;font-weight:900;white-space:nowrap">'+glyph+'</div>';
  var ic=L.divIcon({className:'infra-dir-arrow', html:html, iconSize:[20,20], iconAnchor:[10,10]});
  L.marker(ll,{icon:ic, interactive:false, keyboard:false, pane:'markerPane'}).addTo(Infra.map.arrows);
}
function drawArrows(coords, sentido){
  clearArrows();
  if(!coords||coords.length<2||typeof L==='undefined'||!window.App||!App.map) return;
  if(!Infra.map.arrows){ Infra.map.arrows=L.layerGroup().addTo(App.map); }
  if(!Infra._arrowHook){ Infra._arrowHook=true; App.map.on('zoomend moveend', refreshArrows); }
  var bi = String(sentido||'').toLowerCase().indexOf('bi')===0;
  var pts=coords.map(function(c){ return App.map.latLngToContainerPoint(L.latLng(c[0],c[1])); });
  var spacing=95, acc=0, next=spacing/2;
  for(var i=0;i<pts.length-1;i++){
    var a=pts[i], b=pts[i+1], dx=b.x-a.x, dy=b.y-a.y, seg=Math.sqrt(dx*dx+dy*dy);
    if(seg<1){ continue; }
    var ang=Math.atan2(dy,dx)*180/Math.PI;
    while(next<=acc+seg){
      var t=(next-acc)/seg, cx=a.x+dx*t, cy=a.y+dy*t;
      addArrowMarker(App.map.containerPointToLatLng(L.point(cx,cy)), ang, bi);
      next+=spacing;
    }
    acc+=seg;
  }
}
function refreshArrows(){
  var k=Infra.map.arrowKmz;
  if(k==null||!Infra.map.shown){ clearArrows(); return; }
  var g=Infra.geom[String(k)]; if(!g||!g.coords){ clearArrows(); return; }
  var r=firstRec(k)||{}; drawArrows(g.coords, r.sentido);
}
function toggleMap(){
  if(Infra.map.shown){ if(Infra.map.group) Infra.map.group.clearLayers(); clearArrows(); Infra.map.arrowKmz=null; Infra.map.shown=false; document.getElementById('infra-tb-map').classList.remove('active'); }
  else{ drawLines(); Infra.map.shown=true; document.getElementById('infra-tb-map').classList.add('active');
    if(Infra.map.group && Infra.map.group.getLayers().length){ try{ App.map.fitBounds(Infra.map.group.getBounds().pad(0.08)); }catch(e){} } }
}
Infra.toggleMap=toggleMap;
Infra.onSelect=function(id){
  var editBtn=document.getElementById('infra-tb-edit'); if(editBtn) editBtn.disabled=!id;
  var edB=document.getElementById('infra-tb-editdata'); if(edB) edB.disabled=!id;
  var cpB=document.getElementById('infra-tb-copy'); if(cpB) cpB.disabled=!id;
  var grB=document.getElementById('infra-tb-group'); if(grB) grB.disabled=!id;
  updateMoveBtns();
  if(!Infra.map.shown) return;
  Object.keys(Infra.map.lines).forEach(function(k){ Infra.map.lines[k].setStyle(lineStyle(parseInt(k,10))); });
  clearArrows(); Infra.map.arrowKmz=null;
  if(!id) return;
  var r=Infra.records.filter(function(x){return x.id===id;})[0]; if(!r) return;
  var pl=Infra.map.lines[r.kmz];
  if(pl){ pl.setStyle({color:'#fde047',weight:8,opacity:1,dashArray:null}); pl.bringToFront(); try{ App.map.fitBounds(pl.getBounds().pad(0.25)); }catch(e){} pl.openPopup();
    var g=Infra.geom[String(r.kmz)]; if(g&&g.coords){ Infra.map.arrowKmz=r.kmz; drawArrows(g.coords, r.sentido); } }
};

/* ---- Importar KMZ ---- */
function importKmz(file){
  var name=(file.name||'').toLowerCase(), rd=new FileReader();
  function handleKml(kmlText){
    try{
      var doc=new DOMParser().parseFromString(kmlText,'text/xml');
      var pms=doc.getElementsByTagName('Placemark'), added=0, noNum=0;
      for(var i=0;i<pms.length;i++){
        var nmEl=pms[i].getElementsByTagName('name')[0]; if(!nmEl) continue;
        var nm=nmEl.textContent.trim(), m=nm.match(/^\s*(\d+)/); if(!m){ noNum++; continue; }
        var kmz=parseInt(m[1],10), ce=pms[i].getElementsByTagName('coordinates')[0]; if(!ce) continue;
        var pts=ce.textContent.trim().split(/\s+/).map(function(t){var p=t.split(',');return [parseFloat(p[1]),parseFloat(p[0])];}).filter(function(c){return !isNaN(c[0])&&!isNaN(c[1]);});
        if(pts.length<2) continue;
        saveOverride(kmz,{name:nm,coords:pts,provisional:pts.length<=3,source:'import'}); added++;
      }
      notify('KMZ importado: '+added+' geometrías'+(noNum?(' · '+noNum+' sin nº omitidas'):''));
      if(Infra.map.shown) drawLines(); render();
    }catch(err){ notify('Error leyendo KMZ: '+err.message); }
  }
  if(name.endsWith('.kml')){ rd.onload=function(ev){ handleKml(ev.target.result); }; rd.readAsText(file,'utf-8'); }
  else{ rd.onload=function(ev){
      if(typeof JSZip==='undefined'){ notify('JSZip no disponible'); return; }
      JSZip.loadAsync(ev.target.result).then(function(zip){
        var kmlFile=null; zip.forEach(function(path,entry){ if(!kmlFile && path.toLowerCase().endsWith('.kml')) kmlFile=entry; });
        if(!kmlFile){ notify('No hay .kml dentro del KMZ'); return; }
        return kmlFile.async('string').then(handleKml);
      }).catch(function(err){ notify('Error KMZ: '+err.message); });
    }; rd.readAsArrayBuffer(file); }
}

/* ---- Editor de geometria ---- */
function ensureEditBar(){
  if(document.getElementById('infra-editbar')) return;
  var b=document.createElement('div'); b.id='infra-editbar'; b.className='infra-editbar';
  b.innerHTML='<b id="infra-eb-title">Editando</b> · Clic=agregar · arrastrar=mover · clic-der=borrar pto · <span>Km: <span class="km" id="infra-eb-km">0,00</span></span>'+
    '<button class="infra-eb-undo" id="infra-eb-undo" title="Deshacer (Ctrl+Z)">↩︎ Deshacer</button><button class="infra-eb-save" id="infra-eb-save">💾 Guardar</button><button class="infra-eb-undo" id="infra-eb-del" style="background:#7c3aed;color:#fff">🗑 Geom</button><button class="infra-eb-cancel" id="infra-eb-cancel">✕ Cancelar</button>';
  document.body.appendChild(b);
  document.getElementById('infra-eb-undo').onclick=undoEdit;
  document.getElementById('infra-eb-save').onclick=finishEdit;
  document.getElementById('infra-eb-cancel').onclick=cancelEdit;
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey) && (e.key==='z'||e.key==='Z')){
      var bar=document.getElementById('infra-editbar');
      if(bar && bar.classList.contains('on')){ e.preventDefault(); e.stopPropagation(); undoEdit(); }
    }
  }, true);
  document.getElementById('infra-eb-del').onclick=deleteEditGeom;
  var kmSpan=document.getElementById('infra-eb-km');
  if(kmSpan){ kmSpan.style.cursor='pointer'; kmSpan.style.textDecoration='underline dotted'; kmSpan.title='Clic para fijar el km (ajusta el largo de la línea)';
    kmSpan.addEventListener('click', function(){
      if(Infra.edit.coords.length<2){ notify('Traza al menos 2 puntos primero'); return; }
      var span=kmSpan, parent=span.parentNode;
      var inp=document.createElement('input'); inp.type='text'; inp.className='infra-cell-ed'; inp.style.width='58px'; inp.value=fmtKm(kmFromCoords(Infra.edit.coords));
      parent.replaceChild(inp, span); inp.focus(); try{inp.select();}catch(e){}
      var done=false;
      function fin(ok){ if(done) return; done=true; if(ok){ var v=numOrNull(inp.value); if(v&&v>0) scaleEditToKm(v); else notify('Valor inválido'); } if(inp.parentNode) inp.parentNode.replaceChild(span, inp); refreshEditLine(); }
      inp.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); fin(true); } else if(e.key==='Escape'){ e.preventDefault(); fin(false); } });
      inp.addEventListener('blur', function(){ fin(true); });
    });
  }
}
function vtxIcon(){ return L.divIcon({className:'', html:'<div class="infra-vtx"></div>', iconSize:[12,12], iconAnchor:[6,6]}); }
function _bearing(a,b){ var toR=Math.PI/180,toD=180/Math.PI; var la1=a[0]*toR,la2=b[0]*toR,dLon=(b[1]-a[1])*toR; var y=Math.sin(dLon)*Math.cos(la2); var x=Math.cos(la1)*Math.sin(la2)-Math.sin(la1)*Math.cos(la2)*Math.cos(dLon); return Math.atan2(y,x)*toD; }
function _dest(a,brgDeg,distKm){ var R=6371,toR=Math.PI/180,toD=180/Math.PI; var d=distKm/R,b=brgDeg*toR; var la1=a[0]*toR,lo1=a[1]*toR; var la2=Math.asin(Math.sin(la1)*Math.cos(d)+Math.cos(la1)*Math.sin(d)*Math.cos(b)); var lo2=lo1+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(la1),Math.cos(d)-Math.sin(la1)*Math.sin(la2)); return [la2*toD, lo2*toD]; }
function scaleEditToKm(target){
  var c=Infra.edit.coords; if(c.length<2){ notify('Traza al menos 2 puntos primero'); return; }
  var cur=kmFromCoords(c); if(cur<=0){ notify('La línea no tiene largo'); return; }
  var k=target/cur; pushHist();
  var out=[[c[0][0],c[0][1]]];
  for(var i=1;i<c.length;i++){ var b=_bearing(c[i-1],c[i]); var d=haversine(c[i-1],c[i])*k; out.push(_dest(out[i-1],b,d)); }
  rebuildEdit(out);
  notify('Línea ajustada a '+fmtKm(kmFromCoords(out))+' km (se movió el punto final)');
}
function refreshEditLine(){
  var c=Infra.edit.coords;
  if(!Infra.edit.line){ Infra.edit.line=L.polyline(c,{color:'#38bdf8',weight:5,opacity:.95,dashArray:'2,7'}).addTo(App.map); }
  else Infra.edit.line.setLatLngs(c);
  var el=document.getElementById('infra-eb-km'); if(el) el.textContent=fmtKm(kmFromCoords(c));
}
function pushHist(){ if(!Infra.edit.history) Infra.edit.history=[]; Infra.edit.history.push(Infra.edit.coords.map(function(c){return [c[0],c[1]];})); if(Infra.edit.history.length>80) Infra.edit.history.shift(); }
function _mkVertex(latlng){
  Infra.edit.coords.push([latlng.lat, latlng.lng]);
  var mk=L.marker(latlng,{icon:vtxIcon(),draggable:true}); mk._idx=Infra.edit.coords.length-1;
  mk.on('dragstart',function(){ pushHist(); });
  mk.on('drag',function(e){ Infra.edit.coords[this._idx]=[e.latlng.lat,e.latlng.lng]; refreshEditLine(); });
  mk.on('contextmenu',function(){ removeVertex(this._idx); });
  mk.addTo(App.map); Infra.edit.markers.push(mk); refreshEditLine();
}
function addVertex(latlng){ pushHist(); _mkVertex(latlng); }
function reindexMarkers(){ Infra.edit.markers.forEach(function(m,i){ m._idx=i; }); }
function removeVertex(idx){ pushHist(); Infra.edit.coords.splice(idx,1); var m=Infra.edit.markers.splice(idx,1)[0]; if(m) App.map.removeLayer(m); reindexMarkers(); refreshEditLine(); }
function undoVertex(){ if(Infra.edit.coords.length) removeVertex(Infra.edit.coords.length-1); }
function rebuildEdit(coords){
  Infra.edit.markers.forEach(function(m){ App.map.removeLayer(m); });
  Infra.edit.markers=[]; Infra.edit.coords=[];
  coords.forEach(function(c){ _mkVertex(L.latLng(c[0],c[1])); });
  refreshEditLine();
}
function undoEdit(){
  if(!Infra.edit.history || !Infra.edit.history.length){ notify('Nada que deshacer'); return; }
  rebuildEdit(Infra.edit.history.pop());
}
function onEditClick(e){ addVertex(e.latlng); }
function startEdit(){
  var r=Infra.records.filter(function(x){return x.id===Infra.selectedId;})[0]; if(!r) return;
  if(!Infra.map.shown) toggleMap();
  ensureEditBar();
  Infra.edit.kmz=r.kmz; Infra.edit.coords=[]; Infra.edit.markers=[]; Infra.edit.line=null; Infra.edit.history=[];
  var g=Infra.geom[String(r.kmz)];
  if(g&&g.coords){ g.coords.forEach(function(c){ _mkVertex(L.latLng(c[0],c[1])); }); }
  document.getElementById('infra-eb-title').textContent='Editando KMZ '+r.kmz+' — '+r.calle;
  document.getElementById('infra-editbar').classList.add('on');
  document.getElementById('map').style.cursor='crosshair';
  if(Infra.map.lines[r.kmz]) App.map.removeLayer(Infra.map.lines[r.kmz]);
  App.map.on('click', onEditClick); refreshEditLine();
}
function endEditCommon(){
  App.map.off('click', onEditClick);
  document.getElementById('map').style.cursor='';
  document.getElementById('infra-editbar').classList.remove('on');
  Infra.edit.markers.forEach(function(m){ App.map.removeLayer(m); });
  if(Infra.edit.line){ App.map.removeLayer(Infra.edit.line); Infra.edit.line=null; }
  Infra.edit.markers=[];
}
function finishEdit(){
  var kmz=Infra.edit.kmz, c=Infra.edit.coords.slice();
  if(c.length<2){ notify('Traza al menos 2 puntos (o usa Cancelar / Borrar geometría)'); return; }
  saveOverride(kmz,{name:'KMZ '+kmz, coords:c, provisional:false, source:'drawn'});
  recomputeAllGrupos(); persistRecords(); persistGrupos();
  endEditCommon(); if(Infra.map.shown) drawLines(); render();
  notify('Geometría KMZ '+kmz+' guardada: '+fmtKm(kmFromCoords(c))+' km');
}
function deleteEditGeom(){
  var kmz=Infra.edit.kmz; saveOverride(kmz,{coords:[],provisional:false,source:'drawn'});
  endEditCommon(); if(Infra.map.shown) drawLines(); render();
  notify('Geometría KMZ '+kmz+' borrada');
}
function cancelEdit(){ endEditCommon(); if(Infra.map.shown) drawLines(); }

/* ================= FASE 3: exportar KMZ + tabla ================= */
function download(filename, blob){
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename;
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
}
function kmlColor(hex){ // #rrggbb -> aabbggrr
  hex=(hex||'#64748b').replace('#',''); if(hex.length!==6) hex='64748b';
  var r=hex.substr(0,2), g=hex.substr(2,2), b=hex.substr(4,2); return 'ff'+b+g+r;
}
function xmlEsc(s){ return esc(s); }
function buildKml(){
  var estados={}; Infra.records.forEach(function(r){ estados[r.estado]=estadoColor(r.estado); });
  var styles=''; Object.keys(estados).forEach(function(e,i){
    styles+='<Style id="est'+i+'"><LineStyle><color>'+kmlColor(estados[e])+'</color><width>5</width></LineStyle></Style>';
  });
  var estIdx={}; Object.keys(estados).forEach(function(e,i){ estIdx[e]=i; });
  // agrupar por tipo (Corredor / PSB / No definido)
  var groups={C:{name:'CORREDORES',items:[]}, P:{name:'PISTAS SOLO BUS (PSB)',items:[]}, O:{name:'NO DEFINIDO',items:[]}};
  var seen={};
  Infra.records.forEach(function(r){
    if(seen[r.kmz]) return; var g=Infra.geom[String(r.kmz)]; if(!g||!g.coords||g.coords.length<2) return; seen[r.kmz]=1;
    groups[tipoClass(r.tipo)].items.push(r.kmz);
  });
  function placemark(kmz){
    var recs=recForKmz(kmz), r0=recs[0], g=Infra.geom[String(kmz)];
    var kmGeo=kmFromCoords(g.coords);
    var desc='<![CDATA[<table border="1" cellpadding="4" style="border-collapse:collapse;font-family:sans-serif;font-size:12px">'+
      '<tr><td><b>KMZ</b></td><td>'+kmz+'</td></tr>'+
      '<tr><td><b>Tipo</b></td><td>'+xmlEsc(r0.tipo)+'</td></tr>'+
      '<tr><td><b>Comuna</b></td><td>'+xmlEsc(r0.comuna)+'</td></tr>'+
      '<tr><td><b>Calle</b></td><td>'+xmlEsc(r0.calle)+'</td></tr>'+
      (r0.bip?'<tr><td><b>Código BIP</b></td><td>'+xmlEsc(r0.bip)+'</td></tr>':'')+
      '<tr><td><b>Km (hoja)</b></td><td>'+recs.map(function(r){return fmtKm(r.km);}).join(' + ')+'</td></tr>'+
      '<tr><td><b>Km (trazado)</b></td><td>'+fmtKm(kmGeo)+(g.provisional?' (provisorio)':'')+'</td></tr>'+
      '<tr><td><b>Tramo</b></td><td>'+xmlEsc(r0.tramo)+'</td></tr>'+
      '<tr><td><b>Estado</b></td><td>'+xmlEsc(r0.estado)+'</td></tr>'+
      '<tr><td><b>Año</b></td><td>'+xmlEsc(r0.anio)+'</td></tr>'+
      (r0.obs?'<tr><td><b>Observación</b></td><td>'+xmlEsc(r0.obs)+'</td></tr>':'')+
      '</table>]]>';
    var coords=g.coords.map(function(c){return c[1]+','+c[0]+',0';}).join(' ');
    return '<Placemark><name>'+kmz+') '+xmlEsc(r0.calle)+'</name><description>'+desc+'</description>'+
      '<styleUrl>#est'+estIdx[r0.estado]+'</styleUrl>'+
      '<LineString><tessellate>1</tessellate><coordinates>'+coords+'</coordinates></LineString></Placemark>';
  }
  var body='';
  ['C','P','O'].forEach(function(k){ var grp=groups[k]; if(!grp.items.length) return;
    body+='<Folder><name>'+grp.name+'</name>';
    grp.items.sort(function(a,b){return a-b;}).forEach(function(kmz){ body+=placemark(kmz); });
    body+='</Folder>';
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'+
    '<name>INFRA - Vías Exclusivas Biobío</name>'+styles+body+'</Document></kml>';
}
function exportKmz(){
  var withGeom=0; var seen={}; Infra.records.forEach(function(r){ if(seen[r.kmz])return; var g=Infra.geom[String(r.kmz)]; if(g&&g.coords&&g.coords.length>=2){withGeom++;seen[r.kmz]=1;} });
  if(!withGeom){ notify('No hay geometrías para exportar'); return; }
  var kml=buildKml();
  if(typeof JSZip==='undefined'){ download('INFRA_Vias_Exclusivas.kml', new Blob([kml],{type:'application/vnd.google-earth.kml+xml'})); notify('KML descargado ('+withGeom+' líneas)'); return; }
  var zip=new JSZip(); zip.file('doc.kml', kml);
  zip.generateAsync({type:'blob',compression:'DEFLATE'}).then(function(blob){
    download('INFRA_Vias_Exclusivas.kmz', blob); notify('KMZ descargado ('+withGeom+' líneas)');
  });
}
function _thinB(){ var t={style:'thin',color:{argb:'FFBFBFBF'}}; return {top:t,left:t,bottom:t,right:t}; }
function _kmGeoOf(kmz){ var g=Infra.geom[String(kmz)]; return (g&&g.coords&&g.coords.length>=2)?+kmFromCoords(g.coords).toFixed(2):null; }
function _nn(v){ return (v==null||v==='')?null:v; }
function _buildResumenWorkbook(EJS){
  var wb=new EJS.Workbook(); var ws=wb.addWorksheet('Resumen INFRA',{views:[{state:'frozen',ySplit:2}]});
  var widths=[2.6,5.8,25.2,19,27.8,11.2,18,33.5,25.9,14.8,11.9,18,19.9,63.5,11.5];
  widths.forEach(function(w,i){ ws.getColumn(i+1).width=w; });
  var GRAY={type:'pattern',pattern:'solid',fgColor:{argb:'FFD8D8D8'}}, B=_thinB();
  ws.getCell('C1').value='VÍAS EXCLUSIVAS ACTUALES Y PROYECTADAS'; ws.getCell('C1').font={bold:true,size:12};
  ws.getCell('K1').value='Monto UF Actual'; ws.getCell('K1').font={bold:true};
  ws.getCell('L1').value=40000; ws.getCell('L1').numFmt='#,##0';
  var heads=['','KMZ','TIPO','COMUNA','Calle o Avenida','CODIGO BIP','Distancia (km)','TRAMO','ESTADO ACTUAL','Año Inicio Operación (Referencial)','MONTO UF','MONTO $','MONTO CONSERVACION $','Observación','Km trazado'];
  for(var c=1;c<=15;c++){ var h=ws.getCell(2,c); h.value=heads[c-1]; h.font={bold:true}; h.fill=GRAY; h.border=B; h.alignment={wrapText:true,vertical:'middle',horizontal:'center'}; }
  var rowNo=3;
  function money(c){ ws.getCell(rowNo-1,c).numFmt='#,##0'; }
  function writeData(recs){
    var n=1;
    recs.forEach(function(r){
      var vals=[n,r.kmz,r.tipo,r.comuna,r.calle,r.bip,_nn(r.km),r.tramo,r.estado,r.anio,_nn(r.uf),_nn(r.monto),_nn(r.conserv),r.obs,_kmGeoOf(r.kmz)];
      for(var c=1;c<=15;c++){ var cell=ws.getCell(rowNo,c); cell.value=(vals[c-1]===undefined?null:vals[c-1]); cell.border=B; cell.alignment={vertical:'top',wrapText:(c===8||c===14)}; }
      ws.getCell(rowNo,7).numFmt='0.00'; ws.getCell(rowNo,15).numFmt='0.00';
      ws.getCell(rowNo,11).numFmt='#,##0'; ws.getCell(rowNo,12).numFmt='#,##0'; ws.getCell(rowNo,13).numFmt='#,##0';
      rowNo++; n++;
    });
  }
  var act=Infra.records.filter(function(r){return r.seccion!=='RECHAZADAS';});
  var rech=Infra.records.filter(function(r){return r.seccion==='RECHAZADAS';});
  writeData(act);
  var tk=act.reduce(function(a,r){return a+(r.km||0);},0), tm=act.reduce(function(a,r){return a+(r.monto||0);},0), tg=act.reduce(function(a,r){return a+(_kmGeoOf(r.kmz)||0);},0);
  ws.getCell(rowNo,3).value='TOTALES'; ws.getCell(rowNo,3).font={bold:true};
  ws.getCell(rowNo,7).value=+tk.toFixed(2); ws.getCell(rowNo,7).numFmt='0.00'; ws.getCell(rowNo,7).font={bold:true};
  ws.getCell(rowNo,12).value=tm; ws.getCell(rowNo,12).numFmt='#,##0'; ws.getCell(rowNo,12).font={bold:true};
  ws.getCell(rowNo,15).value=+tg.toFixed(2); ws.getCell(rowNo,15).numFmt='0.00'; ws.getCell(rowNo,15).font={bold:true};
  rowNo+=2;
  if(rech.length){ ws.getCell(rowNo,3).value='VÍAS EXCLUSIVAS RECHAZADAS'; ws.getCell(rowNo,3).font={bold:true}; rowNo++; writeData(rech); }
  return wb;
}
function loadExcelJS(cb){ if(window.ExcelJS){ cb(); return; } var sc=document.createElement('script'); sc.src='https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'; sc.onload=function(){ cb(); }; sc.onerror=function(){ notify('No se pudo cargar ExcelJS (¿sin conexión?)'); }; document.head.appendChild(sc); }
function exportTabla(){
  notify('Generando Excel...');
  loadExcelJS(function(){
    try{ var wb=_buildResumenWorkbook(window.ExcelJS);
      wb.xlsx.writeBuffer().then(function(buf){
        download('INFRA_Resumen_Vias.xlsx', new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        notify('Tabla exportada con formato ('+Infra.records.length+' tramos)');
      });
    }catch(e){ notify('Error export Excel: '+e.message); }
  });
}
Infra._buildResumenWorkbook=_buildResumenWorkbook; Infra._loadExcelJS=loadExcelJS;

/* ============== Editor de DATOS + fuente unica JSON ============== */
var LS_REC='infra_records_v1';
var DATA_URL='https://raw.githubusercontent.com/sebastian50000/gtfs-viewer-data/main/data/infra_data.json?v=20260708b';
var TIPO_OPTS=['Corredor Segregado Centralizado, Bidireccional','Via Exclusiva a la derecha. Unidireccional.','No definido'];
var VALOR_UF=40000; // valor UF en $ (Monto UF Actual de la planilla). Editable.
function sentidoFromTipo(t){ t=(t||'').toLowerCase(); if(t.indexOf('bidireccional')>=0) return 'Bi'; if(t.indexOf('unidireccional')>=0) return 'Uni'; return ''; }
function backfillSentido(){ if(!Infra.records) return; Infra.records.forEach(function(r){ if(!('sentido' in r) || r.sentido==null) r.sentido=sentidoFromTipo(r.tipo); }); }
function estadoOpts(){ return Object.keys(ESTADO_COLORS); }
function persistRecords(){ try{ localStorage.setItem(LS_REC, JSON.stringify(Infra.records)); }catch(e){} }
function loadRecordsOverride(){ try{ var r=JSON.parse(localStorage.getItem(LS_REC)||'null'); if(r&&r.length){ Infra.records=r; return true; } }catch(e){} return false; }
function hasLocalRecords(){ try{ return !!localStorage.getItem(LS_REC); }catch(e){ return false; } }
function nextId(){ var m=0; Infra.records.forEach(function(r){ if(r.id>m)m=r.id; }); return m+1; }
function nextKmz(){ var m=0; Infra.records.forEach(function(r){ if(r.kmz>m)m=r.kmz; }); return m+1; }
function swap(arr,i,j){ var t=arr[i]; arr[i]=arr[j]; arr[j]=t; }
function copyRecord(){
  var id=Infra.selectedId; if(!id) return;
  var orig=Infra.records.filter(function(x){return x.id===id;})[0]; if(!orig) return;
  askMismoProyecto(orig, function(same){
    if(!same){ openEditForm(orig, true); return; }
    askModo(function(modo){
      if(!modo) return;
      var gid=orig.grupo || newGrupoId();
      if(!Infra.grupos[gid]) Infra.grupos[gid]={modo:modo, montoTotal:(orig.monto||0), ufTotal:(orig.uf||0)};
      else Infra.grupos[gid].modo=modo;
      orig.grupo=gid; persistRecords(); persistGrupos();
      openEditForm(orig, true, gid);
    });
  });
}
function readForm(){
  var o={}, bd=document.querySelector('#infra-modal .bd'); if(!bd) return o;
  Array.prototype.forEach.call(bd.querySelectorAll('[data-k]'),function(el){
    var k=el.dataset.k, v=el.value;
    if(k==='kmz') o[k]=parseInt(v,10)||0;
    else if(k==='km'||k==='uf'||k==='monto'||k==='conserv') o[k]=numOrNull(v);
    else o[k]=v;
  });
  o.id=(Infra._editRec&&Infra._editRec.id)||nextId(); if(!o.seccion) o.seccion='ACTUALES';
  return o;
}
function duplicateFromForm(){ openEditForm(readForm(), true); }
function updateMoveBtns(){
  var rows=filtered(), pos=Infra.selectedId?rows.findIndex(function(x){return x.id===Infra.selectedId;}):-1;
  var upB=document.getElementById('infra-tb-up'); if(upB) upB.disabled=(pos<=0);
  var dnB=document.getElementById('infra-tb-down'); if(dnB) dnB.disabled=(pos<0||pos>=rows.length-1);
}
function moveBy(dir){
  var id=Infra.selectedId; if(!id) return;
  var rows=filtered();
  var pos=rows.findIndex(function(x){return x.id===id;}); var np=pos+dir;
  if(pos<0||np<0||np>=rows.length) return;
  var a=rows[pos], b=rows[np];
  if(Infra.sort.key!==null) notify('Orden manual (clic en un encabezado para volver a ordenar)');
  Infra.sort.key=null;                         // pasar a orden manual para que el cambio se vea
  if(rows.length===Infra.records.length){      // sin filtro: adoptar el orden visible con a y b intercambiados
    rows[pos]=b; rows[np]=a; Infra.records=rows.slice();
  } else {                                      // con filtro: intercambiar solo esos dos en el arreglo real
    var i=Infra.records.indexOf(a), j=Infra.records.indexOf(b); if(i>=0&&j>=0) swap(Infra.records, i, j);
  }
  persistRecords(); render(); updateMoveBtns();
  if(Infra.map && Infra.map.shown) drawLines();
}
function moveUp(){ moveBy(-1); }
function moveDown(){ moveBy(1); }
function numOrNull(v){ if(v==null||v==='') return null; var n=parseFloat(String(v).replace(',','.')); return isNaN(n)?null:n; }

function fetchDataJson(){
  if(hasLocalRecords()) { console.log('[Infra] usando datos locales (edicion en curso)'); return; }
  try{
    fetch(DATA_URL,{cache:'no-store'}).then(function(r){ return r.ok?r.json():null; }).then(function(j){
      if(!j||!j.records||!j.records.length) return;
      Infra.records=j.records; if(j.geom) Infra.geom=Object.assign({}, j.geom, Infra.geom); if(j.grupos) Infra.grupos=j.grupos; recomputeAllGrupos();
      console.log('[Infra] datos base cargados del repo:', j.records.length);
      if(document.getElementById('infra-panel')){ buildFilterOptions(); render(); }
    }).catch(function(){});
  }catch(e){}
}
function exportDataJson(){
  var data={records:Infra.records, geom:Infra.geom, grupos:Infra.grupos};
  download('infra_data.json', new Blob([JSON.stringify(data)],{type:'application/json'}));
  notify('infra_data.json exportado ('+Infra.records.length+' tramos). Súbelo a gtfs-viewer-data/data y haz push.');
}
Infra.exportDataJson=exportDataJson;

function ensureModal(){
  if(document.getElementById('infra-modal-ov')) return;
  var ov=document.createElement('div'); ov.id='infra-modal-ov'; ov.className='infra-modal-ov';
  ov.innerHTML='<div class="infra-modal" id="infra-modal"><h3><span id="infra-modal-title">Editar</span><span class="x" id="infra-modal-x">✕</span></h3><div class="bd"></div><div class="ft"><div style="display:flex;gap:8px"><button class="infra-mb-del" id="infra-mb-del">🗑 Borrar</button><button id="infra-mb-dup" style="background:#0ea5e9;color:#04210f;border:none;border-radius:7px;padding:8px 14px;font-weight:700;cursor:pointer;font-size:12px">📋 Duplicar</button></div><div><button class="infra-mb-cancel" id="infra-mb-cancel">Cancelar</button> <button class="infra-mb-save" id="infra-mb-save">💾 Guardar</button></div></div></div>';
  document.body.appendChild(ov);
  document.getElementById('infra-modal-x').onclick=closeEditForm;
  document.getElementById('infra-mb-cancel').onclick=closeEditForm;
  document.getElementById('infra-mb-save').onclick=saveEditForm;
  document.getElementById('infra-mb-del').onclick=deleteEditForm;
  document.getElementById('infra-mb-dup').onclick=duplicateFromForm;
  ov.addEventListener('mousedown',function(e){ if(e.target===ov) closeEditForm(); });
}
function fld(label,key,kind,arg,val,full){
  val=(val==null?'':val); var cls='infra-fld'+(full?' full':'');
  var inner;
  if(kind==='select'){ inner='<select data-k="'+key+'">'+arg.map(function(o){return '<option'+(String(o)===String(val)?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>'; }
  else if(kind==='textarea'){ inner='<textarea data-k="'+key+'">'+esc(val)+'</textarea>'; }
  else { inner='<input data-k="'+key+'" type="'+(arg||'text')+'" value="'+esc(val)+'">'; }
  return '<div class="'+cls+'"><label>'+esc(label)+'</label>'+inner+'</div>';
}
function filtroContexto(){
  var f=Infra.filters, p=[];
  if(f.seccion==='ACTUALES') p.push('Actuales/Proyectadas');
  else if(f.seccion==='RECHAZADAS') p.push('Rechazadas');
  if(f.tipo==='C') p.push('Corredores');
  else if(f.tipo==='P') p.push('PSB');
  else if(f.tipo==='O') p.push('Tipo: No definido');
  if(f.comuna) p.push(f.comuna);
  if(f.estado) p.push(f.estado);
  if(f.q) p.push('“'+f.q+'”');
  return p.length ? p.join(' · ') : 'Todos los tramos';
}
function showResumen(){
  var rows=filtered();
  var tipos={C:{n:0,km:0,inv:0,name:'Corredor'}, P:{n:0,km:0,inv:0,name:'PSB (Vía exclusiva)'}, O:{n:0,km:0,inv:0,name:'No definido'}};
  rows.forEach(function(r){ var t=tipos[tipoClass(r.tipo)]; t.n++; t.km+=(r.km||0); t.inv+=(r.monto||0); });
  var est={}; rows.forEach(function(r){ var e=r.estado||'—'; if(!est[e]) est[e]={n:0,km:0}; est[e].n++; est[e].km+=(r.km||0); });
  var _ctx=filtroContexto();
  var h='<div style="font-size:12px;color:#7dd3fc;font-weight:700;margin-bottom:2px">'+esc(_ctx)+'</div>';
  h+='<div style="font-size:10.5px;color:#8ea3c0;margin-bottom:8px"><b>'+rows.length+'</b> tramos</div>';
  h+='<div style="font-weight:700;color:#38bdf8;margin:2px 0 4px">Por tipo</div>';
  h+='<table style="width:100%;border-collapse:collapse;font-size:12px">';
  h+='<tr style="color:#8ea3c0;font-size:10px"><td></td><td style="text-align:right">Tramos</td><td style="text-align:right">Km hoja</td><td style="text-align:right">Inversión</td></tr>';
  ['C','P','O'].forEach(function(k){ var t=tipos[k]; if(!t.n) return; h+='<tr><td style="padding:3px 4px">'+t.name+'</td><td style="text-align:right;font-weight:700">'+t.n+'</td><td style="text-align:right;color:#22c55e">'+fmtKm(t.km)+'</td><td style="text-align:right;color:#7dd3fc">'+fmtMM(t.inv)+'</td></tr>'; });
  h+='</table>';
  h+='<div style="font-weight:700;color:#38bdf8;margin:10px 0 4px">Por estado</div>';
  h+='<table style="width:100%;border-collapse:collapse;font-size:12px">';
  Object.keys(est).sort().forEach(function(e){ h+='<tr><td style="padding:3px 4px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+estadoColor(e)+';margin-right:5px"></span>'+esc(e)+'</td><td style="text-align:right;font-weight:700">'+est[e].n+'</td><td style="text-align:right;color:#22c55e">'+fmtKm(est[e].km)+' km</td></tr>'; });
  h+='</table>';
  infraDialog('📊 Resumen'+(_ctx!=='Todos los tramos'?(' — '+esc(_ctx)):''), h, [{label:'Cerrar', bg:'#38bdf8', fg:'#08131f'}]);
}
function reverseTramo(t){
  if(!t) return t;
  var pref='', body=t, m=/^(\s*entre\s+)/i.exec(t);
  if(m){ pref='entre '; body=t.slice(m[0].length); }
  var seps=[{re:/\s+–\s+/, s:' – '},{re:/\s+-\s+/, s:' - '},{re:/\s+hasta\s+/i, s:' hasta '},{re:/\s+y\s+/i, s:' y '}];
  for(var i=0;i<seps.length;i++){
    if(seps[i].re.test(body)){
      var parts=body.split(seps[i].re);
      if(parts.length===2) return pref + parts[1].trim() + seps[i].s + parts[0].trim();
    }
  }
  return t;
}
function openEditForm(rec, dup, gid){
  ensureModal();
  var isNew=(!rec || dup);
  if(!rec) rec={id:nextId(),kmz:nextKmz(),seccion:'ACTUALES',tipo:TIPO_OPTS[1],comuna:'',calle:'',bip:'',km:'',tramo:'',estado:'Ejecutado y en Operación',anio:'',uf:'',monto:'',conserv:'',obs:''};
  else if(dup){ var _c=Object.assign({}, rec); _c.id=nextId(); _c.kmz=nextKmz(); if(gid){ _c.grupo=gid; _c.tramo=reverseTramo(_c.tramo); } rec=_c; }
  Infra._editRec=rec; Infra._editNew=isNew; Infra._editDup=!!dup;
  var bd=document.querySelector('#infra-modal .bd');
  bd.innerHTML=
    fld('KMZ (n°)','kmz','input','number',rec.kmz)+
    fld('Sección','seccion','select',['ACTUALES','RECHAZADAS'],rec.seccion)+
    fld('Tipo','tipo','select',TIPO_OPTS,rec.tipo,true)+
    fld('Sentido','sentido','select',['','Uni','Bi'],rec.sentido)+
    fld('Comuna','comuna','input','text',rec.comuna)+
    fld('Código BIP','bip','input','text',rec.bip)+
    fld('Calle o Avenida','calle','input','text',rec.calle,true)+
    fld('Distancia km (hoja)','km','input','text',rec.km)+
    fld('Año','anio','input','text',rec.anio)+
    fld('Tramo','tramo','input','text',rec.tramo,true)+
    fld('Estado','estado','select',estadoOpts(),rec.estado,true)+
    fld('Monto UF','uf','input','text',rec.uf)+
    fld('Monto $','monto','input','text',rec.monto)+
    fld('Conservación $','conserv','input','text',rec.conserv)+
    fld('Observación','obs','textarea',null,rec.obs,true);
  document.getElementById('infra-modal-title').textContent = dup ? ('📋 Duplicar → nuevo tramo (KMZ '+rec.kmz+')') : (isNew?'➕ Nuevo tramo':('✏️ Editar KMZ '+rec.kmz+' — '+(rec.calle||'')));
  document.getElementById('infra-mb-del').style.display=isNew?'none':'inline-block';
  var _dupBtn=document.getElementById('infra-mb-dup'); if(_dupBtn) _dupBtn.style.display=isNew?'none':'inline-block';
  var _ufIn=bd.querySelector('[data-k="uf"]'), _moIn=bd.querySelector('[data-k="monto"]');
  if(_ufIn && _moIn){
    _ufIn.addEventListener('input',function(){ var u=numOrNull(_ufIn.value); if(u!=null) _moIn.value=Math.round(u*VALOR_UF); });
    _moIn.addEventListener('input',function(){ var m=numOrNull(_moIn.value); if(m!=null) _ufIn.value=+(m/VALOR_UF).toFixed(4); });
  }
  if(rec.grupo && Infra.grupos[rec.grupo]){
    var _g=Infra.grupos[rec.grupo], _pct=(rec._pct!=null?Math.round(rec._pct*100):null);
    var _note=document.createElement('div'); _note.style.cssText='grid-column:1 / span 2;background:#0b1120;border:1px solid #38bdf8;border-radius:6px;padding:6px 8px;font-size:11px;color:#7dd3fc';
    _note.innerHTML='🔗 Grupo <b>'+rec.grupo+'</b> · '+(_g.modo==='total'?'monto por km (auto)':'suma de costos')+(_pct!=null?(' · '+_pct+'% del proyecto'):'');
    bd.insertBefore(_note, bd.firstChild);
    if(_g.modo==='total'){ if(_ufIn){ _ufIn.readOnly=true; _ufIn.style.opacity=.6; } if(_moIn){ _moIn.readOnly=true; _moIn.style.opacity=.6; } }
  }
  document.getElementById('infra-modal-ov').classList.add('on');
}
function closeEditForm(){ var o=document.getElementById('infra-modal-ov'); if(o) o.classList.remove('on'); }
function saveEditForm(){
  var rec=Infra._editRec, bd=document.querySelector('#infra-modal .bd');
  Array.prototype.forEach.call(bd.querySelectorAll('[data-k]'),function(el){
    var k=el.dataset.k, v=el.value;
    if(k==='kmz') rec.kmz=parseInt(v,10)||0;
    else if(k==='km'||k==='uf'||k==='monto'||k==='conserv') rec[k]=numOrNull(v);
    else rec[k]=v;
  });
  var _dupKmz = Infra.records.some(function(r){ return r.kmz===rec.kmz && r.id!==rec.id; });
  if(Infra._editNew) Infra.records.push(rec);
  if(rec.grupo){ recomputeGrupo(rec.grupo); persistGrupos(); }
  persistRecords(); closeEditForm();
  buildFilterOptions(); Infra.selectedId=rec.id; render();
  if(Infra.map && Infra.map.shown) drawLines();
  var _msg = Infra._editNew?('Tramo KMZ '+rec.kmz+' creado'):('KMZ '+rec.kmz+' actualizado');
  if(_dupKmz) _msg += ' ⚠️ (ese nº KMZ ya existe en otro tramo)';
  notify(_msg);
}
function deleteEditForm(){
  var rec=Infra._editRec;
  Infra.records=Infra.records.filter(function(x){return x.id!==rec.id;});
  persistRecords(); closeEditForm();
  if(Infra.selectedId===rec.id) Infra.selectedId=null;
  buildFilterOptions(); render(); if(Infra.map && Infra.map.shown) drawLines();
  notify('KMZ '+rec.kmz+' eliminado');
}
Infra.openEditForm=openEditForm;
function discardLocal(){ try{ localStorage.removeItem(LS_REC); }catch(e){} location.reload(); }
Infra.discardLocalData=discardLocal;

Infra.exportKmz=exportKmz; Infra.exportTabla=exportTabla; Infra._buildKml=buildKml;

/* ===== Grupo de proyecto (Tanda 2) ===== */
var LS_GRP='infra_grupos_v1';
if(!Infra.grupos) Infra.grupos={};
function loadGrupos(){ try{ var g=JSON.parse(localStorage.getItem(LS_GRP)||'null'); if(g) Infra.grupos=g; }catch(e){} }
function persistGrupos(){ try{ localStorage.setItem(LS_GRP, JSON.stringify(Infra.grupos)); }catch(e){} }
function newGrupoId(){ var n=1; while(Infra.grupos['g'+n]) n++; return 'g'+n; }
function grupoMembers(gid){ return Infra.records.filter(function(r){ return r.grupo===gid; }); }
function kmForSplit(r){ var g=Infra.geom[String(r.kmz)]; if(g&&g.coords&&g.coords.length>=2) return kmFromCoords(g.coords); return (typeof r.km==='number'?r.km:0)||0; }
function grupoTotalReadonly(r){ return !!(r && r.grupo && Infra.grupos[r.grupo] && Infra.grupos[r.grupo].modo==='total'); }
function recomputeGrupo(gid){
  var cfg=Infra.grupos[gid]; if(!cfg) return;
  var ms=grupoMembers(gid); if(!ms.length){ delete Infra.grupos[gid]; return; }
  var sumkm=0; ms.forEach(function(r){ sumkm+=kmForSplit(r); });
  if(cfg.modo==='total'){
    if(sumkm<=0){ ms.forEach(function(r){ r._pct=0; }); return; }
    ms.forEach(function(r){ var p=kmForSplit(r)/sumkm; r.monto=Math.round(p*(cfg.montoTotal||0)); r.uf=+(p*(cfg.ufTotal||0)).toFixed(4); r._pct=p; });
  } else {
    var tot=0; ms.forEach(function(r){ tot+=(r.monto||0); });
    cfg.montoTotal=tot; ms.forEach(function(r){ r._pct=tot>0?((r.monto||0)/tot):0; });
  }
}
function recomputeAllGrupos(){ Object.keys(Infra.grupos).forEach(recomputeGrupo); }
Infra.recomputeGrupos=recomputeAllGrupos; Infra._reverseTramo=function(t){return reverseTramo(t);};

function infraDialog(titulo, htmlBody, botones){
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1700;display:flex;align-items:center;justify-content:center;';
  var box='<div style="background:#141b2e;border:1px solid #2b3a55;border-radius:12px;max-width:470px;width:92%;color:#e6edf7;font-family:Segoe UI,system-ui,sans-serif;box-shadow:0 12px 48px rgba(0,0,0,.6)">';
  box+='<div style="padding:12px 16px;background:#0f172a;border-bottom:1px solid #2b3a55;color:#38bdf8;font-weight:700;border-radius:12px 12px 0 0">'+titulo+'</div>';
  box+='<div style="padding:14px 16px;font-size:13px;line-height:1.45">'+htmlBody+'</div>';
  box+='<div style="padding:10px 16px;border-top:1px solid #2b3a55;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap" id="_dlgbtns"></div></div>';
  ov.innerHTML=box; document.body.appendChild(ov);
  var cont=ov.querySelector('#_dlgbtns');
  botones.forEach(function(b){ var bt=document.createElement('button'); bt.textContent=b.label; bt.style.cssText='border:none;border-radius:7px;padding:8px 14px;font-weight:700;cursor:pointer;font-size:12px;background:'+(b.bg||'#334155')+';color:'+(b.fg||'#e6edf7'); bt.onclick=function(){ if(ov.parentNode) document.body.removeChild(ov); if(b.cb) b.cb(); }; cont.appendChild(bt); });
  return ov;
}
var GRP_EJEMPLOS='<div style="background:#0b1120;border:1px solid #23324c;border-radius:8px;padding:8px 10px;font-size:11.5px;color:#9db4d6;margin-top:8px;display:none" id="_grpinfo">'+
  '<b>Mismo total (÷km):</b> solo sabes el total. Ej: Proyecto $100; A=2km, B=3km → A 40%=$40, B 60%=$60. (Montos automáticos.)<br><br>'+
  '<b>Sumar (costos individuales):</b> sabes cuánto costó cada uno. Ej: A=$30, B=$70 → total $100 y cada uno mantiene su costo. (No reparte por km.)</div>';
function askMismoProyecto(rec, cb){
  infraDialog('📋 Duplicar tramo',
    '¿Este sub-tramo es del <b>MISMO proyecto</b> que:<br><b style="color:#7dd3fc">'+esc(rec.calle)+'</b> · '+esc(rec.tramo||'')+'?',
    [{label:'No (copia normal)', cb:function(){cb(false);}},{label:'Sí, mismo proyecto', bg:'#22c55e', fg:'#04210f', cb:function(){cb(true);}}]);
}
function askModo(cb){
  var ov=infraDialog('¿Cómo tratar el monto? <span id="_grpi" title="Ver ejemplos" style="cursor:pointer;color:#38bdf8;border:1px solid #38bdf8;border-radius:50%;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;font-size:11px">i</span>',
    'Elige cómo se calcula el monto del grupo:'+GRP_EJEMPLOS,
    [{label:'Cancelar', cb:function(){cb(null);}},
     {label:'Sumar (individuales)', bg:'#0ea5e9', fg:'#04210f', cb:function(){cb('sumar');}},
     {label:'Mismo total (÷km)', bg:'#22c55e', fg:'#04210f', cb:function(){cb('total');}}]);
  var i=ov.querySelector('#_grpi'), info=ov.querySelector('#_grpinfo');
  if(i&&info) i.onclick=function(){ info.style.display=(info.style.display==='none'?'block':'none'); };
}
function agruparSel(){
  var id=Infra.selectedId; if(!id) return;
  var rec=Infra.records.filter(function(x){return x.id===id;})[0]; if(!rec) return;
  var gids=Object.keys(Infra.grupos);
  var btns=[{label:'Cancelar', cb:function(){}}];
  gids.forEach(function(g){ btns.push({label:'Grupo '+g+' ('+grupoMembers(g).length+')', cb:function(){ rec.grupo=g; recomputeGrupo(g); persistRecords(); persistGrupos(); render(); notify('Agregado al grupo '+g); }}); });
  btns.push({label:'➕ Nuevo grupo', bg:'#22c55e', fg:'#04210f', cb:function(){ askModo(function(modo){ if(!modo) return; var gid=newGrupoId(); Infra.grupos[gid]={modo:modo, montoTotal:(rec.monto||0), ufTotal:(rec.uf||0)}; rec.grupo=gid; recomputeGrupo(gid); persistRecords(); persistGrupos(); render(); notify('Grupo '+gid+' creado'); }); }});
  infraDialog('🔗 Agrupar tramo', 'Agrupar <b>'+esc(rec.calle)+'</b> en:', btns);
}

Infra.startEdit=startEdit;

function init(){
  loadSeed(); loadOverrides(); loadRecordsOverride(); loadGrupos(); recomputeAllGrupos(); fetchDataJson();
  var tries=0;
  var iv=setInterval(function(){ tries++;
    var btn=document.getElementById('btn-infra');
    if(btn){ clearInterval(iv); btn.addEventListener('click',Infra.toggle); }
    if(tries>75) clearInterval(iv);
  },200);
  console.log('[Infra] cargado:', Infra.records.length,'tramos,', Object.keys(Infra.geom).length,'geometrias');
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();

})();
