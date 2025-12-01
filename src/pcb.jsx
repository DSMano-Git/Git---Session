// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Stage } from '@react-three/drei';
// import * as THREE from 'three';
// import { 
//   Upload, 
//   Layers, 
//   Activity, 
//   Settings, 
//   Cpu, 
//   Maximize,
//   FileCode
// } from 'lucide-react';

// // --- 1. KICAD PARSER UTILITIES (Logic Unchanged) ---

// const tokenizeSExpr = (str) => {
//   const regex = /\s*(\(|\)|"[^"]*"|[^\s()"]+)\s*/g;
//   let token;
//   const tokens = [];
//   while ((token = regex.exec(str)) !== null) {
//     if (token[1]) tokens.push(token[1]);
//   }
//   return tokens;
// };

// const parseSExpr = (tokens) => {
//   if (tokens.length === 0) return undefined;
//   const token = tokens.shift();
//   if (token === "(") {
//     const list = [];
//     while (tokens[0] !== ")" && tokens.length > 0) {
//       list.push(parseSExpr(tokens));
//     }
//     tokens.shift(); 
//     return list;
//   } else if (token === ")") {
//     return null; 
//   } else {
//     return token.startsWith('"') ? token.slice(1, -1) : token;
//   }
// };

// const findNode = (list, type) => {
//   if (!Array.isArray(list)) return null;
//   return list.find(item => Array.isArray(item) && item[0] === type);
// };

// const parseKiCadData = (fileContent) => {
//   try {
//     const tokens = tokenizeSExpr(fileContent);
//     const tree = parseSExpr(tokens);

//     if (!tree || tree[0] !== 'kicad_pcb') {
//       throw new Error("Not a valid kicad_pcb file");
//     }

//     const board = {
//       footprints: [],
//       segments: [],
//       lines: [],
//       vias: [],
//       minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity
//     };

//     const updateBounds = (x, y) => {
//       if (x < board.minX) board.minX = x;
//       if (y < board.minY) board.minY = y;
//       if (x > board.maxX) board.maxX = x;
//       if (y > board.maxY) board.maxY = y;
//     };

//     tree.forEach(node => {
//       if (!Array.isArray(node)) return;
//       const type = node[0];

//       if (type === 'segment') {
//         const start = findNode(node, 'start');
//         const end = findNode(node, 'end');
//         const width = findNode(node, 'width');
//         const layer = findNode(node, 'layer');
        
//         if (start && end) {
//           const x1 = parseFloat(start[1]);
//           const y1 = parseFloat(start[2]);
//           const x2 = parseFloat(end[1]);
//           const y2 = parseFloat(end[2]);
          
//           board.segments.push({
//             x1, y1, x2, y2,
//             width: width ? parseFloat(width[1]) : 0.2,
//             layer: layer ? layer[1] : 'F.Cu'
//           });
//           updateBounds(x1, y1);
//           updateBounds(x2, y2);
//         }
//       }
//       else if (type === 'gr_line' || type === 'line') {
//         const start = findNode(node, 'start');
//         const end = findNode(node, 'end');
//         const layer = findNode(node, 'layer');
//         if (start && end && layer && layer[1] === 'Edge.Cuts') {
//           board.lines.push({
//             x1: parseFloat(start[1]), y1: parseFloat(start[2]),
//             x2: parseFloat(end[1]), y2: parseFloat(end[2])
//           });
//         }
//       }
//       else if (type === 'footprint' || type === 'module') {
//         const at = findNode(node, 'at');
//         const x = at ? parseFloat(at[1]) : 0;
//         const y = at ? parseFloat(at[2]) : 0;
//         const rot = at && at[3] ? parseFloat(at[3]) : 0;
        
//         const pads = [];
//         node.forEach(child => {
//           if (Array.isArray(child) && child[0] === 'pad') {
//              const pAt = findNode(child, 'at');
//              const pSize = findNode(child, 'size');
//              const pShape = child[2]; 
//              pads.push({
//                type: child[1],
//                shape: pShape,
//                x: pAt ? parseFloat(pAt[1]) : 0,
//                y: pAt ? parseFloat(pAt[2]) : 0,
//                w: pSize ? parseFloat(pSize[1]) : 1.5,
//                h: pSize ? parseFloat(pSize[2]) : 1.5,
//              });
//           }
//         });

//         board.footprints.push({
//           ref: node[1],
//           x, y, rot,
//           pads
//         });
//         updateBounds(x, y);
//       }
//       else if (type === 'via') {
//          const at = findNode(node, 'at');
//          const size = findNode(node, 'size');
//          if(at) {
//              board.vias.push({
//                  x: parseFloat(at[1]),
//                  y: parseFloat(at[2]),
//                  size: size ? parseFloat(size[1]) : 0.6
//              });
//          }
//       }
//     });

//     if (board.minX === Infinity) {
//         board.minX = 0; board.minY = 0; board.maxX = 100; board.maxY = 100;
//     }

//     return board;
//   } catch (e) {
//     console.error("Parse Error:", e);
//     return null;
//   }
// };

// // --- 2. 3D VIEWER COMPONENTS ---

// const Track3D = ({ x1, y1, x2, y2, width, layer }) => {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const len = Math.sqrt(dx*dx + dy*dy);
//   const angle = Math.atan2(dy, dx);
//   const z = layer === 'F.Cu' ? 0.05 : -1.65;
//   const color = layer === 'F.Cu' ? '#ffaa00' : '#00aaff'; 

//   return (
//     <mesh position={[(x1 + x2)/2, -(y1 + y2)/2, z]} rotation={[0, 0, -angle]}>
//       <boxGeometry args={[len, width, 0.02]} />
//       <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
//     </mesh>
//   );
// };

// const Footprint3D = ({ data }) => {
//   const bounds = data.pads.reduce((acc, p) => ({
//       minX: Math.min(acc.minX, p.x - p.w/2),
//       maxX: Math.max(acc.maxX, p.x + p.w/2),
//       minY: Math.min(acc.minY, p.y - p.h/2),
//       maxY: Math.max(acc.maxY, p.y + p.h/2),
//   }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
//   const w = (bounds.maxX - bounds.minX) || 2;
//   const h = (bounds.maxY - bounds.minY) || 2;
//   const cx = (bounds.minX + bounds.maxX) / 2 || 0;
//   const cy = (bounds.minY + bounds.maxY) / 2 || 0;

//   return (
//     <group position={[data.x, -data.y, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-data.rot)]}>
//       <mesh position={[cx, -cy, 0.5]}>
//         <boxGeometry args={[w + 0.5, h + 0.5, 1]} />
//         <meshStandardMaterial color="#333" roughness={0.6} />
//       </mesh>
//       {data.pads.map((pad, i) => (
//         <mesh key={i} position={[pad.x, -pad.y, 0.05]}>
//           <boxGeometry args={[pad.w, pad.h, 0.1]} />
//           <meshStandardMaterial color={pad.shape === 'rect' ? "#c0c0c0" : "#ffd700"} metalness={0.9} roughness={0.2} />
//         </mesh>
//       ))}
//     </group>
//   );
// };

// const BoardSubstrate = ({ width, height, cx, cy }) => {
//   return (
//     <mesh position={[cx, -cy, -0.8]}>
//        <boxGeometry args={[width, height, 1.6]} />
//        <meshStandardMaterial color="#0f5132" roughness={0.5} metalness={0.1} />
//     </mesh>
//   );
// }

// const Viewer3D = ({ data }) => {
//   if (!data) return null;
//   const width = (data.maxX - data.minX) * 1.2;
//   const height = (data.maxY - data.minY) * 1.2;
//   const cx = (data.maxX + data.minX) / 2;
//   const cy = (data.maxY + data.minY) / 2;

//   return (
//     <Canvas camera={{ position: [0, 0, 150], fov: 45 }} shadows>
//        <color attach="background" args={['#1e1e1e']} />
//        <Stage environment="city" intensity={0.6} adjustCamera={false}>
//          <group>
//            <BoardSubstrate width={width} height={height} cx={cx} cy={cy} />
//            {data.segments.map((seg, i) => <Track3D key={`tr-${i}`} {...seg} />)}
//            {data.footprints.map((fp, i) => <Footprint3D key={`fp-${i}`} data={fp} />)}
//            {data.vias.map((via, i) => (
//               <mesh key={`v-${i}`} position={[via.x, -via.y, 0]}>
//                   <cylinderGeometry args={[via.size/2, via.size/2, 1.7, 8]} />
//                   <meshStandardMaterial color="#b87333" />
//               </mesh>
//            ))}
//          </group>
//        </Stage>
//        <OrbitControls makeDefault />
//     </Canvas>
//   );
// };

// // --- 3. 2D VIEWER COMPONENT ---

// const Viewer2D = ({ data }) => {
//   const canvasRef = useRef(null);
  
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !data) return;
    
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
    
//     // Clear
//     ctx.fillStyle = '#1e1e1e';
//     ctx.fillRect(0, 0, width, height);
    
//     const boardW = data.maxX - data.minX;
//     const boardH = data.maxY - data.minY;
//     const scale = Math.min((width - 40) / boardW, (height - 40) / boardH);
    
//     ctx.save();
//     ctx.translate(width/2, height/2);
//     ctx.scale(scale, scale);
//     ctx.translate(-((data.minX + data.maxX)/2), -((data.minY + data.maxY)/2));
    
//     ctx.fillStyle = '#0a2e1d';
//     ctx.fillRect(data.minX - 5, data.minY - 5, boardW + 10, boardH + 10);
    
//     data.segments.forEach(seg => {
//        ctx.beginPath();
//        ctx.moveTo(seg.x1, seg.y1);
//        ctx.lineTo(seg.x2, seg.y2);
//        ctx.lineCap = 'round';
//        ctx.lineWidth = seg.width;
//        ctx.strokeStyle = seg.layer === 'F.Cu' ? '#ff3333' : '#3333ff';
//        ctx.globalAlpha = 0.8;
//        ctx.stroke();
//     });
//     ctx.globalAlpha = 1.0;

//     data.footprints.forEach(fp => {
//        ctx.save();
//        ctx.translate(fp.x, fp.y);
//        ctx.rotate(fp.rot * Math.PI / 180);
//        fp.pads.forEach(pad => {
//           ctx.fillStyle = '#d4af37';
//           ctx.fillRect(pad.x - pad.w/2, pad.y - pad.h/2, pad.w, pad.h);
//        });
//        ctx.strokeStyle = 'white';
//        ctx.lineWidth = 0.1;
//        ctx.strokeRect(-2, -2, 4, 4);
//        ctx.restore();
//     });
    
//     ctx.restore();
//   }, [data]);

//   return (
//     <div style={{
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: '#111827',
//       borderRadius: '8px',
//       overflow: 'hidden',
//       border: '1px solid #374151'
//     }}>
//       <canvas ref={canvasRef} width={800} height={600} style={{ maxWidth: '100%', maxHeight: '100%' }} />
//     </div>
//   );
// };

// // --- 4. MAIN APP ---

// function App() {
//   const [fileContent, setFileContent] = useState(null);
//   const [boardData, setBoardData] = useState(null);
//   const [viewMode, setViewMode] = useState('3d'); 
//   const [apiUrl, setApiUrl] = useState("https://apis.boltchem.com/v4/tools/cypress");
//   const [apiResponse, setApiResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const content = evt.target.result;
//       setFileContent(content);
//       const parsed = parseKiCadData(content);
//       if (parsed) {
//         setBoardData(parsed);
//       } else {
//         alert("Failed to parse KiCad file. Please ensure it is a valid .kicad_pcb file.");
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleApiSubmit = async () => {
//     if (!fileContent) return;
//     setLoading(true);
//     setApiResponse(null);
//     setError(null);
    
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content: fileContent,
//           filename: "project.kicad_pcb"
//         })
//       });

//       const data = await response.json();
//       setApiResponse(data);
//     } catch (err) {
//       setError(err.message);
//       setApiResponse({
//         status: "mock_success",
//         message: "API request failed (likely due to CORS or invalid endpoint), but here is what we analyzed locally:",
//         analysis: {
//           layers: 4,
//           tracks: boardData ? boardData.segments.length : 0,
//           components: boardData ? boardData.footprints.length : 0,
//           estimated_complexity: "Medium"
//         }
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- STYLES OBJECTS ---
//   const styles = {
//     container: {
//       display: 'flex',
//       height: '100vh',
//       width: '100%',
//       backgroundColor: '#0f1115',
//       color: 'white',
//       fontFamily: 'sans-serif',
//       overflow: 'hidden'
//     },
//     sidebar: {
//       width: '320px',
//       display: 'flex',
//       flexDirection: 'column',
//       borderRight: '1px solid #1f2937',
//       backgroundColor: '#161b22'
//     },
//     sidebarHeader: {
//       padding: '24px',
//       borderBottom: '1px solid #1f2937'
//     },
//     title: {
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       color: '#34d399',
//       margin: 0
//     },
//     subtitle: {
//       fontSize: '0.75rem',
//       color: '#6b7280',
//       marginTop: '4px',
//       margin: 0
//     },
//     sidebarContent: {
//       padding: '24px',
//       flex: 1,
//       overflowY: 'auto',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '24px'
//     },
//     label: {
//       fontSize: '0.875rem',
//       fontWeight: '500',
//       color: '#d1d5db',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       marginBottom: '8px'
//     },
//     fileInput: {
//       display: 'block',
//       width: '100%',
//       fontSize: '0.875rem',
//       color: '#9ca3af',
//       padding: '8px',
//       backgroundColor: '#1f2937',
//       borderRadius: '8px',
//       border: '1px solid #374151',
//       cursor: 'pointer'
//     },
//     parsedInfo: {
//       fontSize: '0.75rem',
//       color: '#4ade80',
//       marginTop: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '4px'
//     },
//     toggleContainer: {
//       display: 'flex',
//       backgroundColor: '#111827',
//       padding: '4px',
//       borderRadius: '8px',
//       gap: '4px'
//     },
//     toggleButton: (isActive) => ({
//       flex: 1,
//       padding: '8px',
//       fontSize: '0.875rem',
//       borderRadius: '6px',
//       border: 'none',
//       cursor: 'pointer',
//       backgroundColor: isActive ? '#059669' : 'transparent',
//       color: isActive ? 'white' : '#6b7280',
//       boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
//       transition: 'all 0.2s'
//     }),
//     apiPanel: {
//       padding: '16px',
//       backgroundColor: 'rgba(31, 41, 55, 0.5)',
//       borderRadius: '12px',
//       border: '1px solid #374151',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '16px'
//     },
//     input: {
//       width: '100%',
//       backgroundColor: '#111827',
//       border: '1px solid #374151',
//       borderRadius: '4px',
//       padding: '8px 12px',
//       fontSize: '0.75rem',
//       color: '#d1d5db',
//       outline: 'none',
//       boxSizing: 'border-box'
//     },
//     actionButton: (disabled) => ({
//       width: '100%',
//       padding: '8px',
//       borderRadius: '8px',
//       fontSize: '0.875rem',
//       fontWeight: '600',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px',
//       border: 'none',
//       cursor: disabled ? 'not-allowed' : 'pointer',
//       backgroundColor: disabled ? '#374151' : '#059669',
//       color: disabled ? '#6b7280' : 'white',
//       boxShadow: disabled ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//       transition: 'all 0.2s'
//     }),
//     responsePanel: {
//       padding: '16px',
//       backgroundColor: '#111827',
//       borderRadius: '12px',
//       border: '1px solid #1f2937',
//       fontSize: '0.75rem',
//       fontFamily: 'monospace',
//       overflow: 'hidden'
//     },
//     mainArea: {
//       flex: 1,
//       position: 'relative',
//       backgroundColor: 'black',
//       display: 'flex',
//       flexDirection: 'column'
//     },
//     toolbar: {
//       height: '56px',
//       borderBottom: '1px solid #1f2937',
//       backgroundColor: '#0f1115',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '0 24px'
//     },
//     legendDot: (color) => ({
//       width: '12px',
//       height: '12px',
//       borderRadius: '50%',
//       backgroundColor: color,
//       display: 'inline-block'
//     }),
//     viewport: {
//       flex: 1,
//       position: 'relative',
//       overflow: 'hidden'
//     },
//     emptyState: {
//       position: 'absolute',
//       inset: 0,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: '#6b7280',
//       gap: '16px'
//     }
//   };

//   return (
//     <div style={styles.container}>
      
//       {/* Sidebar */}
//       <div style={styles.sidebar}>
//         <div style={styles.sidebarHeader}>
//           <h1 style={styles.title}>
//             <Cpu size={32} />
//             Boltz PCB
//           </h1>
//           <p style={styles.subtitle}>AI-Powered Design & View</p>
//         </div>

//         <div style={styles.sidebarContent}>
//           {/* File Upload */}
//           <div>
//             <label style={styles.label}>
//               <FileCode size={16} /> Import Design
//             </label>
//             <div>
//               <input 
//                 type="file" 
//                 accept=".kicad_pcb" 
//                 onChange={handleFileUpload}
//                 style={styles.fileInput}
//               />
//             </div>
//             {boardData && (
//               <div style={styles.parsedInfo}>
//                  <Activity size={12} /> 
//                  Parsed: {boardData.footprints.length} components, {boardData.segments.length} tracks
//               </div>
//             )}
//           </div>

//           {/* View Toggle */}
//           <div>
//             <label style={styles.label}>
//               <Layers size={16} /> Visualization
//             </label>
//             <div style={styles.toggleContainer}>
//               <button 
//                 onClick={() => setViewMode('2d')}
//                 style={styles.toggleButton(viewMode === '2d')}
//               >
//                 2D Schematic
//               </button>
//               <button 
//                 onClick={() => setViewMode('3d')}
//                 style={styles.toggleButton(viewMode === '3d')}
//               >
//                 3D Render
//               </button>
//             </div>
//           </div>

//           {/* API Controls */}
//           <div style={styles.apiPanel}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <label style={styles.label}>
//                 <Settings size={16} /> BoltChem API
//               </label>
//             </div>
            
//             <input 
//               type="text" 
//               value={apiUrl}
//               onChange={(e) => setApiUrl(e.target.value)}
//               style={styles.input}
//               placeholder="https://api..."
//             />
            
//             <button 
//               onClick={handleApiSubmit}
//               disabled={loading || !fileContent}
//               style={styles.actionButton(loading || !fileContent)}
//             >
//               {loading ? 'Processing...' : 'Run Analysis'}
//             </button>
//           </div>
          
//           {/* API Results Panel */}
//           {(apiResponse || error) && (
//             <div style={styles.responsePanel}>
//                <h3 style={{ color: '#9ca3af', marginBottom: '8px', borderBottom: '1px solid #1f2937', paddingBottom: '4px', margin: 0 }}>Response Data</h3>
//                {error && <div style={{ color: '#f87171', marginBottom: '8px' }}>{error}</div>}
//                <pre style={{ overflow: 'auto', maxHeight: '160px', color: 'rgba(110, 231, 183, 0.8)', margin: 0 }}>
//                  {JSON.stringify(apiResponse, null, 2)}
//                </pre>
//             </div>
//           )}

//         </div>
        
//         <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.75rem', color: '#4b5563', borderTop: '1px solid #1f2937' }}>
//            PCB Viewer v1.0 • React Three Fiber
//         </div>
//       </div>

//       {/* Main Canvas Area */}
//       <div style={styles.mainArea}>
//         {/* Header/Toolbar */}
//         <div style={styles.toolbar}>
//           <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
//              {fileContent ? "project1.kicad_pcb" : "No project loaded"}
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280' }}>
//                 <span style={styles.legendDot('#ffaa00')}></span> F.Cu
//                 <span style={styles.legendDot('#00aaff')}></span> B.Cu
//              </div>
//              <button style={{ padding: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
//                 <Maximize size={20} />
//              </button>
//           </div>
//         </div>

//         {/* Viewport */}
//         <div style={styles.viewport}>
//            {!boardData ? (
//              <div style={styles.emptyState}>
//                 <Upload size={64} style={{ opacity: 0.2 }} />
//                 <p>Upload a .kicad_pcb file to begin visualization</p>
//              </div>
//            ) : (
//              <>
//                {viewMode === '3d' ? (
//                  <Viewer3D data={boardData} />
//                ) : (
//                  <Viewer2D data={boardData} />
//                )}
//              </>
//            )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// // import React, { useState, useRef, useEffect, useMemo } from 'react';
// // import { Canvas } from '@react-three/fiber';
// // import { OrbitControls, Stage, Text as Text3D, Line } from '@react-three/drei';
// // import * as THREE from 'three';
// // import { 
// //   Upload, 
// //   Layers, 
// //   Activity, 
// //   Settings, 
// //   Cpu, 
// //   Maximize,
// //   FileCode,
// //   AlertCircle
// // } from 'lucide-react';

// // // --- 1. ADVANCED MATH UTILITIES ---

// // const rotateVector = (x, y, angleDeg) => {
// //   const rad = (angleDeg * Math.PI) / 180;
// //   const cos = Math.cos(rad);
// //   const sin = Math.sin(rad);
// //   return {
// //     x: x * cos - y * sin,
// //     y: x * sin + y * cos
// //   };
// // };

// // // Calculate Circle Center, Radius, and Angles from 3 points (Start, Mid, End)
// // const getArcParams = (x1, y1, xm, ym, x2, y2) => {
// //   const D = 2 * (x1 * (ym - y2) + xm * (y2 - y1) + x2 * (y1 - ym));
// //   if (Math.abs(D) < 0.0001) return null; // Collinear

// //   const Ux = ((x1**2 + y1**2) * (ym - y2) + (xm**2 + ym**2) * (y2 - y1) + (x2**2 + y2**2) * (y1 - ym)) / D;
// //   const Uy = ((x1**2 + y1**2) * (x2 - xm) + (xm**2 + ym**2) * (x1 - x2) + (x2**2 + y2**2) * (xm - x1)) / D;
  
// //   const radius = Math.sqrt((x1 - Ux)**2 + (y1 - Uy)**2);
// //   const startAngle = Math.atan2(y1 - Uy, x1 - Ux);
// //   const midAngle = Math.atan2(ym - Uy, xm - Ux);
// //   const endAngle = Math.atan2(y2 - Uy, x2 - Ux);

// //   // Determine direction (cw/ccw) based on mid angle
// //   let counterClockwise = false;
// //   // Normalize angles to 0-2PI for comparison might be needed, but Math.atan2 is -PI to PI
// //   // Simple check: is mid angle "between" start and end in the CCW direction?
// //   // We'll rely on Three.js / Canvas arc drawing which handles this if we pass flags correctly.
  
// //   // Cross product to check turn direction
// //   const cross = (xm - x1) * (y2 - y1) - (ym - y1) * (x2 - x1);
// //   counterClockwise = cross > 0;

// //   return { cx: Ux, cy: Uy, radius, startAngle, endAngle, counterClockwise };
// // };

// // // --- 2. ROBUST PARSER ---

// // const tokenizeSExpr = (str) => {
// //   const regex = /\s*(\(|\)|"[^"]*"|[^\s()"]+)\s*/g;
// //   let token;
// //   const tokens = [];
// //   while ((token = regex.exec(str)) !== null) {
// //     if (token[1]) tokens.push(token[1]);
// //   }
// //   return tokens;
// // };

// // const parseSExpr = (tokens) => {
// //   if (tokens.length === 0) return undefined;
// //   const token = tokens.shift();
// //   if (token === "(") {
// //     const list = [];
// //     while (tokens.length > 0 && tokens[0] !== ")") {
// //       list.push(parseSExpr(tokens));
// //     }
// //     tokens.shift();
// //     return list;
// //   } else if (token === ")") {
// //     return null; 
// //   } else {
// //     return token.startsWith('"') ? token.slice(1, -1) : token;
// //   }
// // };

// // const findNode = (list, type) => {
// //   if (!Array.isArray(list)) return null;
// //   return list.find(item => Array.isArray(item) && item[0] === type);
// // };

// // const getFloat = (node, index = 1) => node && node[index] ? parseFloat(node[index]) : 0;
// // const getString = (node, index = 1) => node && node[index] ? node[index] : "";

// // const parseKiCadData = (fileContent) => {
// //   try {
// //     const tokens = tokenizeSExpr(fileContent);
// //     const tree = parseSExpr(tokens);

// //     if (!tree || tree[0] !== 'kicad_pcb') {
// //       throw new Error("Not a valid kicad_pcb file");
// //     }

// //     const board = {
// //       footprints: [],
// //       segments: [], 
// //       arcs: [],     // Curved tracks
// //       zones: [],    // Copper pours
// //       graphics: [], // Lines/Circles
// //       vias: [],
// //       minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity
// //     };

// //     const updateBounds = (x, y) => {
// //       if (x < board.minX) board.minX = x;
// //       if (y < board.minY) board.minY = y;
// //       if (x > board.maxX) board.maxX = x;
// //       if (y > board.maxY) board.maxY = y;
// //     };

// //     const parseAt = (node) => {
// //       const at = findNode(node, 'at');
// //       return {
// //         x: getFloat(at, 1),
// //         y: getFloat(at, 2),
// //         rot: getFloat(at, 3)
// //       };
// //     };

// //     tree.forEach(node => {
// //       if (!Array.isArray(node)) return;
// //       const type = node[0];

// //       // --- Tracks (Linear) ---
// //       if (type === 'segment') {
// //         const start = findNode(node, 'start');
// //         const end = findNode(node, 'end');
// //         const width = findNode(node, 'width');
// //         const layer = findNode(node, 'layer');
// //         if (start && end) {
// //           const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
// //           const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
// //           board.segments.push({
// //             x1: s.x, y1: s.y, x2: e.x, y2: e.y,
// //             width: getFloat(width, 1) || 0.2,
// //             layer: getString(layer, 1)
// //           });
// //           updateBounds(s.x, s.y); updateBounds(e.x, e.y);
// //         }
// //       }

// //       // --- Arcs (Tracks or Graphics) ---
// //       else if (type === 'arc' || type === 'gr_arc') {
// //         const start = findNode(node, 'start');
// //         const mid = findNode(node, 'mid');
// //         const end = findNode(node, 'end');
// //         const width = findNode(node, 'width');
// //         const layer = findNode(node, 'layer');
        
// //         if (start && mid && end) {
// //            const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
// //            const m = { x: getFloat(mid, 1), y: getFloat(mid, 2) };
// //            const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
           
// //            board.arcs.push({
// //              start: s, mid: m, end: e,
// //              width: getFloat(width, 1) || 0.2,
// //              layer: getString(layer, 1)
// //            });
// //            updateBounds(s.x, s.y); updateBounds(m.x, m.y); updateBounds(e.x, e.y);
// //         }
// //       }

// //       // --- Zones (Filled Polygons) ---
// //       else if (type === 'zone') {
// //         const layer = findNode(node, 'layer');
// //         const polygon = findNode(node, 'polygon'); // older
// //         const filled = findNode(node, 'filled_polygon'); // newer
// //         const targetPoly = filled || polygon; // use filled if available

// //         if (targetPoly) {
// //            const ptsNode = findNode(targetPoly, 'pts');
// //            if (ptsNode) {
// //              const points = [];
// //              ptsNode.forEach(pt => {
// //                if (Array.isArray(pt) && pt[0] === 'xy') {
// //                  points.push({ x: getFloat(pt, 1), y: getFloat(pt, 2) });
// //                  updateBounds(getFloat(pt, 1), getFloat(pt, 2));
// //                }
// //              });
// //              if (points.length > 2) {
// //                board.zones.push({
// //                  layer: getString(layer, 1),
// //                  points
// //                });
// //              }
// //            }
// //         }
// //       }

// //       // --- Graphics (Linear/Circle) ---
// //       else if (type === 'gr_line' || type === 'line' || type === 'gr_circle') {
// //         const layer = findNode(node, 'layer');
// //         const layerName = getString(layer, 1);
// //         const start = findNode(node, 'start') || findNode(node, 'center');
// //         const end = findNode(node, 'end');
        
// //         if (start && end) {
// //              const x1 = getFloat(start, 1);
// //              const y1 = getFloat(start, 2);
// //              const x2 = getFloat(end, 1);
// //              const y2 = getFloat(end, 2);
// //              let geometry = { type: type, x1, y1, x2, y2, layer: layerName };
// //              if (type === 'gr_circle') {
// //                 const dx = x1 - x2; const dy = y1 - y2;
// //                 geometry.radius = Math.sqrt(dx*dx + dy*dy);
// //              }
// //              board.graphics.push(geometry);
// //              if (layerName === 'Edge.Cuts') { updateBounds(x1, y1); updateBounds(x2, y2); }
// //         }
// //       }

// //       // --- Footprints ---
// //       else if (type === 'footprint' || type === 'module') {
// //         const at = parseAt(node);
// //         const refNode = node.find(n => Array.isArray(n) && n[0] === 'fp_text' && n[1] === 'reference');
// //         const ref = refNode ? getString(refNode, 2) : getString(node, 1);
// //         const layer = findNode(node, 'layer');
        
// //         const pads = [];
// //         node.forEach(child => {
// //           if (Array.isArray(child) && child[0] === 'pad') {
// //              const pAt = parseAt(child);
// //              const pSize = findNode(child, 'size');
// //              const pShape = child[2]; 
// //              const pLayers = findNode(child, 'layers');
// //              const rotated = rotateVector(pAt.x, pAt.y, at.rot);
// //              const absX = at.x + rotated.x;
// //              const absY = at.y + rotated.y;

// //              pads.push({
// //                type: child[1], shape: pShape,
// //                x: absX, y: absY,
// //                w: getFloat(pSize, 1), h: getFloat(pSize, 2),
// //                rot: at.rot + pAt.rot,
// //                layers: pLayers ? pLayers.slice(1) : ['F.Cu']
// //              });
// //              updateBounds(absX, absY);
// //           }
// //         });

// //         board.footprints.push({
// //           ref, x: at.x, y: at.y, rot: at.rot,
// //           layer: getString(layer, 1),
// //           pads
// //         });
// //       }
      
// //       // --- Vias ---
// //       else if (type === 'via') {
// //          const at = findNode(node, 'at');
// //          const size = findNode(node, 'size');
// //          if(at) {
// //              const vx = getFloat(at, 1); const vy = getFloat(at, 2);
// //              board.vias.push({ x: vx, y: vy, size: getFloat(size, 1) || 0.6 });
// //              updateBounds(vx, vy);
// //          }
// //       }
// //     });

// //     if (board.minX === Infinity) { board.minX = 0; board.minY = 0; board.maxX = 100; board.maxY = 100; }
// //     return board;
// //   } catch (e) { console.error("Parse Error:", e); return null; }
// // };

// // // --- 3. 3D VISUALIZATION COMPONENTS ---

// // const Zone3D = ({ points, layer }) => {
// //   const shape = useMemo(() => {
// //     if (!points || points.length < 3) return null;
// //     const s = new THREE.Shape();
// //     s.moveTo(points[0].x, -points[0].y);
// //     for (let i = 1; i < points.length; i++) s.lineTo(points[i].x, -points[i].y);
// //     s.closePath();
// //     return s;
// //   }, [points]);

// //   if (!shape) return null;
// //   const z = layer.includes('F.Cu') ? 0.04 : -1.64;
// //   const color = layer.includes('F.Cu') ? '#b87333' : '#3d85c6'; // Copper color

// //   return (
// //     <mesh position={[0, 0, z]}>
// //       <shapeGeometry args={[shape]} />
// //       <meshStandardMaterial color={color} side={THREE.DoubleSide} opacity={0.8} transparent />
// //     </mesh>
// //   );
// // };

// // const Arc3D = ({ start, mid, end, width, layer }) => {
// //   const params = useMemo(() => getArcParams(start.x, start.y, mid.x, mid.y, end.x, end.y), [start, mid, end]);
  
// //   if (!params) return null; // Fallback or linear?

// //   const curve = useMemo(() => {
// //     const curvePath = new THREE.CurvePath();
// //     // ThreeJS EllipseCurve: aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
// //     const ellipse = new THREE.EllipseCurve(
// //       params.cx, -params.cy,
// //       params.radius, params.radius,
// //       -params.startAngle, -params.endAngle,
// //       !params.counterClockwise, // Clockwise flag in Three is opposite? check visual
// //       0
// //     );
// //     return ellipse;
// //   }, [params]);

// //   const points = useMemo(() => curve.getPoints(20), [curve]);
// //   const z = layer === 'F.Cu' ? 0.06 : -1.66;
// //   const color = layer === 'F.Cu' ? '#ffaa00' : '#00aaff';

// //   return (
// //     <Line 
// //       points={points.map(p => [p.x, p.y, z])} // Line takes [x,y,z]
// //       color={color} 
// //       lineWidth={width * 5} // Approximate scale for Line
// //     />
// //   );
// // };

// // const Pad3D = ({ pad }) => {
// //   const isTop = pad.layers.some(l => l.includes('F.Cu'));
// //   const isBottom = pad.layers.some(l => l.includes('B.Cu'));
// //   const isMulti = isTop && isBottom;
// //   const z = isTop ? 0.06 : (isBottom ? -1.66 : 0);
  
// //   // High fidelity Gold/Silver
// //   const material = new THREE.MeshStandardMaterial({
// //       color: (pad.shape === 'rect' || pad.shape === 'roundrect') ? "#e5e7eb" : "#fbbf24", // Silver vs Gold
// //       roughness: 0.3,
// //       metalness: 0.9
// //   });

// //   // Through-Hole (Drill)
// //   if (isMulti || pad.type !== 'smd') {
// //       const holeSize = Math.min(pad.w, pad.h) * 0.6;
// //       return (
// //         <group position={[pad.x, -pad.y, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
// //              {/* Plated Through Hole */}
// //              <mesh rotation={[Math.PI/2, 0, 0]}>
// //                  <cylinderGeometry args={[holeSize/2 + 0.1, holeSize/2 + 0.1, 1.7, 16]} />
// //                  <primitive object={material} />
// //              </mesh>
// //              {/* Hole (Boolean subtract visual trick - simple cylinder) */}
// //              <mesh rotation={[Math.PI/2, 0, 0]}>
// //                  <cylinderGeometry args={[holeSize/2, holeSize/2, 1.75, 16]} />
// //                  <meshBasicMaterial color="#000" />
// //              </mesh>
// //              {/* Pad Ring Top */}
// //              <mesh position={[0, 0, 0.05]}>
// //                 {pad.shape === 'circle' 
// //                    ? <cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} />
// //                    : <boxGeometry args={[pad.w, pad.h, 0.02]} />
// //                 }
// //                 <primitive object={material} />
// //              </mesh>
// //              {/* Pad Ring Bottom */}
// //              <mesh position={[0, 0, -1.65]}>
// //                  {pad.shape === 'circle' 
// //                    ? <cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} />
// //                    : <boxGeometry args={[pad.w, pad.h, 0.02]} />
// //                 }
// //                 <primitive object={material} />
// //              </mesh>
// //         </group>
// //       )
// //   }

// //   // SMD
// //   return (
// //     <mesh position={[pad.x, -pad.y, z]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
// //       {pad.shape === 'circle' 
// //          ? <cylinderGeometry args={[pad.w/2, pad.w/2, 0.05, 32]} />
// //          : <boxGeometry args={[pad.w, pad.h, 0.05]} />
// //       }
// //       <primitive object={material} />
// //     </mesh>
// //   );
// // };

// // const Viewer3D = ({ data }) => {
// //   if (!data) return null;
// //   const width = Math.max((data.maxX - data.minX) * 1.2, 50);
// //   const height = Math.max((data.maxY - data.minY) * 1.2, 50);
// //   const cx = (data.maxX + data.minX) / 2;
// //   const cy = (data.maxY + data.minY) / 2;

// //   return (
// //     <Canvas camera={{ position: [0, 0, 150], fov: 35 }} shadows gl={{ antialias: true }}>
// //        <color attach="background" args={['#1a1a1a']} />
// //        <Stage environment="warehouse" intensity={0.7} adjustCamera={false}>
// //          <group>
// //            {/* Substrate */}
// //            <mesh position={[cx, -cy, -0.8]} receiveShadow>
// //                <boxGeometry args={[width, height, 1.6]} />
// //                <meshStandardMaterial color="#1a472a" roughness={0.3} metalness={0.1} />
// //            </mesh>

// //            {/* Zones */}
// //            {data.zones.map((zone, i) => <Zone3D key={`z-${i}`} {...zone} />)}

// //            {/* Tracks (Linear) */}
// //            {data.segments.map((seg, i) => {
// //               const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
// //               const len = Math.sqrt(dx*dx + dy*dy);
// //               const angle = Math.atan2(dy, dx);
// //               const z = seg.layer === 'F.Cu' ? 0.06 : -1.66;
// //               return (
// //                <mesh key={`tr-${i}`} position={[(seg.x1 + seg.x2)/2, -(seg.y1 + seg.y2)/2, z]} rotation={[0, 0, -angle]}>
// //                  <boxGeometry args={[len, seg.width, 0.02]} />
// //                  <meshStandardMaterial color={seg.layer === 'F.Cu' ? '#ffaa00' : '#00aaff'} />
// //                </mesh>
// //              )
// //            })}

// //            {/* Arcs */}
// //            {data.arcs.map((arc, i) => <Arc3D key={`arc-${i}`} {...arc} />)}
           
// //            {/* Pads */}
// //            {data.footprints.map((fp, i) => (
// //              <group key={`fp-${i}`}>
// //                 {/* Ref Text */}
// //                 <Text3D 
// //                   position={[fp.x, -fp.y, 1.0]} 
// //                   fontSize={0.6} color="white" 
// //                   anchorX="center" anchorY="middle"
// //                   rotation={[0, 0, THREE.MathUtils.degToRad(-fp.rot)]}
// //                 >
// //                   {fp.ref}
// //                 </Text3D>
// //                 {fp.pads.map((pad, j) => <Pad3D key={j} pad={pad} />)}
// //              </group>
// //            ))}
           
// //            {/* Vias */}
// //            {data.vias.map((via, i) => (
// //               <mesh key={`v-${i}`} position={[via.x, -via.y, 0]}>
// //                   <cylinderGeometry args={[via.size/2, via.size/2, 1.7, 16]} />
// //                   <meshStandardMaterial color="#b87333" />
// //               </mesh>
// //            ))}

// //            {/* Edge Cuts */}
// //            {data.graphics.filter(g => g.layer === 'Edge.Cuts').map((g, i) => {
// //                if(g.type === 'line' || g.type === 'gr_line') {
// //                    const dx = g.x2 - g.x1, dy = g.y2 - g.y1;
// //                    const len = Math.sqrt(dx*dx + dy*dy);
// //                    const ang = Math.atan2(dy, dx);
// //                    return (
// //                        <mesh key={`ec-${i}`} position={[(g.x1+g.x2)/2, -(g.y1+g.y2)/2, 0]} rotation={[0, 0, -ang]}>
// //                            <boxGeometry args={[len, 0.2, 1.62]} />
// //                            <meshBasicMaterial color="#fbbf24" />
// //                        </mesh>
// //                    )
// //                }
// //                return null;
// //            })}
// //          </group>
// //        </Stage>
// //        <OrbitControls makeDefault />
// //     </Canvas>
// //   );
// // };

// // // --- 4. 2D VIEWER (HIGH FIDELITY) ---

// // const Viewer2D = ({ data }) => {
// //   const canvasRef = useRef(null);
// //   const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
// //   const [isDragging, setIsDragging] = useState(false);
// //   const lastPos = useRef({ x: 0, y: 0 });

// //   useEffect(() => {
// //     if(!data || !canvasRef.current) return;
// //     const padding = 40;
// //     const boardW = data.maxX - data.minX;
// //     const boardH = data.maxY - data.minY;
// //     const scale = Math.min((canvasRef.current.width - padding*2) / boardW, (canvasRef.current.height - padding*2) / boardH);
// //     const midX = (data.minX + data.maxX) / 2;
// //     const midY = (data.minY + data.maxY) / 2;
// //     setTransform({
// //         k: scale,
// //         x: canvasRef.current.width / 2 - midX * scale,
// //         y: canvasRef.current.height / 2 - midY * scale
// //     });
// //   }, [data]);

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     if (!canvas || !data) return;
// //     const ctx = canvas.getContext('2d');
    
// //     // Reset
// //     ctx.fillStyle = '#222'; ctx.fillRect(0, 0, canvas.width, canvas.height);
// //     ctx.save();
// //     ctx.translate(transform.x, transform.y);
// //     ctx.scale(transform.k, transform.k);

// //     // 1. Board Substrate (Green)
// //     const boardW = data.maxX - data.minX;
// //     const boardH = data.maxY - data.minY;
// //     ctx.fillStyle = '#0a2e1d';
// //     ctx.fillRect(data.minX - 2, data.minY - 2, boardW + 4, boardH + 4);

// //     // 2. Zones (Copper Pours)
// //     data.zones.forEach(zone => {
// //        if (zone.points.length < 3) return;
// //        ctx.beginPath();
// //        ctx.moveTo(zone.points[0].x, zone.points[0].y);
// //        zone.points.forEach(p => ctx.lineTo(p.x, p.y));
// //        ctx.closePath();
// //        ctx.fillStyle = zone.layer === 'F.Cu' ? 'rgba(100, 30, 20, 0.4)' : 'rgba(30, 40, 100, 0.4)';
// //        ctx.fill();
// //     });

// //     // 3. Tracks & Arcs
// //     const drawTrack = (layer) => {
// //         const color = layer === 'F.Cu' ? '#b91c1c' : '#1d4ed8'; // Red / Blue
// //         ctx.strokeStyle = color;
// //         ctx.lineCap = 'round';
        
// //         // Linear
// //         data.segments.forEach(seg => {
// //             if(seg.layer !== layer) return;
// //             ctx.beginPath(); ctx.lineWidth = seg.width;
// //             ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2);
// //             ctx.stroke();
// //         });

// //         // Arcs
// //         data.arcs.forEach(arc => {
// //             if(arc.layer !== layer) return;
// //             const p = getArcParams(arc.start.x, arc.start.y, arc.mid.x, arc.mid.y, arc.end.x, arc.end.y);
// //             if (!p) return;
// //             ctx.beginPath(); ctx.lineWidth = arc.width;
// //             ctx.arc(p.cx, p.cy, p.radius, p.startAngle, p.endAngle, p.counterClockwise);
// //             ctx.stroke();
// //         });
// //     };
    
// //     drawTrack('B.Cu'); // Bottom first
// //     drawTrack('F.Cu'); // Top second

// //     // 4. Pads
// //     data.footprints.forEach(fp => {
// //        fp.pads.forEach(pad => {
// //           ctx.save();
// //           ctx.translate(pad.x, pad.y);
// //           ctx.rotate(pad.rot * Math.PI / 180);
          
// //           // Color logic: Gold for Top, dimmed for Bottom
// //           const isTop = pad.layers.some(l => l.includes('F.Cu'));
// //           ctx.fillStyle = isTop ? '#fcd34d' : '#9ca3af'; 

// //           if(pad.shape === 'circle') {
// //              ctx.beginPath(); ctx.arc(0, 0, pad.w/2, 0, 2*Math.PI); ctx.fill();
// //           } else if (pad.shape === 'oval') {
// //               ctx.beginPath(); ctx.ellipse(0, 0, pad.w/2, pad.h/2, 0, 0, 2*Math.PI); ctx.fill();
// //           } else {
// //              ctx.fillRect(-pad.w/2, -pad.h/2, pad.w, pad.h);
// //           }
          
// //           // Drill Hole
// //           if(pad.type !== 'smd') {
// //               ctx.fillStyle = '#000';
// //               ctx.beginPath(); 
// //               const size = Math.min(pad.w, pad.h) * 0.6;
// //               ctx.arc(0, 0, size/2, 0, 2*Math.PI); 
// //               ctx.fill();
// //           }
// //           ctx.restore();
// //        });
       
// //        // Silk Ref
// //        if (fp.layer === 'F.Cu' || !fp.layer) { // Only front silk usually readable
// //           ctx.fillStyle = 'white';
// //           ctx.font = '1px Arial'; // Scaled font
// //           ctx.fillText(fp.ref, fp.x, fp.y);
// //        }
// //     });

// //     // 5. Vias
// //     data.vias.forEach(via => {
// //        ctx.fillStyle = '#fbbf24';
// //        ctx.beginPath(); ctx.arc(via.x, via.y, via.size/2, 0, 2*Math.PI); ctx.fill();
// //        ctx.fillStyle = '#000';
// //        ctx.beginPath(); ctx.arc(via.x, via.y, via.size/4, 0, 2*Math.PI); ctx.fill();
// //     });

// //     // 6. Graphics (Silk/Edge)
// //     data.graphics.forEach(g => {
// //         ctx.lineWidth = 0.15;
// //         if (g.layer === 'Edge.Cuts') ctx.strokeStyle = '#f59e0b';
// //         else if (g.layer === 'F.SilkS') ctx.strokeStyle = 'white';
// //         else ctx.strokeStyle = 'rgba(255,255,255,0.2)';

// //         if(g.type === 'line' || g.type === 'gr_line') {
// //             ctx.beginPath(); ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x2, g.y2); ctx.stroke();
// //         } else if (g.type === 'gr_circle') {
// //             ctx.beginPath(); ctx.arc(g.x1, g.y1, g.radius, 0, 2*Math.PI); ctx.stroke();
// //         }
// //     });

// //     ctx.restore();
// //   }, [data, transform]);

// //   // Interaction handlers
// //   const handleWheel = (e) => {
// //     e.preventDefault();
// //     const zoom = e.deltaY < 0 ? 1.1 : 0.9;
// //     setTransform(t => ({ ...t, k: Math.max(0.1, Math.min(100, t.k * zoom)) }));
// //   };
// //   const handleMove = (e) => {
// //     if(isDragging) {
// //        setTransform(t => ({ ...t, x: t.x + e.movementX, y: t.y + e.movementY }));
// //     }
// //   };

// //   return (
// //     <div 
// //       className="w-full h-full cursor-move bg-gray-900 overflow-hidden relative"
// //       onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}
// //       onMouseMove={handleMove} onWheel={handleWheel}
// //     >
// //       <div className="absolute top-2 left-2 text-white/50 text-xs pointer-events-none z-10">Scroll to Zoom • Drag to Pan</div>
// //       <canvas ref={canvasRef} width={1600} height={1200} className="w-full h-full" />
// //     </div>
// //   );
// // };

// // // --- 5. APP SHELL ---

// // function App() {
// //   const [fileContent, setFileContent] = useState(null);
// //   const [boardData, setBoardData] = useState(null);
// //   const [viewMode, setViewMode] = useState('3d'); 
// //   const [loading, setLoading] = useState(false);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       setFileContent(evt.target.result);
// //       const parsed = parseKiCadData(evt.target.result);
// //       if (parsed) setBoardData(parsed);
// //       else alert("Parse failed.");
// //     };
// //     reader.readAsText(file);
// //   };

// //   const styles = {
// //     container: { display: 'flex', height: '100vh', width: '100vw', background: '#111', color: 'white', fontFamily: 'Inter, sans-serif' },
// //     sidebar: { width: '300px', background: '#18181b', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column' },
// //     main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// //     header: { height: '50px', background: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' },
// //     btn: (active) => ({ flex: 1, padding: '8px', background: active ? '#10b981' : 'transparent', border: 'none', color: active ? 'white' : '#71717a', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }),
// //     uploadBtn: { width: '100%', padding: '10px', background: '#27272a', border: '1px dashed #52525b', color: '#a1a1aa', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', fontSize: '13px' }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.sidebar}>
// //         <div style={{ padding: '20px', borderBottom: '1px solid #27272a' }}>
// //            <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}><Cpu size={20}/> KiCad View</h2>
// //         </div>
// //         <div style={{ padding: '20px', gap: '20px', display: 'flex', flexDirection: 'column' }}>
// //            <div>
// //               <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px' }}>PROJECT FILE</div>
// //               <label style={styles.uploadBtn}>
// //                  <input type="file" hidden accept=".kicad_pcb" onChange={handleFileUpload} />
// //                  {boardData ? "File Loaded" : "Click to Upload .kicad_pcb"}
// //               </label>
// //            </div>
           
// //            <div>
// //               <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px' }}>VIEW MODE</div>
// //               <div style={{ display: 'flex', background: '#27272a', padding: '2px', borderRadius: '6px' }}>
// //                  <button style={styles.btn(viewMode === '2d')} onClick={() => setViewMode('2d')}>2D View</button>
// //                  <button style={styles.btn(viewMode === '3d')} onClick={() => setViewMode('3d')}>3D Render</button>
// //               </div>
// //            </div>

// //            {boardData && (
// //              <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
// //                 <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>BOARD STATS</div>
// //                 <div style={{ fontSize: '12px', color: '#d1fae5' }}>Components: {boardData.footprints.length}</div>
// //                 <div style={{ fontSize: '12px', color: '#d1fae5' }}>Tracks: {boardData.segments.length}</div>
// //                 <div style={{ fontSize: '12px', color: '#d1fae5' }}>Vias: {boardData.vias.length}</div>
// //              </div>
// //            )}
// //         </div>
// //       </div>

// //       <div style={styles.main}>
// //         <div style={styles.header}>
// //            <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{fileContent ? "Project Loaded" : "No File"}</div>
// //            <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#71717a' }}>
// //               <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b91c1c' }}></span> Front</span>
// //               <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1d4ed8' }}></span> Back</span>
// //            </div>
// //         </div>
// //         <div style={{ flex: 1, position: 'relative' }}>
// //            {!boardData ? (
// //              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', flexDirection: 'column', gap: '10px' }}>
// //                 <Upload size={40} />
// //                 <div>Upload a KiCad PCB file to visualize</div>
// //              </div>
// //            ) : (
// //              viewMode === '3d' ? <Viewer3D data={boardData} /> : <Viewer2D data={boardData} />
// //            )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;


// // import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// // import { Canvas } from '@react-three/fiber';
// // import { OrbitControls, Stage, Text as Text3D, Line } from '@react-three/drei';
// // import * as THREE from 'three';
// // import { 
// //   Upload, 
// //   Layers, 
// //   Activity, 
// //   Settings, 
// //   Cpu, 
// //   Maximize,
// //   FileCode,
// //   AlertCircle,
// //   CheckCircle2,
// //   Loader2,
// //   Search
// // } from 'lucide-react';

// // // --- 1. ADVANCED MATH UTILITIES ---

// // const rotateVector = (x, y, angleDeg) => {
// //   const rad = (angleDeg * Math.PI) / 180;
// //   const cos = Math.cos(rad);
// //   const sin = Math.sin(rad);
// //   return {
// //     x: x * cos - y * sin,
// //     y: x * sin + y * cos
// //   };
// // };

// // const getArcParams = (x1, y1, xm, ym, x2, y2) => {
// //   const D = 2 * (x1 * (ym - y2) + xm * (y2 - y1) + x2 * (y1 - ym));
// //   if (Math.abs(D) < 0.0001) return null; // Collinear

// //   const Ux = ((x1**2 + y1**2) * (ym - y2) + (xm**2 + ym**2) * (y2 - y1) + (x2**2 + y2**2) * (y1 - ym)) / D;
// //   const Uy = ((x1**2 + y1**2) * (x2 - xm) + (xm**2 + ym**2) * (x1 - x2) + (x2**2 + y2**2) * (xm - x1)) / D;
  
// //   const radius = Math.sqrt((x1 - Ux)**2 + (y1 - Uy)**2);
// //   const startAngle = Math.atan2(y1 - Uy, x1 - Ux);
// //   const endAngle = Math.atan2(y2 - Uy, x2 - Ux);
  
// //   // Mid point check for direction
// //   const cross = (xm - x1) * (y2 - y1) - (ym - y1) * (x2 - x1);
// //   const counterClockwise = cross > 0;

// //   return { cx: Ux, cy: Uy, radius, startAngle, endAngle, counterClockwise };
// // };

// // // --- 2. ROBUST PARSER ---

// // const tokenizeSExpr = (str) => {
// //   const regex = /\s*(\(|\)|"[^"]*"|[^\s()"]+)\s*/g;
// //   let token;
// //   const tokens = [];
// //   while ((token = regex.exec(str)) !== null) {
// //     if (token[1]) tokens.push(token[1]);
// //   }
// //   return tokens;
// // };

// // const parseSExpr = (tokens) => {
// //   if (tokens.length === 0) return undefined;
// //   const token = tokens.shift();
// //   if (token === "(") {
// //     const list = [];
// //     while (tokens.length > 0 && tokens[0] !== ")") {
// //       list.push(parseSExpr(tokens));
// //     }
// //     tokens.shift();
// //     return list;
// //   } else if (token === ")") {
// //     return null; 
// //   } else {
// //     return token.startsWith('"') ? token.slice(1, -1) : token;
// //   }
// // };

// // const findNode = (list, type) => {
// //   if (!Array.isArray(list)) return null;
// //   return list.find(item => Array.isArray(item) && item[0] === type);
// // };

// // const getFloat = (node, index = 1) => node && node[index] ? parseFloat(node[index]) : 0;
// // const getString = (node, index = 1) => node && node[index] ? node[index] : "";

// // const parseKiCadData = (fileContent) => {
// //   try {
// //     const tokens = tokenizeSExpr(fileContent);
// //     const tree = parseSExpr(tokens);

// //     if (!tree || tree[0] !== 'kicad_pcb') {
// //       throw new Error("Not a valid kicad_pcb file");
// //     }

// //     const board = {
// //       footprints: [],
// //       segments: [], 
// //       arcs: [],
// //       zones: [],
// //       graphics: [],
// //       vias: [],
// //       minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity
// //     };

// //     const updateBounds = (x, y) => {
// //       if (x < board.minX) board.minX = x;
// //       if (y < board.minY) board.minY = y;
// //       if (x > board.maxX) board.maxX = x;
// //       if (y > board.maxY) board.maxY = y;
// //     };

// //     const parseAt = (node) => {
// //       const at = findNode(node, 'at');
// //       return {
// //         x: getFloat(at, 1),
// //         y: getFloat(at, 2),
// //         rot: getFloat(at, 3)
// //       };
// //     };

// //     tree.forEach(node => {
// //       if (!Array.isArray(node)) return;
// //       const type = node[0];

// //       if (type === 'segment') {
// //         const start = findNode(node, 'start');
// //         const end = findNode(node, 'end');
// //         const width = findNode(node, 'width');
// //         const layer = findNode(node, 'layer');
// //         if (start && end) {
// //           const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
// //           const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
// //           board.segments.push({
// //             x1: s.x, y1: s.y, x2: e.x, y2: e.y,
// //             width: getFloat(width, 1) || 0.2,
// //             layer: getString(layer, 1)
// //           });
// //           updateBounds(s.x, s.y); updateBounds(e.x, e.y);
// //         }
// //       }
// //       else if (type === 'arc' || type === 'gr_arc') {
// //         const start = findNode(node, 'start');
// //         const mid = findNode(node, 'mid');
// //         const end = findNode(node, 'end');
// //         const width = findNode(node, 'width');
// //         const layer = findNode(node, 'layer');
// //         if (start && mid && end) {
// //            const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
// //            const m = { x: getFloat(mid, 1), y: getFloat(mid, 2) };
// //            const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
// //            board.arcs.push({
// //              start: s, mid: m, end: e,
// //              width: getFloat(width, 1) || 0.2,
// //              layer: getString(layer, 1)
// //            });
// //            updateBounds(s.x, s.y); updateBounds(m.x, m.y); updateBounds(e.x, e.y);
// //         }
// //       }
// //       else if (type === 'zone') {
// //         const layer = findNode(node, 'layer');
// //         const polygon = findNode(node, 'polygon') || findNode(node, 'filled_polygon');
// //         if (polygon) {
// //            const ptsNode = findNode(polygon, 'pts');
// //            if (ptsNode) {
// //              const points = [];
// //              ptsNode.forEach(pt => {
// //                if (Array.isArray(pt) && pt[0] === 'xy') {
// //                  points.push({ x: getFloat(pt, 1), y: getFloat(pt, 2) });
// //                  updateBounds(getFloat(pt, 1), getFloat(pt, 2));
// //                }
// //              });
// //              if (points.length > 2) board.zones.push({ layer: getString(layer, 1), points });
// //            }
// //         }
// //       }
// //       else if (type === 'gr_line' || type === 'line' || type === 'gr_circle') {
// //         const layer = findNode(node, 'layer');
// //         const layerName = getString(layer, 1);
// //         const start = findNode(node, 'start') || findNode(node, 'center');
// //         const end = findNode(node, 'end');
// //         if (start && end) {
// //              const x1 = getFloat(start, 1);
// //              const y1 = getFloat(start, 2);
// //              const x2 = getFloat(end, 1);
// //              const y2 = getFloat(end, 2);
// //              let geometry = { type: type, x1, y1, x2, y2, layer: layerName };
// //              if (type === 'gr_circle') {
// //                 const dx = x1 - x2; const dy = y1 - y2;
// //                 geometry.radius = Math.sqrt(dx*dx + dy*dy);
// //              }
// //              board.graphics.push(geometry);
// //              if (layerName === 'Edge.Cuts') { updateBounds(x1, y1); updateBounds(x2, y2); }
// //         }
// //       }
// //       else if (type === 'footprint' || type === 'module') {
// //         const at = parseAt(node);
// //         const refNode = node.find(n => Array.isArray(n) && n[0] === 'fp_text' && n[1] === 'reference');
// //         const ref = refNode ? getString(refNode, 2) : getString(node, 1);
// //         const layer = findNode(node, 'layer');
// //         const pads = [];
// //         node.forEach(child => {
// //           if (Array.isArray(child) && child[0] === 'pad') {
// //              const pAt = parseAt(child);
// //              const pSize = findNode(child, 'size');
// //              const pShape = child[2]; 
// //              const pLayers = findNode(child, 'layers');
// //              const rotated = rotateVector(pAt.x, pAt.y, at.rot);
// //              const absX = at.x + rotated.x;
// //              const absY = at.y + rotated.y;
// //              pads.push({
// //                type: child[1], shape: pShape,
// //                x: absX, y: absY,
// //                w: getFloat(pSize, 1), h: getFloat(pSize, 2),
// //                rot: at.rot + pAt.rot,
// //                layers: pLayers ? pLayers.slice(1) : ['F.Cu']
// //              });
// //              updateBounds(absX, absY);
// //           }
// //         });
// //         board.footprints.push({ ref, x: at.x, y: at.y, rot: at.rot, layer: getString(layer, 1), pads });
// //       }
// //       else if (type === 'via') {
// //          const at = findNode(node, 'at');
// //          const size = findNode(node, 'size');
// //          if(at) {
// //              const vx = getFloat(at, 1); const vy = getFloat(at, 2);
// //              board.vias.push({ x: vx, y: vy, size: getFloat(size, 1) || 0.6 });
// //              updateBounds(vx, vy);
// //          }
// //       }
// //     });

// //     if (board.minX === Infinity) { board.minX = 0; board.minY = 0; board.maxX = 100; board.maxY = 100; }
// //     return board;
// //   } catch (e) { console.error("Parse Error:", e); return null; }
// // };

// // // --- 3. 3D VISUALIZATION COMPONENTS (Optimized) ---

// // const Zone3D = ({ points, layer }) => {
// //   const shape = useMemo(() => {
// //     if (!points || points.length < 3) return null;
// //     const s = new THREE.Shape();
// //     s.moveTo(points[0].x, -points[0].y);
// //     for (let i = 1; i < points.length; i++) s.lineTo(points[i].x, -points[i].y);
// //     s.closePath();
// //     return s;
// //   }, [points]);
// //   if (!shape) return null;
// //   const z = layer.includes('F.Cu') ? 0.04 : -1.64;
// //   const color = layer.includes('F.Cu') ? '#b87333' : '#3d85c6';
// //   return (
// //     <mesh position={[0, 0, z]}>
// //       <shapeGeometry args={[shape]} />
// //       <meshStandardMaterial color={color} side={THREE.DoubleSide} opacity={0.8} transparent />
// //     </mesh>
// //   );
// // };

// // const Arc3D = ({ start, mid, end, width, layer }) => {
// //   const params = useMemo(() => getArcParams(start.x, start.y, mid.x, mid.y, end.x, end.y), [start, mid, end]);
// //   if (!params) return null;
// //   const curve = useMemo(() => new THREE.EllipseCurve(
// //       params.cx, -params.cy, params.radius, params.radius,
// //       -params.startAngle, -params.endAngle, !params.counterClockwise, 0
// //   ), [params]);
// //   const points = useMemo(() => curve.getPoints(32), [curve]);
// //   const z = layer === 'F.Cu' ? 0.06 : -1.66;
// //   const color = layer === 'F.Cu' ? '#ffaa00' : '#00aaff';
// //   return <Line points={points.map(p => [p.x, p.y, z])} color={color} lineWidth={width * 5} />;
// // };

// // const Pad3D = ({ pad }) => {
// //   const isTop = pad.layers.some(l => l.includes('F.Cu'));
// //   const isBottom = pad.layers.some(l => l.includes('B.Cu'));
// //   const isMulti = isTop && isBottom;
// //   const z = isTop ? 0.06 : (isBottom ? -1.66 : 0);
// //   const material = new THREE.MeshStandardMaterial({
// //       color: (pad.shape === 'rect' || pad.shape === 'roundrect') ? "#e5e7eb" : "#fbbf24",
// //       roughness: 0.3, metalness: 0.9
// //   });
// //   if (isMulti || pad.type !== 'smd') {
// //       const holeSize = Math.min(pad.w, pad.h) * 0.6;
// //       return (
// //         <group position={[pad.x, -pad.y, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
// //              <mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[holeSize/2 + 0.1, holeSize/2 + 0.1, 1.7, 16]} /><primitive object={material} /></mesh>
// //              <mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[holeSize/2, holeSize/2, 1.75, 16]} /><meshBasicMaterial color="#000" /></mesh>
// //              <mesh position={[0, 0, 0.05]}><cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} /><primitive object={material} /></mesh>
// //              <mesh position={[0, 0, -1.65]}><cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} /><primitive object={material} /></mesh>
// //         </group>
// //       )
// //   }
// //   return (
// //     <mesh position={[pad.x, -pad.y, z]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
// //       {pad.shape === 'circle' ? <cylinderGeometry args={[pad.w/2, pad.w/2, 0.05, 32]} /> : <boxGeometry args={[pad.w, pad.h, 0.05]} />}
// //       <primitive object={material} />
// //     </mesh>
// //   );
// // };

// // const Viewer3D = ({ data }) => {
// //   if (!data) return null;
// //   const width = Math.max((data.maxX - data.minX) * 1.2, 50);
// //   const height = Math.max((data.maxY - data.minY) * 1.2, 50);
// //   const cx = (data.maxX + data.minX) / 2;
// //   const cy = (data.maxY + data.minY) / 2;
// //   return (
// //     <Canvas camera={{ position: [0, 0, 150], fov: 35 }} shadows gl={{ antialias: true }}>
// //        <color attach="background" args={['#1a1a1a']} />
// //        <Stage environment="warehouse" intensity={0.7} adjustCamera={false}>
// //          <group>
// //            <mesh position={[cx, -cy, -0.8]} receiveShadow><boxGeometry args={[width, height, 1.6]} /><meshStandardMaterial color="#1a472a" roughness={0.3} metalness={0.1} /></mesh>
// //            {data.zones.map((zone, i) => <Zone3D key={`z-${i}`} {...zone} />)}
// //            {data.segments.map((seg, i) => {
// //               const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
// //               const len = Math.sqrt(dx*dx + dy*dy);
// //               const angle = Math.atan2(dy, dx);
// //               const z = seg.layer === 'F.Cu' ? 0.06 : -1.66;
// //               return (<mesh key={`tr-${i}`} position={[(seg.x1 + seg.x2)/2, -(seg.y1 + seg.y2)/2, z]} rotation={[0, 0, -angle]}><boxGeometry args={[len, seg.width, 0.02]} /><meshStandardMaterial color={seg.layer === 'F.Cu' ? '#ffaa00' : '#00aaff'} /></mesh>)
// //            })}
// //            {data.arcs.map((arc, i) => <Arc3D key={`arc-${i}`} {...arc} />)}
// //            {data.footprints.map((fp, i) => (
// //              <group key={`fp-${i}`}>
// //                 {fp.pads.map((pad, j) => <Pad3D key={j} pad={pad} />)}
// //              </group>
// //            ))}
// //            {data.vias.map((via, i) => (<mesh key={`v-${i}`} position={[via.x, -via.y, 0]}><cylinderGeometry args={[via.size/2, via.size/2, 1.7, 16]} /><meshStandardMaterial color="#b87333" /></mesh>))}
// //            {data.graphics.filter(g => g.layer === 'Edge.Cuts').map((g, i) => {
// //                if(g.type === 'line' || g.type === 'gr_line') {
// //                    const dx = g.x2 - g.x1, dy = g.y2 - g.y1; const len = Math.sqrt(dx*dx + dy*dy); const ang = Math.atan2(dy, dx);
// //                    return (<mesh key={`ec-${i}`} position={[(g.x1+g.x2)/2, -(g.y1+g.y2)/2, 0]} rotation={[0, 0, -ang]}><boxGeometry args={[len, 0.2, 1.62]} /><meshBasicMaterial color="#fbbf24" /></mesh>)
// //                } return null;
// //            })}
// //          </group>
// //        </Stage>
// //        <OrbitControls makeDefault />
// //     </Canvas>
// //   );
// // };

// // // --- 4. 2D VIEWER (High Precision Interaction) ---

// // const Viewer2D = ({ data }) => {
// //   const canvasRef = useRef(null);
// //   const [transform, setTransform] = useState({ x: 0, y: 0, k: 3 }); // Initial zoom
// //   const [isDragging, setIsDragging] = useState(false);
// //   const lastPos = useRef({ x: 0, y: 0 });

// //   // Initial Centering
// //   useEffect(() => {
// //     if(!data || !canvasRef.current) return;
// //     const canvas = canvasRef.current;
// //     const padding = 50;
// //     const boardW = data.maxX - data.minX;
// //     const boardH = data.maxY - data.minY;
// //     const scale = Math.min((canvas.width - padding) / boardW, (canvas.height - padding) / boardH);
// //     const midX = (data.minX + data.maxX) / 2;
// //     const midY = (data.minY + data.maxY) / 2;
    
// //     // Center logic
// //     setTransform({
// //         k: scale,
// //         x: (canvas.width / 2) - (midX * scale),
// //         y: (canvas.height / 2) - (midY * scale)
// //     });
// //   }, [data]);

// //   const drawGrid = (ctx, width, height, scale, offsetX, offsetY) => {
// //       ctx.save();
// //       ctx.strokeStyle = '#333';
// //       ctx.lineWidth = 1 / scale; // Keep hairline
// //       ctx.beginPath();
      
// //       const gridSize = 10; // 10mm grid
// //       // Calculate visible bounds
// //       const startX = -offsetX / scale;
// //       const startY = -offsetY / scale;
// //       const endX = (width - offsetX) / scale;
// //       const endY = (height - offsetY) / scale;

// //       // Vertical lines
// //       for(let x = Math.floor(startX/gridSize)*gridSize; x < endX; x+=gridSize) {
// //          ctx.moveTo(x, startY); ctx.lineTo(x, endY);
// //       }
// //       // Horizontal lines
// //       for(let y = Math.floor(startY/gridSize)*gridSize; y < endY; y+=gridSize) {
// //          ctx.moveTo(startX, y); ctx.lineTo(endX, y);
// //       }
// //       ctx.stroke();
// //       ctx.restore();
// //   };

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     if (!canvas || !data) return;
// //     const ctx = canvas.getContext('2d');
    
// //     // Clear & Background
// //     ctx.fillStyle = '#111827'; 
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     ctx.save();
// //     ctx.translate(transform.x, transform.y);
// //     ctx.scale(transform.k, transform.k);
    
// //     // Draw Grid (in world coordinates)
// //     drawGrid(ctx, canvas.width, canvas.height, transform.k, transform.x, transform.y);

// //     // Board Substrate
// //     const boardW = data.maxX - data.minX;
// //     const boardH = data.maxY - data.minY;
// //     ctx.fillStyle = '#064e3b'; // Deep PCB Green
// //     ctx.fillRect(data.minX, data.minY, boardW, boardH);

// //     // Zones
// //     data.zones.forEach(zone => {
// //        if (zone.points.length < 3) return;
// //        ctx.beginPath();
// //        ctx.moveTo(zone.points[0].x, zone.points[0].y);
// //        zone.points.forEach(p => ctx.lineTo(p.x, p.y));
// //        ctx.closePath();
// //        ctx.fillStyle = zone.layer === 'F.Cu' ? 'rgba(180, 83, 9, 0.4)' : 'rgba(30, 58, 138, 0.4)';
// //        ctx.fill();
// //     });

// //     // Tracks helper
// //     const drawTrack = (layer) => {
// //         const color = layer === 'F.Cu' ? '#dc2626' : '#2563eb';
// //         ctx.strokeStyle = color;
// //         ctx.lineCap = 'round';
// //         data.segments.forEach(seg => {
// //             if(seg.layer !== layer) return;
// //             ctx.beginPath(); ctx.lineWidth = seg.width;
// //             ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
// //         });
// //         data.arcs.forEach(arc => {
// //             if(arc.layer !== layer) return;
// //             const p = getArcParams(arc.start.x, arc.start.y, arc.mid.x, arc.mid.y, arc.end.x, arc.end.y);
// //             if (!p) return;
// //             ctx.beginPath(); ctx.lineWidth = arc.width;
// //             ctx.arc(p.cx, p.cy, p.radius, p.startAngle, p.endAngle, p.counterClockwise);
// //             ctx.stroke();
// //         });
// //     };
// //     drawTrack('B.Cu'); drawTrack('F.Cu');

// //     // Pads
// //     data.footprints.forEach(fp => {
// //        fp.pads.forEach(pad => {
// //           ctx.save(); ctx.translate(pad.x, pad.y); ctx.rotate(pad.rot * Math.PI / 180);
// //           const isTop = pad.layers.some(l => l.includes('F.Cu'));
// //           ctx.fillStyle = isTop ? '#fbbf24' : '#94a3b8'; // Gold vs Silver
// //           if(pad.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, pad.w/2, 0, 2*Math.PI); ctx.fill(); }
// //           else if (pad.shape === 'oval') { ctx.beginPath(); ctx.ellipse(0, 0, pad.w/2, pad.h/2, 0, 0, 2*Math.PI); ctx.fill(); }
// //           else { ctx.fillRect(-pad.w/2, -pad.h/2, pad.w, pad.h); }
// //           // Drill
// //           if(pad.type !== 'smd') { ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, 0, Math.min(pad.w, pad.h)*0.3, 0, 2*Math.PI); ctx.fill(); }
// //           ctx.restore();
// //        });
// //        if (fp.layer === 'F.Cu' || !fp.layer) {
// //           ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '1px monospace'; ctx.fillText(fp.ref, fp.x, fp.y);
// //        }
// //     });

// //     // Vias
// //     data.vias.forEach(via => {
// //        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(via.x, via.y, via.size/2, 0, 2*Math.PI); ctx.fill();
// //        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(via.x, via.y, via.size/4, 0, 2*Math.PI); ctx.fill();
// //     });

// //     // Graphics
// //     data.graphics.forEach(g => {
// //         ctx.lineWidth = 0.15;
// //         ctx.strokeStyle = g.layer === 'Edge.Cuts' ? '#fbbf24' : 'white';
// //         if(g.type === 'line' || g.type === 'gr_line') { ctx.beginPath(); ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x2, g.y2); ctx.stroke(); }
// //         else if (g.type === 'gr_circle') { ctx.beginPath(); ctx.arc(g.x1, g.y1, g.radius, 0, 2*Math.PI); ctx.stroke(); }
// //     });
// //     ctx.restore();
// //   }, [data, transform]);

// //   // Zoom to Mouse Logic
// //   const handleWheel = (e) => {
// //     e.preventDefault();
// //     const canvas = canvasRef.current;
// //     if(!canvas) return;
    
// //     const rect = canvas.getBoundingClientRect();
// //     const mouseX = e.clientX - rect.left;
// //     const mouseY = e.clientY - rect.top;

// //     // Convert mouse screen pos to world space before zoom
// //     const worldX = (mouseX - transform.x) / transform.k;
// //     const worldY = (mouseY - transform.y) / transform.k;

// //     const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85; // Slower, smoother zoom
// //     const newK = Math.max(0.5, Math.min(200, transform.k * zoomFactor));

// //     // Calculate new translate to keep world point under mouse
// //     const newX = mouseX - worldX * newK;
// //     const newY = mouseY - worldY * newK;

// //     setTransform({ k: newK, x: newX, y: newY });
// //   };

// //   const handleMouseDown = (e) => { setIsDragging(true); lastPos.current = { x: e.clientX, y: e.clientY }; };
// //   const handleMouseUp = () => setIsDragging(false);
// //   const handleMouseMove = (e) => {
// //     if(isDragging) {
// //        const dx = e.clientX - lastPos.current.x;
// //        const dy = e.clientY - lastPos.current.y;
// //        lastPos.current = { x: e.clientX, y: e.clientY };
// //        setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
// //     }
// //   };

// //   return (
// //     <div className="w-full h-full cursor-crosshair bg-gray-900 relative overflow-hidden" 
// //          onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
// //          onMouseMove={handleMouseMove} onWheel={handleWheel}>
// //       <div className="absolute top-4 left-4 text-emerald-400 text-xs font-mono pointer-events-none z-10 bg-black/50 px-2 py-1 rounded border border-emerald-900">
// //          ZOOM: {(transform.k).toFixed(1)}x | PAN: {transform.x.toFixed(0)},{transform.y.toFixed(0)}
// //       </div>
// //       <canvas ref={canvasRef} width={1600} height={1200} className="w-full h-full block" />
// //     </div>
// //   );
// // };

// // // --- 5. APP SHELL ---

// // function App() {
// //   const [fileContent, setFileContent] = useState(null);
// //   const [boardData, setBoardData] = useState(null);
// //   const [viewMode, setViewMode] = useState('2d'); 
  
// //   // API Status State
// //   const [apiStatus, setApiStatus] = useState('idle'); // idle, uploading, processing, success, error
// //   const [apiLog, setApiLog] = useState([]);
// //   const [apiUrl, setApiUrl] = useState("https://apis.boltchem.com/v4/tools/cypress");

// //   const addLog = (msg) => setApiLog(prev => [...prev, `> ${msg}`]);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       setFileContent(evt.target.result);
// //       const parsed = parseKiCadData(evt.target.result);
// //       if (parsed) {
// //           setBoardData(parsed);
// //           setApiStatus('idle'); // Reset API status on new file
// //           setApiLog([`Loaded ${file.name}`, `Parsed ${parsed.footprints.length} components`]);
// //       }
// //     };
// //     reader.readAsText(file);
// //   };

// //   const handleApiRun = async () => {
// //      if(!fileContent) return;
// //      setApiStatus('uploading');
// //      addLog("Connecting to BoltChem endpoint...");
     
// //      try {
// //          // Step 1: Simulate Upload delay
// //          await new Promise(r => setTimeout(r, 1000));
// //          setApiStatus('processing');
// //          addLog("Uploading PCB data...");
         
// //          const response = await fetch(apiUrl, {
// //              method: 'POST',
// //              headers: { 'Content-Type': 'application/json' },
// //              body: JSON.stringify({
// //                  pcb_data: fileContent,
// //                  meta: { version: "1.0", tool: "ReactViewer" }
// //              })
// //          });
         
// //          // Note: Since we don't have a real valid key/endpoint response structure, we handle generic responses
// //          if(response.ok) {
// //              const data = await response.json();
// //              setApiStatus('success');
// //              addLog("Analysis Complete.");
// //              addLog(`Result ID: ${data.id || 'N/A'}`);
// //          } else {
// //              // Fallback for demo if endpoint fails (likely 404/401)
// //              throw new Error(`API Error ${response.status}: Endpoint unreachable`);
// //          }
// //      } catch (e) {
// //          setApiStatus('error');
// //          addLog(`Error: ${e.message}`);
// //          // Demo Fallback to show "Success" UI even if API fails for visualization purposes
// //          setTimeout(() => {
// //              addLog("⚠️ Switch to offline mode.");
// //          }, 1000);
// //      }
// //   };

// //   const styles = {
// //     container: { display: 'flex', height: '100vh', width: '100vw', background: '#09090b', color: '#e4e4e7', fontFamily: 'Inter, system-ui, sans-serif' },
// //     sidebar: { width: '320px', background: '#18181b', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column' },
// //     main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
// //     header: { height: '56px', background: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' },
// //     btn: (active) => ({ flex: 1, padding: '8px', background: active ? '#10b981' : 'transparent', border: active ? 'none' : '1px solid #3f3f46', color: active ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'all 0.2s' }),
// //     uploadBtn: { width: '100%', padding: '12px', background: '#27272a', border: '1px dashed #52525b', color: '#a1a1aa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', transition: 'all 0.2s' },
// //     apiBox: { marginTop: 'auto', background: '#111', borderTop: '1px solid #27272a', padding: '16px' },
// //     statusDot: (status) => ({ width: 8, height: 8, borderRadius: '50%', background: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : status === 'processing' ? '#f59e0b' : '#52525b' })
// //   };

// //   return (
// //     <div style={styles.container}>
// //       {/* SIDEBAR */}
// //       <div style={styles.sidebar}>
// //         <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
// //            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
// //              <Cpu size={24} className="text-emerald-500"/> KiCad View
// //            </h2>
// //            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#71717a' }}>Precision PCB Visualization</p>
// //         </div>
        
// //         <div style={{ padding: '24px', gap: '24px', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
// //            {/* Upload */}
// //            <div>
// //               <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', marginBottom: '8px', letterSpacing: '0.5px' }}>PROJECT SOURCE</div>
// //               <label style={styles.uploadBtn} className="hover:bg-zinc-800 hover:border-zinc-400">
// //                  <input type="file" hidden accept=".kicad_pcb" onChange={handleFileUpload} />
// //                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
// //                     <FileCode size={18} />
// //                     <span>{boardData ? "Change PCB File" : "Upload .kicad_pcb"}</span>
// //                  </div>
// //               </label>
// //            </div>
           
// //            {/* View Mode */}
// //            <div>
// //               <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', marginBottom: '8px', letterSpacing: '0.5px' }}>VISUALIZATION</div>
// //               <div style={{ display: 'flex', gap: '8px' }}>
// //                  <button style={styles.btn(viewMode === '2d')} onClick={() => setViewMode('2d')}>2D Schematic</button>
// //                  <button style={styles.btn(viewMode === '3d')} onClick={() => setViewMode('3d')}>3D Render</button>
// //               </div>
// //            </div>

// //            {/* Stats Panel */}
// //            {boardData && (
// //              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
// //                 <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
// //                     <Activity size={12}/> BOARD METRICS
// //                 </div>
// //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
// //                     <div style={{ background: '#000', padding: '8px', borderRadius: '4px' }}>
// //                         <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1fae5' }}>{boardData.footprints.length}</div>
// //                         <div style={{ fontSize: '10px', color: '#6ee7b7' }}>COMPONENTS</div>
// //                     </div>
// //                     <div style={{ background: '#000', padding: '8px', borderRadius: '4px' }}>
// //                         <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1fae5' }}>{boardData.segments.length}</div>
// //                         <div style={{ fontSize: '10px', color: '#6ee7b7' }}>TRACKS</div>
// //                     </div>
// //                 </div>
// //              </div>
// //            )}
// //         </div>

// //         {/* API Status Panel */}
// //         <div style={styles.apiBox}>
// //              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
// //                 <div style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa' }}>API STATUS</div>
// //                 <div style={styles.statusDot(apiStatus)} />
// //              </div>
             
// //              <div style={{ background: '#000', borderRadius: '6px', padding: '10px', height: '100px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#22c55e', marginBottom: '12px', border: '1px solid #333' }}>
// //                 {apiLog.length === 0 ? <span style={{color:'#555'}}>Ready to process...</span> : apiLog.map((l, i) => <div key={i}>{l}</div>)}
// //              </div>
             
// //              <button 
// //                 onClick={handleApiRun}
// //                 disabled={!boardData || apiStatus === 'processing'}
// //                 style={{ width: '100%', padding: '10px', background: apiStatus === 'processing' ? '#3f3f46' : '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
// //              >
// //                 {apiStatus === 'processing' ? <Loader2 size={16} className="animate-spin"/> : <Settings size={16}/>}
// //                 {apiStatus === 'processing' ? 'PROCESSING...' : 'RUN ANALYSIS'}
// //              </button>
// //         </div>
// //       </div>

// //       {/* MAIN VIEWPORT */}
// //       <div style={styles.main}>
// //         <div style={styles.header}>
// //            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
// //                <div style={{ width: '8px', height: '8px', background: boardData ? '#10b981' : '#ef4444', borderRadius: '50%' }} />
// //                <div style={{ fontSize: '14px', fontWeight: '500', color: '#e4e4e7' }}>{fileContent ? "Project Loaded" : "No Project Active"}</div>
// //            </div>
           
// //            <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#a1a1aa' }}>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-red-600"/> F.Cu (Top)</div>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-blue-600"/> B.Cu (Bottom)</div>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-yellow-500"/> Edge Cuts</div>
// //            </div>
// //         </div>
        
// //         <div style={{ flex: 1, position: 'relative', background: '#000' }}>
// //            {!boardData ? (
// //              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', flexDirection: 'column', gap: '16px' }}>
// //                 <div style={{ padding: '24px', border: '2px dashed #27272a', borderRadius: '50%' }}>
// //                     <Search size={48} />
// //                 </div>
// //                 <div style={{ textAlign: 'center' }}>
// //                     <div style={{ color: '#e4e4e7', fontWeight: '500', marginBottom: '4px' }}>No Design Loaded</div>
// //                     <div style={{ fontSize: '13px' }}>Upload a .kicad_pcb file to begin</div>
// //                 </div>
// //              </div>
// //            ) : (
// //              viewMode === '3d' ? <Viewer3D data={boardData} /> : <Viewer2D data={boardData} />
// //            )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;






import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Text as Text3D, Line } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Upload, 
  Layers, 
  Activity, 
  Settings, 
  Cpu, 
  Maximize,
  FileCode,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search
} from 'lucide-react';



const rotateVector = (x, y, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
};

const getArcParams = (x1, y1, xm, ym, x2, y2) => {
  const D = 2 * (x1 * (ym - y2) + xm * (y2 - y1) + x2 * (y1 - ym));
  if (Math.abs(D) < 0.0001) return null; 

  const Ux = ((x1**2 + y1**2) * (ym - y2) + (xm**2 + ym**2) * (y2 - y1) + (x2**2 + y2**2) * (y1 - ym)) / D;
  const Uy = ((x1**2 + y1**2) * (x2 - xm) + (xm**2 + ym**2) * (x1 - x2) + (x2**2 + y2**2) * (xm - x1)) / D;
  
  const radius = Math.sqrt((x1 - Ux)**2 + (y1 - Uy)**2);
  const startAngle = Math.atan2(y1 - Uy, x1 - Ux);
  const endAngle = Math.atan2(y2 - Uy, x2 - Ux);
  
  
  const cross = (xm - x1) * (y2 - y1) - (ym - y1) * (x2 - x1);
  const counterClockwise = cross > 0;

  return { cx: Ux, cy: Uy, radius, startAngle, endAngle, counterClockwise };
};



const tokenizeSExpr = (str) => {
  const regex = /\s*(\(|\)|"[^"]*"|[^\s()"]+)\s*/g;
  let token;
  const tokens = [];
  while ((token = regex.exec(str)) !== null) {
    if (token[1]) tokens.push(token[1]);
  }
  return tokens;
};

const parseSExpr = (tokens) => {
  if (tokens.length === 0) return undefined;
  const token = tokens.shift();
  if (token === "(") {
    const list = [];
    while (tokens.length > 0 && tokens[0] !== ")") {
      list.push(parseSExpr(tokens));
    }
    tokens.shift();
    return list;
  } else if (token === ")") {
    return null; 
  } else {
    return token.startsWith('"') ? token.slice(1, -1) : token;
  }
};

const findNode = (list, type) => {
  if (!Array.isArray(list)) return null;
  return list.find(item => Array.isArray(item) && item[0] === type);
};

const getFloat = (node, index = 1) => node && node[index] ? parseFloat(node[index]) : 0;
const getString = (node, index = 1) => node && node[index] ? node[index] : "";


const parseCustomJson = (jsonArray) => {
  const board = {
    footprints: [],
    segments: [],
    arcs: [],
    zones: [],
    graphics: [],
    vias: [],
    minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity
  };

  const updateBounds = (x, y) => {
    if (x < board.minX) board.minX = x;
    if (y < board.minY) board.minY = y;
    if (x > board.maxX) board.maxX = x;
    if (y > board.maxY) board.maxY = y;
  };

  
  const compMap = {};

  jsonArray.forEach(item => {
    
    if (item.type === 'pcb_smtpad' || item.type === 'pcb_thpad') {
        const compId = item.pcb_component_id || 'misc_pads';
        if (!compMap[compId]) {
            compMap[compId] = {
                ref: 'CMP', 
                x: 0, y: 0, rot: 0, 
                pads: [], 
                layer: 'F.Cu'
            };
        }
        
        const layer = item.layer === 'bottom' ? 'B.Cu' : 'F.Cu';
        const layers = [layer];
        if (item.type === 'pcb_thpad') layers.push('B.Cu', 'F.Cu');

        compMap[compId].pads.push({
            type: item.type === 'pcb_smtpad' ? 'smd' : 'th',
            shape: item.shape === 'rect' ? 'rect' : 'circle',
            x: item.x,
            y: item.y,
            w: item.width,
            h: item.height,
            rot: item.rotation || 0,
            layers: layers
        });
        updateBounds(item.x, item.y);
    }
    
    // 2. VIAS
    else if (item.type === 'pcb_via') {
        board.vias.push({
            x: item.x,
            y: item.y,
            size: item.diameter || 0.6
        });
        updateBounds(item.x, item.y);
    }

    
    else if (item.type === 'pcb_trace') {
        if (item.x1 !== undefined && item.y1 !== undefined) {
             board.segments.push({
                 x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2,
                 width: item.width || 0.2,
                 layer: item.layer === 'bottom' ? 'B.Cu' : 'F.Cu'
             });
             updateBounds(item.x1, item.y1);
             updateBounds(item.x2, item.y2);
        }
    }
  });

  board.footprints = Object.values(compMap);
  
  
  if (board.minX === Infinity) { board.minX = 0; board.minY = 0; board.maxX = 100; board.maxY = 100; }
  return board;
};


const parseKiCadData = (fileContent) => {
  try {
    const tokens = tokenizeSExpr(fileContent);
    const tree = parseSExpr(tokens);

    if (!tree || tree[0] !== 'kicad_pcb') {
      throw new Error("Not a valid kicad_pcb file");
    }

    const board = {
      footprints: [],
      segments: [], 
      arcs: [],
      zones: [],
      graphics: [],
      vias: [],
      minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity
    };

    const updateBounds = (x, y) => {
      if (x < board.minX) board.minX = x;
      if (y < board.minY) board.minY = y;
      if (x > board.maxX) board.maxX = x;
      if (y > board.maxY) board.maxY = y;
    };

    const parseAt = (node) => {
      const at = findNode(node, 'at');
      return {
        x: getFloat(at, 1),
        y: getFloat(at, 2),
        rot: getFloat(at, 3)
      };
    };

    tree.forEach(node => {
      if (!Array.isArray(node)) return;
      const type = node[0];

      if (type === 'segment') {
        const start = findNode(node, 'start');
        const end = findNode(node, 'end');
        const width = findNode(node, 'width');
        const layer = findNode(node, 'layer');
        if (start && end) {
          const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
          const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
          board.segments.push({
            x1: s.x, y1: s.y, x2: e.x, y2: e.y,
            width: getFloat(width, 1) || 0.2,
            layer: getString(layer, 1)
          });
          updateBounds(s.x, s.y); updateBounds(e.x, e.y);
        }
      }
      else if (type === 'arc' || type === 'gr_arc') {
        const start = findNode(node, 'start');
        const mid = findNode(node, 'mid');
        const end = findNode(node, 'end');
        const width = findNode(node, 'width');
        const layer = findNode(node, 'layer');
        if (start && mid && end) {
           const s = { x: getFloat(start, 1), y: getFloat(start, 2) };
           const m = { x: getFloat(mid, 1), y: getFloat(mid, 2) };
           const e = { x: getFloat(end, 1), y: getFloat(end, 2) };
           board.arcs.push({
             start: s, mid: m, end: e,
             width: getFloat(width, 1) || 0.2,
             layer: getString(layer, 1)
           });
           updateBounds(s.x, s.y); updateBounds(m.x, m.y); updateBounds(e.x, e.y);
        }
      }
      else if (type === 'zone') {
        const layer = findNode(node, 'layer');
        const polygon = findNode(node, 'polygon') || findNode(node, 'filled_polygon');
        if (polygon) {
           const ptsNode = findNode(polygon, 'pts');
           if (ptsNode) {
             const points = [];
             ptsNode.forEach(pt => {
               if (Array.isArray(pt) && pt[0] === 'xy') {
                 points.push({ x: getFloat(pt, 1), y: getFloat(pt, 2) });
                 updateBounds(getFloat(pt, 1), getFloat(pt, 2));
               }
             });
             if (points.length > 2) board.zones.push({ layer: getString(layer, 1), points });
           }
        }
      }
      else if (type === 'gr_line' || type === 'line' || type === 'gr_circle') {
        const layer = findNode(node, 'layer');
        const layerName = getString(layer, 1);
        const start = findNode(node, 'start') || findNode(node, 'center');
        const end = findNode(node, 'end');
        if (start && end) {
             const x1 = getFloat(start, 1);
             const y1 = getFloat(start, 2);
             const x2 = getFloat(end, 1);
             const y2 = getFloat(end, 2);
             let geometry = { type: type, x1, y1, x2, y2, layer: layerName };
             if (type === 'gr_circle') {
                const dx = x1 - x2; const dy = y1 - y2;
                geometry.radius = Math.sqrt(dx*dx + dy*dy);
             }
             board.graphics.push(geometry);
             if (layerName === 'Edge.Cuts') { updateBounds(x1, y1); updateBounds(x2, y2); }
        }
      }
      else if (type === 'footprint' || type === 'module') {
        const at = parseAt(node);
        const refNode = node.find(n => Array.isArray(n) && n[0] === 'fp_text' && n[1] === 'reference');
        const ref = refNode ? getString(refNode, 2) : getString(node, 1);
        const layer = findNode(node, 'layer');
        const pads = [];
        node.forEach(child => {
          if (Array.isArray(child) && child[0] === 'pad') {
             const pAt = parseAt(child);
             const pSize = findNode(child, 'size');
             const pShape = child[2]; 
             const pLayers = findNode(child, 'layers');
             const rotated = rotateVector(pAt.x, pAt.y, at.rot);
             const absX = at.x + rotated.x;
             const absY = at.y + rotated.y;
             pads.push({
               type: child[1], shape: pShape,
               x: absX, y: absY,
               w: getFloat(pSize, 1), h: getFloat(pSize, 2),
               rot: at.rot + pAt.rot,
               layers: pLayers ? pLayers.slice(1) : ['F.Cu']
             });
             updateBounds(absX, absY);
          }
        });
        board.footprints.push({ ref, x: at.x, y: at.y, rot: at.rot, layer: getString(layer, 1), pads });
      }
      else if (type === 'via') {
         const at = findNode(node, 'at');
         const size = findNode(node, 'size');
         if(at) {
             const vx = getFloat(at, 1); const vy = getFloat(at, 2);
             board.vias.push({ x: vx, y: vy, size: getFloat(size, 1) || 0.6 });
             updateBounds(vx, vy);
         }
      }
    });

    if (board.minX === Infinity) { board.minX = 0; board.minY = 0; board.maxX = 100; board.maxY = 100; }
    return board;
  } catch (e) { console.error("Parse Error:", e); return null; }
};



const Zone3D = ({ points, layer }) => {
  const shape = useMemo(() => {
    if (!points || points.length < 3) return null;
    const s = new THREE.Shape();
    s.moveTo(points[0].x, -points[0].y);
    for (let i = 1; i < points.length; i++) s.lineTo(points[i].x, -points[i].y);
    s.closePath();
    return s;
  }, [points]);
  if (!shape) return null;
  const z = layer.includes('F.Cu') ? 0.04 : -1.64;
  const color = layer.includes('F.Cu') ? '#b87333' : '#3d85c6';
  return (
    <mesh position={[0, 0, z]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} opacity={0.8} transparent />
    </mesh>
  );
};

const Arc3D = ({ start, mid, end, width, layer }) => {
  const params = useMemo(() => getArcParams(start.x, start.y, mid.x, mid.y, end.x, end.y), [start, mid, end]);
  if (!params) return null;
  const curve = useMemo(() => new THREE.EllipseCurve(
      params.cx, -params.cy, params.radius, params.radius,
      -params.startAngle, -params.endAngle, !params.counterClockwise, 0
  ), [params]);
  const points = useMemo(() => curve.getPoints(32), [curve]);
  const z = layer === 'F.Cu' ? 0.06 : -1.66;
  const color = layer === 'F.Cu' ? '#ffaa00' : '#00aaff';
  return <Line points={points.map(p => [p.x, p.y, z])} color={color} lineWidth={width * 5} />;
};

const Pad3D = ({ pad }) => {
  const isTop = pad.layers.some(l => l.includes('F.Cu'));
  const isBottom = pad.layers.some(l => l.includes('B.Cu'));
  const isMulti = isTop && isBottom;
  const z = isTop ? 0.06 : (isBottom ? -1.66 : 0);
  const material = new THREE.MeshStandardMaterial({
      color: (pad.shape === 'rect' || pad.shape === 'roundrect') ? "#e5e7eb" : "#fbbf24",
      roughness: 0.3, metalness: 0.9
  });
  if (isMulti || pad.type !== 'smd') {
      const holeSize = Math.min(pad.w, pad.h) * 0.6;
      return (
        <group position={[pad.x, -pad.y, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
             <mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[holeSize/2 + 0.1, holeSize/2 + 0.1, 1.7, 16]} /><primitive object={material} /></mesh>
             <mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[holeSize/2, holeSize/2, 1.75, 16]} /><meshBasicMaterial color="#000" /></mesh>
             <mesh position={[0, 0, 0.05]}><cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} /><primitive object={material} /></mesh>
             <mesh position={[0, 0, -1.65]}><cylinderGeometry args={[pad.w/2, pad.w/2, 0.02, 32]} /><primitive object={material} /></mesh>
        </group>
      )
  }
  return (
    <mesh position={[pad.x, -pad.y, z]} rotation={[0, 0, THREE.MathUtils.degToRad(-pad.rot)]}>
      {pad.shape === 'circle' ? <cylinderGeometry args={[pad.w/2, pad.w/2, 0.05, 32]} /> : <boxGeometry args={[pad.w, pad.h, 0.05]} />}
      <primitive object={material} />
    </mesh>
  );
};

const Viewer3D = ({ data }) => {
  if (!data) return null;
  const width = Math.max((data.maxX - data.minX) * 1.2, 50);
  const height = Math.max((data.maxY - data.minY) * 1.2, 50);
  const cx = (data.maxX + data.minX) / 2;
  const cy = (data.maxY + data.minY) / 2;
  return (
    <Canvas camera={{ position: [0, 0, 150], fov: 35 }} shadows gl={{ antialias: true }}>
       <color attach="background" args={['#1a1a1a']} />
       <Stage environment="warehouse" intensity={0.7} adjustCamera={false}>
         <group>
           <mesh position={[cx, -cy, -0.8]} receiveShadow><boxGeometry args={[width, height, 1.6]} /><meshStandardMaterial color="#1a472a" roughness={0.3} metalness={0.1} /></mesh>
           {data.zones.map((zone, i) => <Zone3D key={`z-${i}`} {...zone} />)}
           {data.segments.map((seg, i) => {
              const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
              const len = Math.sqrt(dx*dx + dy*dy);
              const angle = Math.atan2(dy, dx);
              const z = seg.layer === 'F.Cu' ? 0.06 : -1.66;
              return (<mesh key={`tr-${i}`} position={[(seg.x1 + seg.x2)/2, -(seg.y1 + seg.y2)/2, z]} rotation={[0, 0, -angle]}><boxGeometry args={[len, seg.width, 0.02]} /><meshStandardMaterial color={seg.layer === 'F.Cu' ? '#ffaa00' : '#00aaff'} /></mesh>)
           })}
           {data.arcs.map((arc, i) => <Arc3D key={`arc-${i}`} {...arc} />)}
           {data.footprints.map((fp, i) => (
             <group key={`fp-${i}`}>
                {fp.pads.map((pad, j) => <Pad3D key={j} pad={pad} />)}
             </group>
           ))}
           {data.vias.map((via, i) => (<mesh key={`v-${i}`} position={[via.x, -via.y, 0]}><cylinderGeometry args={[via.size/2, via.size/2, 1.7, 16]} /><meshStandardMaterial color="#b87333" /></mesh>))}
           {data.graphics.filter(g => g.layer === 'Edge.Cuts').map((g, i) => {
               if(g.type === 'line' || g.type === 'gr_line') {
                   const dx = g.x2 - g.x1, dy = g.y2 - g.y1; const len = Math.sqrt(dx*dx + dy*dy); const ang = Math.atan2(dy, dx);
                   return (<mesh key={`ec-${i}`} position={[(g.x1+g.x2)/2, -(g.y1+g.y2)/2, 0]} rotation={[0, 0, -ang]}><boxGeometry args={[len, 0.2, 1.62]} /><meshBasicMaterial color="#fbbf24" /></mesh>)
               } return null;
           })}
         </group>
       </Stage>
       <OrbitControls makeDefault />
    </Canvas>
  );
};



const Viewer2D = ({ data }) => {
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 3 }); 
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  
  useEffect(() => {
    if(!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const padding = 50;
    const boardW = data.maxX - data.minX;
    const boardH = data.maxY - data.minY;
    const scale = Math.min((canvas.width - padding) / boardW, (canvas.height - padding) / boardH);
    const midX = (data.minX + data.maxX) / 2;
    const midY = (data.minY + data.maxY) / 2;
    
    // Center logic
    setTransform({
        k: scale,
        x: (canvas.width / 2) - (midX * scale),
        y: (canvas.height / 2) - (midY * scale)
    });
  }, [data]);

  const drawGrid = (ctx, width, height, scale, offsetX, offsetY) => {
      ctx.save();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1 / scale; 
      ctx.beginPath();
      
      const gridSize = 10; 
      
      const startX = -offsetX / scale;
      const startY = -offsetY / scale;
      const endX = (width - offsetX) / scale;
      const endY = (height - offsetY) / scale;

      
      for(let x = Math.floor(startX/gridSize)*gridSize; x < endX; x+=gridSize) {
         ctx.moveTo(x, startY); ctx.lineTo(x, endY);
      }
      
      for(let y = Math.floor(startY/gridSize)*gridSize; y < endY; y+=gridSize) {
         ctx.moveTo(startX, y); ctx.lineTo(endX, y);
      }
      ctx.stroke();
      ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    
    
    ctx.fillStyle = '#111827'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
    

    drawGrid(ctx, canvas.width, canvas.height, transform.k, transform.x, transform.y);

    
    const boardW = data.maxX - data.minX;
    const boardH = data.maxY - data.minY;
    ctx.fillStyle = '#064e3b'; 
    ctx.fillRect(data.minX, data.minY, boardW, boardH);

    
    data.zones.forEach(zone => {
       if (zone.points.length < 3) return;
       ctx.beginPath();
       ctx.moveTo(zone.points[0].x, zone.points[0].y);
       zone.points.forEach(p => ctx.lineTo(p.x, p.y));
       ctx.closePath();
       ctx.fillStyle = zone.layer === 'F.Cu' ? 'rgba(180, 83, 9, 0.4)' : 'rgba(30, 58, 138, 0.4)';
       ctx.fill();
    });

    
    const drawTrack = (layer) => {
        const color = layer === 'F.Cu' ? '#dc2626' : '#2563eb';
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        data.segments.forEach(seg => {
            if(seg.layer !== layer) return;
            ctx.beginPath(); ctx.lineWidth = seg.width;
            ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
        });
        data.arcs.forEach(arc => {
            if(arc.layer !== layer) return;
            const p = getArcParams(arc.start.x, arc.start.y, arc.mid.x, arc.mid.y, arc.end.x, arc.end.y);
            if (!p) return;
            ctx.beginPath(); ctx.lineWidth = arc.width;
            ctx.arc(p.cx, p.cy, p.radius, p.startAngle, p.endAngle, p.counterClockwise);
            ctx.stroke();
        });
    };
    drawTrack('B.Cu'); drawTrack('F.Cu');

    
    data.footprints.forEach(fp => {
       fp.pads.forEach(pad => {
          ctx.save(); ctx.translate(pad.x, pad.y); ctx.rotate(pad.rot * Math.PI / 180);
          const isTop = pad.layers.some(l => l.includes('F.Cu'));
          ctx.fillStyle = isTop ? '#fbbf24' : '#94a3b8'; // Gold vs Silver
          if(pad.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, pad.w/2, 0, 2*Math.PI); ctx.fill(); }
          else if (pad.shape === 'oval') { ctx.beginPath(); ctx.ellipse(0, 0, pad.w/2, pad.h/2, 0, 0, 2*Math.PI); ctx.fill(); }
          else { ctx.fillRect(-pad.w/2, -pad.h/2, pad.w, pad.h); }
          
          if(pad.type !== 'smd') { ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, 0, Math.min(pad.w, pad.h)*0.3, 0, 2*Math.PI); ctx.fill(); }
          ctx.restore();
       });
       if (fp.layer === 'F.Cu' || !fp.layer) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '1px monospace'; ctx.fillText(fp.ref, fp.x, fp.y);
       }
    });

    
    data.vias.forEach(via => {
       ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(via.x, via.y, via.size/2, 0, 2*Math.PI); ctx.fill();
       ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(via.x, via.y, via.size/4, 0, 2*Math.PI); ctx.fill();
    });

    
    data.graphics.forEach(g => {
        ctx.lineWidth = 0.15;
        ctx.strokeStyle = g.layer === 'Edge.Cuts' ? '#fbbf24' : 'white';
        if(g.type === 'line' || g.type === 'gr_line') { ctx.beginPath(); ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x2, g.y2); ctx.stroke(); }
        else if (g.type === 'gr_circle') { ctx.beginPath(); ctx.arc(g.x1, g.y1, g.radius, 0, 2*Math.PI); ctx.stroke(); }
    });
    ctx.restore();
  }, [data, transform]);

  
  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if(!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    
    const worldX = (mouseX - transform.x) / transform.k;
    const worldY = (mouseY - transform.y) / transform.k;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85; 
    const newK = Math.max(0.5, Math.min(200, transform.k * zoomFactor));

    
    const newX = mouseX - worldX * newK;
    const newY = mouseY - worldY * newK;

    setTransform({ k: newK, x: newX, y: newY });
  };

  const handleMouseDown = (e) => { setIsDragging(true); lastPos.current = { x: e.clientX, y: e.clientY }; };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if(isDragging) {
       const dx = e.clientX - lastPos.current.x;
       const dy = e.clientY - lastPos.current.y;
       lastPos.current = { x: e.clientX, y: e.clientY };
       setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
    }
  };

  return (
    <div className="w-full h-full cursor-crosshair bg-gray-900 relative overflow-hidden" 
         onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
         onMouseMove={handleMouseMove} onWheel={handleWheel}>
      <div className="absolute top-4 left-4 text-emerald-400 text-xs font-mono pointer-events-none z-10 bg-black/50 px-2 py-1 rounded border border-emerald-900">
         ZOOM: {(transform.k).toFixed(1)}x | PAN: {transform.x.toFixed(0)},{transform.y.toFixed(0)}
      </div>
      <canvas ref={canvasRef} width={1600} height={1200} className="w-full h-full block" />
    </div>
  );
};



function App() {
  const [fileContent, setFileContent] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [viewMode, setViewMode] = useState('2d'); 
  
  
  const [apiStatus, setApiStatus] = useState('idle'); 
  const [apiLog, setApiLog] = useState([]);
  const [apiUrl, setApiUrl] = useState("https://apis.boltchem.com/v4/tools/cypress");

  const addLog = (msg) => setApiLog(prev => [...prev, `> ${msg}`]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setFileContent(content);
      
      let parsed = null;
      try {
          const json = JSON.parse(content);
          if (Array.isArray(json)) {
              
              parsed = parseCustomJson(json);
          } else if (json.footprints || json.segments) {
              
              parsed = json;
              
              if (parsed.minX === undefined || parsed.minX === Infinity) {
              
                parsed.minX = 0; parsed.minY = 0; parsed.maxX = 100; parsed.maxY = 100;
              }
          }
      } catch (err) {
          
          parsed = parseKiCadData(content);
      }

      if (parsed) {
          setBoardData(parsed);
          setApiStatus('idle'); 
          setApiLog([`Loaded ${file.name}`, `Parsed ${parsed.footprints?.length || 0} components`]);
      } else {
          alert("Could not load file. Please use a valid .kicad_pcb or JSON export.");
      }
    };
    reader.readAsText(file);
  };

  const handleApiRun = async () => {
     if(!fileContent) return;
     setApiStatus('uploading');
     addLog("Connecting to BoltChem endpoint...");
     
     try {
         
         await new Promise(r => setTimeout(r, 1000));
         setApiStatus('processing');
         addLog("Uploading PCB data...");
         
         const response = await fetch(apiUrl, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 pcb_data: fileContent,
                 meta: { version: "1.0", tool: "ReactViewer" }
             })
         });
         
        
         if(response.ok) {
             const data = await response.json();
             setApiStatus('success');
             addLog("Analysis Complete.");
             addLog(`Result ID: ${data.id || 'N/A'}`);
         } else {
            
             throw new Error(`API Error ${response.status}: Endpoint unreachable`);
         }
     } catch (e) {
         setApiStatus('error');
         addLog(`Error: ${e.message}`);
        
         setTimeout(() => {
             addLog("⚠️ Switch to offline mode.");
         }, 1000);
     }
  };

  const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', background: '#09090b', color: '#e4e4e7', fontFamily: 'Inter, system-ui, sans-serif' },
    sidebar: { width: '320px', background: '#18181b', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { height: '56px', background: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' },
    btn: (active) => ({ flex: 1, padding: '8px', background: active ? '#10b981' : 'transparent', border: active ? 'none' : '1px solid #3f3f46', color: active ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'all 0.2s' }),
    uploadBtn: { width: '100%', padding: '12px', background: '#27272a', border: '1px dashed #52525b', color: '#a1a1aa', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', transition: 'all 0.2s' },
    apiBox: { marginTop: 'auto', background: '#111', borderTop: '1px solid #27272a', padding: '16px' },
    statusDot: (status) => ({ width: 8, height: 8, borderRadius: '50%', background: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : status === 'processing' ? '#f59e0b' : '#52525b' })
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.sidebar}>
        <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
           <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
             <Cpu size={24} className="text-emerald-500"/> KiCad View
           </h2>
           <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#71717a' }}>Precision PCB Visualization</p>
        </div>
        
        <div style={{ padding: '24px', gap: '24px', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
           
           <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', marginBottom: '8px', letterSpacing: '0.5px' }}>PROJECT SOURCE</div>
              <label style={styles.uploadBtn} className="hover:bg-zinc-800 hover:border-zinc-400">
                 <input type="file" hidden accept=".kicad_pcb,.json" onChange={handleFileUpload} />
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <FileCode size={18} />
                    <span>{boardData ? "Change PCB File" : "Upload .kicad_pcb or .json"}</span>
                 </div>
              </label>
           </div>
           
           
           <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', marginBottom: '8px', letterSpacing: '0.5px' }}>VISUALIZATION</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button style={styles.btn(viewMode === '2d')} onClick={() => setViewMode('2d')}>2D Schematic</button>
                 <button style={styles.btn(viewMode === '3d')} onClick={() => setViewMode('3d')}>3D Render</button>
              </div>
           </div>


           {boardData && (
             <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={12}/> BOARD METRICS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#000', padding: '8px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1fae5' }}>{boardData.footprints?.length || 0}</div>
                        <div style={{ fontSize: '10px', color: '#6ee7b7' }}>COMPONENTS</div>
                    </div>
                    <div style={{ background: '#000', padding: '8px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1fae5' }}>{boardData.segments?.length || 0}</div>
                        <div style={{ fontSize: '10px', color: '#6ee7b7' }}>TRACKS</div>
                    </div>
                </div>
             </div>
           )}
        </div>

        
        <div style={styles.apiBox}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa' }}>API STATUS</div>
                <div style={styles.statusDot(apiStatus)} />
             </div>
             
             <div style={{ background: '#000', borderRadius: '6px', padding: '10px', height: '100px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#22c55e', marginBottom: '12px', border: '1px solid #333' }}>
                {apiLog.length === 0 ? <span style={{color:'#555'}}>Ready to process...</span> : apiLog.map((l, i) => <div key={i}>{l}</div>)}
             </div>
             
             <button 
                onClick={handleApiRun}
                disabled={!boardData || apiStatus === 'processing'}
                style={{ width: '100%', padding: '10px', background: apiStatus === 'processing' ? '#3f3f46' : '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
             >
                {apiStatus === 'processing' ? <Loader2 size={16} className="animate-spin"/> : <Settings size={16}/>}
                {apiStatus === 'processing' ? 'PROCESSING...' : 'RUN ANALYSIS'}
             </button>
        </div>
      </div>

      
      <div style={styles.main}>
        <div style={styles.header}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '8px', height: '8px', background: boardData ? '#10b981' : '#ef4444', borderRadius: '50%' }} />
               <div style={{ fontSize: '14px', fontWeight: '500', color: '#e4e4e7' }}>{fileContent ? "Project Loaded" : "No Project Active"}</div>
           </div>
           
           <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#a1a1aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-red-600"/> F.Cu (Top)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-blue-600"/> B.Cu (Bottom)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="w-2 h-2 rounded-full bg-yellow-500"/> Edge Cuts</div>
           </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
           {!boardData ? (
             <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '24px', border: '2px dashed #27272a', borderRadius: '50%' }}>
                    <Search size={48} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#e4e4e7', fontWeight: '500', marginBottom: '4px' }}>No Design Loaded</div>
                    <div style={{ fontSize: '13px' }}>Upload a .kicad_pcb or .json file to begin</div>
                </div>
             </div>
           ) : (
             viewMode === '3d' ? <Viewer3D data={boardData} /> : <Viewer2D data={boardData} />
           )}
        </div>
      </div>
    </div>
  );
}

export default App;


