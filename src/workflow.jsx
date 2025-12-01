// import React, { useState, useMemo } from 'react';

// // --- ELEGANT THEME ---
// const THEME = {
//   primary: '#6366f1',
//   primaryLight: '#818cf8',
//   success: '#10b981',
//   successLight: '#34d399',
//   textMain: '#0f172a',
//   textSec: '#64748b',
//   textLight: '#94a3b8',
//   bgPrimary: '#ffffff',
//   bgSecondary: '#f8fafc',
//   border: '#e2e8f0',
//   borderLight: '#f1f5f9',
// };

// // --- ICONS (SVG Components) ---
// const ChevronDown = ({ style }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// const Copy = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//     <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//   </svg>
// );

// const Check = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const CheckCircle = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// const FileText = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//     <polyline points="14 2 14 8 20 8" />
//     <line x1="16" y1="13" x2="8" y2="13" />
//     <line x1="16" y1="17" x2="8" y2="17" />
//     <polyline points="10 9 9 9 8 9" />
//   </svg>
// );

// const CodeIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="16 18 22 12 16 6" />
//     <polyline points="8 6 2 12 8 18" />
//   </svg>
// );

// const Play = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="5 3 19 12 5 21 5 3" />
//   </svg>
// );

// const Layers = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 2 7 12 12 22 7 12 2" />
//     <polyline points="2 17 12 22 22 17" />
//     <polyline points="2 12 12 17 22 12" />
//   </svg>
// );

// const Activity = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
//   </svg>
// );

// const Database = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <ellipse cx="12" cy="5" rx="9" ry="3" />
//     <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
//     <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
//   </svg>
// );

// const Eye = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// // --- HELPER ---
// const useCleanContent = (content) => useMemo(() => {
//   if (!content) return null;
//   let text = content;
//   text = text.replace(/^<div>\s*<pre>/, '').replace(/<\/pre>\s*<\/div>$/, '');
//   text = text.replace(/<br\s*\/?>/gi, '\n');
//   return text;
// }, [content]);

// // --- COMPONENT: Code Block ---
// const CodeBlock = ({ content, title }) => {
//   const [copied, setCopied] = useState(false);
//   const cleanedContent = useCleanContent(content);

//   const handleCopy = (e) => {
//     e.stopPropagation();
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = cleanedContent;
//     const plainText = tempDiv.textContent || tempDiv.innerText || '';
//     navigator.clipboard.writeText(plainText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div style={{ marginTop: '16px' }}>
//       <div style={{
//         backgroundColor: '#1e293b',
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         border: '1px solid #334155'
//       }}>
//         {/* Header */}
//         <div style={{
//           padding: '12px 16px',
//           backgroundColor: '#0f172a',
//           borderBottom: '1px solid #334155',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
//             <span style={{
//               marginLeft: '12px',
//               fontFamily: 'monospace',
//               fontSize: '11px',
//               color: '#94a3b8',
//               letterSpacing: '0.05em'
//             }}>
//               {title}
//             </span>
//           </div>
//           <button
//             onClick={handleCopy}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: copied ? THEME.success : '#94a3b8',
//               cursor: 'pointer',
//               padding: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               transition: 'color 0.2s'
//             }}
//             title={copied ? "Copied!" : "Copy Code"}
//           >
//             {copied ? <Check /> : <Copy />}
//           </button>
//         </div>

//         {/* Content */}
//         <div style={{
//           padding: '16px',
//           overflowX: 'auto',
//           maxHeight: '400px'
//         }}>
//           <pre style={{
//             margin: 0,
//             fontFamily: "'Fira Code', 'Menlo', 'Monaco', monospace",
//             fontSize: '12px',
//             lineHeight: '1.6',
//             whiteSpace: 'pre-wrap',
//             color: '#e2e8f0',
//             wordBreak: 'break-word'
//           }}
//           dangerouslySetInnerHTML={{ __html: cleanedContent }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT: Content Block ---
// const ContentBlock = ({ content }) => {
//   const cleanedContent = useCleanContent(content);
//   return (
//     <div style={{
//       marginTop: '16px',
//       padding: '16px',
//       borderRadius: '12px',
//       backgroundColor: THEME.bgSecondary,
//       border: `1px solid ${THEME.borderLight}`,
//       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
//     }}>
//       <div style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         color: THEME.textMain,
//         lineHeight: 1.6,
//         fontSize: '13px'
//       }}
//       dangerouslySetInnerHTML={{ __html: cleanedContent }} />
//     </div>
//   );
// };

// // --- COMPONENT: Expandable Section ---
// const ExpandableSection = ({ title, icon: Icon, content, variant = 'text', isOpenDefault = false }) => {
//   const [expanded, setExpanded] = useState(isOpenDefault);
//   const [isHovered, setIsHovered] = useState(false);
  
//   if (!content) return null;

//   return (
//     <div style={{ marginBottom: '16px' }}>
//       <div
//         onClick={() => setExpanded(!expanded)}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           backgroundColor: THEME.bgPrimary,
//           borderRadius: '12px',
//           border: `1px solid ${isHovered ? THEME.primary : THEME.border}`,
//           boxShadow: isHovered ? '0 6px 12px rgba(0, 0, 0, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
//           padding: '14px',
//           display: 'flex',
//           alignItems: 'center',
//           cursor: 'pointer',
//           transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//           transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
//         }}
//       >
//         <div style={{
//           width: 36,
//           height: 36,
//           borderRadius: '10px',
//           backgroundColor: expanded ? `${THEME.primary}15` : `${THEME.textLight}10`,
//           color: expanded ? THEME.primary : THEME.textLight,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginRight: '12px',
//           transition: 'all 0.15s',
//           flexShrink: 0
//         }}>
//           <Icon />
//         </div>

//         <div style={{ 
//           flex: 1, 
//           fontWeight: 600, 
//           color: THEME.textMain, 
//           fontSize: '14px', 
//           letterSpacing: '-0.01em',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }}>
//           {title}
//         </div>

//         <div style={{
//           color: THEME.textSec,
//           transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
//           transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//           display: 'flex',
//           alignItems: 'center',
//           flexShrink: 0,
//           marginLeft: '8px'
//         }}>
//           <ChevronDown />
//         </div>
//       </div>

//       <div style={{
//         display: expanded ? 'block' : 'none',
//         paddingLeft: '4px',
//         paddingRight: '4px',
//         animation: expanded ? 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
//       }}>
//         {variant === 'code' ? (
//           <CodeBlock content={content} title="generated_script.py" />
//         ) : (
//           <ContentBlock content={content} />
//         )}
//       </div>
      
//       <style>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // --- COMPONENT: Timeline Step ---
// const TimelineStep = ({ step, isLast, onOutputClick }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const isCompleted = step.status === 'completed';

//   return (
//     <div style={{ display: 'flex', position: 'relative', marginBottom: '20px' }}>
//       {/* Vertical Line */}
//       {!isLast && (
//         <div style={{
//           position: 'absolute',
//           left: '19px',
//           top: '44px',
//           bottom: '-20px',
//           width: '2px',
//           background: `linear-gradient(to bottom, ${THEME.border} 0%, ${THEME.borderLight} 100%)`,
//           zIndex: 0
//         }} />
//       )}

//       {/* Status Icon */}
//       <div style={{ marginRight: '16px', zIndex: 1, paddingTop: '12px', flexShrink: 0 }}>
//         {isCompleted ? (
//           <div style={{
//             width: 40,
//             height: 40,
//             borderRadius: '50%',
//             backgroundColor: `${THEME.success}15`,
//             border: `2px solid ${THEME.success}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             boxShadow: `0 0 0 4px ${THEME.success}08`,
//             color: THEME.success
//           }}>
//             <CheckCircle />
//           </div>
//         ) : (
//           <div style={{
//             width: 40,
//             height: 40,
//             borderRadius: '50%',
//             backgroundColor: THEME.bgPrimary,
//             border: `2px solid ${THEME.border}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative'
//           }}>
//             <div style={{
//               width: 14,
//               height: 14,
//               borderRadius: '50%',
//               backgroundColor: THEME.borderLight
//             }} />
//           </div>
//         )}
//       </div>

//       {/* Content Card */}
//       <div
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           flex: 1,
//           backgroundColor: THEME.bgPrimary,
//           borderRadius: '12px',
//           border: `1px solid ${THEME.border}`,
//           boxShadow: isHovered ? '0 8px 16px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
//           padding: '16px',
//           transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//           transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
//           minWidth: 0
//         }}
//       >
//         {/* Header */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'flex-start', 
//           marginBottom: '12px',
//           flexWrap: 'wrap',
//           gap: '8px'
//         }}>
//           <span style={{
//             display: 'inline-block',
//             padding: '4px 10px',
//             borderRadius: '6px',
//             fontWeight: 600,
//             fontSize: '10px',
//             backgroundColor: isCompleted ? `${THEME.success}15` : THEME.borderLight,
//             color: isCompleted ? THEME.success : THEME.textSec,
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em'
//           }}>
//             {step.step_type || 'Operation'}
//           </span>
//           <span style={{
//             color: THEME.textLight,
//             fontFamily: 'monospace',
//             fontSize: '10px',
//             fontWeight: 500
//           }}>
//             {new Date(step.timestamp).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit'
//             })}
//           </span>
//         </div>

//         {/* Description */}
//         <div style={{
//           fontWeight: 500,
//           color: THEME.textMain,
//           marginBottom: '12px',
//           fontSize: '13px',
//           lineHeight: 1.5,
//           wordWrap: 'break-word'
//         }}>
//           {step.description}
//         </div>

//         {/* Footer */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingTop: '12px',
//           borderTop: `1px solid ${THEME.borderLight}`,
//           flexWrap: 'wrap',
//           gap: '8px'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: '6px', 
//             color: THEME.textLight,
//             minWidth: 0,
//             overflow: 'hidden'
//           }}>
//             <Database />
//             <span style={{
//               color: THEME.textSec,
//               fontSize: '11px',
//               fontWeight: 500,
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap'
//             }}>
//               {step.collection_name}
//             </span>
//           </div>

//           {isCompleted && onOutputClick && (
//             <button
//               onClick={() => onOutputClick(step)}
//               style={{
//                 backgroundColor: `${THEME.primary}10`,
//                 color: THEME.primary,
//                 border: 'none',
//                 borderRadius: '6px',
//                 width: 28,
//                 height: 28,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 flexShrink: 0
//               }}
//               title="View Results"
//             >
//               <Eye />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT: Section Header ---
// const SectionHeader = ({ title, icon: Icon, count }) => (
//   <div style={{
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '24px',
//     paddingBottom: '12px',
//     borderBottom: `2px solid ${THEME.borderLight}`,
//     flexWrap: 'wrap'
//   }}>
//     <div style={{
//       width: 40,
//       height: 40,
//       borderRadius: '10px',
//       backgroundColor: `${THEME.primary}15`,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: THEME.primary,
//       flexShrink: 0
//     }}>
//       <Icon />
//     </div>
//     <div style={{ flex: 1, minWidth: 0 }}>
//       <div style={{
//         fontWeight: 700,
//         color: THEME.textLight,
//         letterSpacing: '0.1em',
//         fontSize: '10px',
//         lineHeight: 1
//       }}>
//         WORKFLOW STAGE
//       </div>
//       <div style={{
//         fontWeight: 700,
//         color: THEME.textMain,
//         fontSize: '16px',
//         letterSpacing: '-0.02em',
//         marginTop: '4px',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         whiteSpace: 'nowrap'
//       }}>
//         {title}
//       </div>
//     </div>
//     {count !== undefined && (
//       <span style={{
//         backgroundColor: THEME.bgSecondary,
//         color: THEME.textSec,
//         padding: '4px 10px',
//         borderRadius: '6px',
//         fontWeight: 600,
//         fontSize: '11px',
//         flexShrink: 0
//       }}>
//         {count} steps
//       </span>
//     )}
//   </div>
// );

// // --- MAIN COMPONENT ---
// export default function WorkflowViewer({ data, outputfun }) {
//   const parsedData = useMemo(() => {
//     if (!data || !data.conversation) return null;
//     const conv = data.conversation;

//     const planningStep = conv.find(c => c.message_text?.includes('Workflow Planned Successfully'));
//     const codeStep = conv.find(c => c.message_type === 'code');
//     const execStep = conv.find(c => c.message_text?.includes('Starting Execution'));
//     const workflowObj = conv.find(c => c.message_type === 'workflow');

//     let timeline = [];
//     if (workflowObj && workflowObj.message_content) {
//       const grouped = {};
//       workflowObj.message_content.forEach(log => {
//         const key = `${log.step_type}_${log.collection_name}_${log.description}`;
//         if (!grouped[key] || log.status === 'completed') {
//           grouped[key] = log;
//         }
//       });
//       timeline = Object.values(grouped).sort((a, b) =>
//         new Date(a.timestamp) - new Date(b.timestamp)
//       );
//     }

//     return {
//       planning: planningStep?.message_text,
//       code: codeStep?.code,
//       executionStart: execStep?.message_text,
//       timeline: timeline
//     };
//   }, [data]);

//   if (!parsedData) return null;

//   return (
//     <div style={{
//       width: '100%',
//       minHeight: '100vh',
//       background: `
//         radial-gradient(circle at 10% 20%, ${THEME.primary}08 0%, transparent 50%),
//         radial-gradient(circle at 90% 80%, ${THEME.success}05 0%, transparent 50%),
//         linear-gradient(to bottom, ${THEME.bgSecondary}, ${THEME.bgPrimary})
//       `,
//       padding: '16px',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       boxSizing: 'border-box'
//     }}>
//       <div style={{ 
//         maxWidth: '900px', 
//         margin: '0 auto',
//         width: '100%'
//       }}>

//         {/* Reasoning Section */}
//         <div style={{ marginBottom: '48px' }}>
//           <SectionHeader title="System Reasoning" icon={FileText} />

//           <ExpandableSection
//             title="Strategic Planning"
//             icon={Activity}
//             content={parsedData.planning}
//             variant="text"
//             isOpenDefault={true}
//           />

//           <ExpandableSection
//             title="Generated Script"
//             icon={CodeIcon}
//             content={parsedData.code}
//             variant="code"
//           />

//           <ExpandableSection
//             title="Execution Configuration"
//             icon={Play}
//             content={parsedData.executionStart}
//             variant="text"
//           />
//         </div>

//         {/* Timeline Section */}
//         <div>
//           <SectionHeader
//             title="Execution Pipeline"
//             icon={Layers}
//             count={parsedData.timeline.length}
//           />

//           <div style={{ position: 'relative' }}>
//             {parsedData.timeline.map((step, index) => (
//               <TimelineStep
//                 key={`${step.collection_name}-${step.step_type}-${index}`}
//                 step={step}
//                 isLast={index === parsedData.timeline.length - 1}
//                 onOutputClick={outputfun}
//               />
//             ))}
//           </div>
//         </div>

//       </div>

//       <style>{`
//         @media (max-width: 640px) {
//           /* Mobile adjustments */
//         }
//         @media (max-width: 480px) {
//           /* Extra small mobile adjustments */
//         }
//       `}</style>
//     </div>
//   );
// }


// import React, { useState, useMemo } from 'react';

// // --- ELEGANT THEME ---
// const THEME = {
//   primary: '#6366f1',
//   primaryLight: '#818cf8',
//   success: '#10b981',
//   successLight: '#34d399',
//   textMain: '#0f172a',
//   textSec: '#64748b',
//   textLight: '#94a3b8',
//   bgPrimary: '#ffffff',
//   bgSecondary: '#f8fafc',
//   border: '#e2e8f0',
//   borderLight: '#f1f5f9',
// };

// // --- ICONS (SVG Components) ---
// const ChevronDown = ({ style }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// const Copy = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//     <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//   </svg>
// );

// const Check = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const CheckCircle = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// const FileText = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//     <polyline points="14 2 14 8 20 8" />
//     <line x1="16" y1="13" x2="8" y2="13" />
//     <line x1="16" y1="17" x2="8" y2="17" />
//     <polyline points="10 9 9 9 8 9" />
//   </svg>
// );

// const CodeIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="16 18 22 12 16 6" />
//     <polyline points="8 6 2 12 8 18" />
//   </svg>
// );

// const Play = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="5 3 19 12 5 21 5 3" />
//   </svg>
// );

// const Layers = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 2 7 12 12 22 7 12 2" />
//     <polyline points="2 17 12 22 22 17" />
//     <polyline points="2 12 12 17 22 12" />
//   </svg>
// );

// const Activity = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
//   </svg>
// );

// const Database = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <ellipse cx="12" cy="5" rx="9" ry="3" />
//     <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
//     <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
//   </svg>
// );

// const Eye = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// // --- HELPER ---
// const useCleanContent = (content) => useMemo(() => {
//   if (!content) return null;
//   let text = content;
//   text = text.replace(/^<div>\s*<pre>/, '').replace(/<\/pre>\s*<\/div>$/, '');
//   text = text.replace(/<br\s*\/?>/gi, '\n');
//   return text;
// }, [content]);

// // --- COMPONENT: Code Block ---
// const CodeBlock = ({ content, title }) => {
//   const [copied, setCopied] = useState(false);
//   const cleanedContent = useCleanContent(content);

//   const handleCopy = (e) => {
//     e.stopPropagation();
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = cleanedContent;
//     const plainText = tempDiv.textContent || tempDiv.innerText || '';
//     navigator.clipboard.writeText(plainText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div style={{ marginTop: '16px' }}>
//       <div style={{
//         backgroundColor: '#1e293b',
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         border: '1px solid #334155'
//       }}>
//         {/* Header */}
//         <div style={{
//           padding: '12px 16px',
//           backgroundColor: '#0f172a',
//           borderBottom: '1px solid #334155',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
//             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
//             <span style={{
//               marginLeft: '12px',
//               fontFamily: 'monospace',
//               fontSize: '11px',
//               color: '#94a3b8',
//               letterSpacing: '0.05em'
//             }}>
//               {title}
//             </span>
//           </div>
//           <button
//             onClick={handleCopy}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: copied ? THEME.success : '#94a3b8',
//               cursor: 'pointer',
//               padding: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               transition: 'color 0.2s'
//             }}
//             title={copied ? "Copied!" : "Copy Code"}
//           >
//             {copied ? <Check /> : <Copy />}
//           </button>
//         </div>

//         {/* Content */}
//         <div style={{
//           padding: '16px',
//           overflowX: 'auto',
//           maxHeight: '400px'
//         }}>
//           <pre style={{
//             margin: 0,
//             fontFamily: "'Fira Code', 'Menlo', 'Monaco', monospace",
//             fontSize: '12px',
//             lineHeight: '1.6',
//             whiteSpace: 'pre-wrap',
//             color: '#e2e8f0',
//             wordBreak: 'break-word'
//           }}
//           dangerouslySetInnerHTML={{ __html: cleanedContent }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT: Content Block ---
// const ContentBlock = ({ content }) => {
//   const cleanedContent = useCleanContent(content);
//   return (
//     <div style={{
//       marginTop: '16px',
//       padding: '16px',
//       borderRadius: '12px',
//       backgroundColor: THEME.bgSecondary,
//       border: `1px solid ${THEME.borderLight}`,
//       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
//     }}>
//       <div style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         color: THEME.textMain,
//         lineHeight: 1.6,
//         fontSize: '13px'
//       }}
//       dangerouslySetInnerHTML={{ __html: cleanedContent }} />
//     </div>
//   );
// };

// // --- COMPONENT: Expandable Section ---
// const ExpandableSection = ({ title, icon: Icon, content, variant = 'text', isOpenDefault = false }) => {
//   const [expanded, setExpanded] = useState(isOpenDefault);
//   const [isHovered, setIsHovered] = useState(false);
//   const [shouldRender, setShouldRender] = useState(isOpenDefault);
  
//   if (!content) return null;

//   const handleToggle = () => {
//     if (!expanded) {
//       setShouldRender(true);
//     }
//     setExpanded(!expanded);
//   };

//   return (
//     <div style={{ marginBottom: '16px' }}>
//       <div
//         onClick={handleToggle}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           backgroundColor: THEME.bgPrimary,
//           borderRadius: '12px',
//           border: `1px solid ${isHovered ? THEME.primary : THEME.border}`,
//           boxShadow: isHovered ? '0 8px 16px rgba(99, 102, 241, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
//           padding: '14px',
//           display: 'flex',
//           alignItems: 'center',
//           cursor: 'pointer',
//           transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//           transform: isHovered ? 'translateY(-3px) scale(1.005)' : 'translateY(0) scale(1)'
//         }}
//       >
//         <div style={{
//           width: 36,
//           height: 36,
//           borderRadius: '10px',
//           backgroundColor: expanded ? `${THEME.primary}15` : `${THEME.textLight}10`,
//           color: expanded ? THEME.primary : THEME.textLight,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginRight: '12px',
//           transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//           flexShrink: 0,
//           transform: expanded ? 'scale(1.05)' : 'scale(1)'
//         }}>
//           <Icon />
//         </div>

//         <div style={{ 
//           flex: 1, 
//           fontWeight: 600, 
//           color: THEME.textMain, 
//           fontSize: '14px', 
//           letterSpacing: '-0.01em',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }}>
//           {title}
//         </div>

//         <div style={{
//           color: THEME.textSec,
//           transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
//           transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//           display: 'flex',
//           alignItems: 'center',
//           flexShrink: 0,
//           marginLeft: '8px'
//         }}>
//           <ChevronDown />
//         </div>
//       </div>

//       {shouldRender && (
//         <div 
//           style={{
//             paddingLeft: '4px',
//             paddingRight: '4px',
//             overflow: 'hidden',
//             maxHeight: expanded ? '5000px' : '0',
//             opacity: expanded ? 1 : 0,
//             transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
//             transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
//             pointerEvents: expanded ? 'auto' : 'none'
//           }}
//           onTransitionEnd={() => {
//             if (!expanded) setShouldRender(false);
//           }}
//         >
//           {variant === 'code' ? (
//             <CodeBlock content={content} title="generated_script.py" />
//           ) : (
//             <ContentBlock content={content} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- COMPONENT: Timeline Step ---
// const TimelineStep = ({ step, isLast, onOutputClick }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const isCompleted = step.status === 'completed';

//   return (
//     <div style={{ display: 'flex', position: 'relative', marginBottom: '20px' }}>
//       {/* Vertical Line */}
//       {!isLast && (
//         <div style={{
//           position: 'absolute',
//           left: '19px',
//           top: '44px',
//           bottom: '-20px',
//           width: '2px',
//           background: `linear-gradient(to bottom, ${THEME.border} 0%, ${THEME.borderLight} 100%)`,
//           zIndex: 0
//         }} />
//       )}

//       {/* Status Icon */}
//       <div style={{ marginRight: '16px', zIndex: 1, paddingTop: '12px', flexShrink: 0 }}>
//         {isCompleted ? (
//           <div style={{
//             width: 40,
//             height: 40,
//             borderRadius: '50%',
//             backgroundColor: `${THEME.success}15`,
//             border: `2px solid ${THEME.success}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             boxShadow: `0 0 0 4px ${THEME.success}08`,
//             color: THEME.success,
//             transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//             transform: isHovered ? 'scale(1.1)' : 'scale(1)'
//           }}>
//             <CheckCircle />
//           </div>
//         ) : (
//           <div style={{
//             width: 40,
//             height: 40,
//             borderRadius: '50%',
//             backgroundColor: THEME.bgPrimary,
//             border: `2px solid ${THEME.border}`,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative',
//             transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
//           }}>
//             <div style={{
//               width: 14,
//               height: 14,
//               borderRadius: '50%',
//               backgroundColor: THEME.borderLight,
//               transition: 'all 0.3s ease'
//             }} />
//           </div>
//         )}
//       </div>

//       {/* Content Card */}
//       <div
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           flex: 1,
//           backgroundColor: THEME.bgPrimary,
//           borderRadius: '12px',
//           border: `1px solid ${isHovered ? THEME.primary : THEME.border}`,
//           boxShadow: isHovered ? '0 12px 24px rgba(99, 102, 241, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
//           padding: '16px',
//           transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//           transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
//           minWidth: 0
//         }}
//       >
//         {/* Header */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'flex-start', 
//           marginBottom: '12px',
//           flexWrap: 'wrap',
//           gap: '8px'
//         }}>
//           <span style={{
//             display: 'inline-block',
//             padding: '4px 10px',
//             borderRadius: '6px',
//             fontWeight: 600,
//             fontSize: '10px',
//             backgroundColor: isCompleted ? `${THEME.success}15` : THEME.borderLight,
//             color: isCompleted ? THEME.success : THEME.textSec,
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em',
//             transition: 'all 0.2s ease'
//           }}>
//             {step.step_type || 'Operation'}
//           </span>
//           <span style={{
//             color: THEME.textLight,
//             fontFamily: 'monospace',
//             fontSize: '10px',
//             fontWeight: 500
//           }}>
//             {new Date(step.timestamp).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit'
//             })}
//           </span>
//         </div>

//         {/* Description */}
//         <div style={{
//           fontWeight: 500,
//           color: THEME.textMain,
//           marginBottom: '12px',
//           fontSize: '13px',
//           lineHeight: 1.5,
//           wordWrap: 'break-word'
//         }}>
//           {step.description}
//         </div>

//         {/* Footer */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingTop: '12px',
//           borderTop: `1px solid ${THEME.borderLight}`,
//           flexWrap: 'wrap',
//           gap: '8px'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: '6px', 
//             color: THEME.textLight,
//             minWidth: 0,
//             overflow: 'hidden'
//           }}>
//             <Database />
//             <span style={{
//               color: THEME.textSec,
//               fontSize: '11px',
//               fontWeight: 500,
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap'
//             }}>
//               {step.collection_name}
//             </span>
//           </div>

//           {isCompleted && onOutputClick && (
//             <button
//               onClick={() => onOutputClick(step)}
//               style={{
//                 backgroundColor: `${THEME.primary}10`,
//                 color: THEME.primary,
//                 border: 'none',
//                 borderRadius: '6px',
//                 width: 28,
//                 height: 28,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//                 flexShrink: 0,
//                 transform: 'scale(1)'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.15)';
//                 e.currentTarget.style.backgroundColor = `${THEME.primary}20`;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.backgroundColor = `${THEME.primary}10`;
//               }}
//               title="View Results"
//             >
//               <Eye />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT: Section Header ---
// const SectionHeader = ({ title, icon: Icon, count }) => (
//   <div style={{
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '24px',
//     paddingBottom: '12px',
//     borderBottom: `2px solid ${THEME.borderLight}`,
//     flexWrap: 'wrap'
//   }}>
//     <div style={{
//       width: 40,
//       height: 40,
//       borderRadius: '10px',
//       backgroundColor: `${THEME.primary}15`,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: THEME.primary,
//       flexShrink: 0
//     }}>
//       <Icon />
//     </div>
//     <div style={{ flex: 1, minWidth: 0 }}>
//       <div style={{
//         fontWeight: 700,
//         color: THEME.textLight,
//         letterSpacing: '0.1em',
//         fontSize: '10px',
//         lineHeight: 1
//       }}>
//         WORKFLOW STAGE
//       </div>
//       <div style={{
//         fontWeight: 700,
//         color: THEME.textMain,
//         fontSize: '16px',
//         letterSpacing: '-0.02em',
//         marginTop: '4px',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         whiteSpace: 'nowrap'
//       }}>
//         {title}
//       </div>
//     </div>
//     {count !== undefined && (
//       <span style={{
//         backgroundColor: THEME.bgSecondary,
//         color: THEME.textSec,
//         padding: '4px 10px',
//         borderRadius: '6px',
//         fontWeight: 600,
//         fontSize: '11px',
//         flexShrink: 0
//       }}>
//         {count} steps
//       </span>
//     )}
//   </div>
// );

// // --- MAIN COMPONENT ---
// export default function WorkflowViewer({ data, outputfun }) {
//   const parsedData = useMemo(() => {
//     if (!data || !data.conversation) return null;
//     const conv = data.conversation;

//     const planningStep = conv.find(c => c.message_text?.includes('Workflow Planned Successfully'));
//     const codeStep = conv.find(c => c.message_type === 'code');
//     const execStep = conv.find(c => c.message_text?.includes('Starting Execution'));
//     const workflowObj = conv.find(c => c.message_type === 'workflow');

//     let timeline = [];
//     if (workflowObj && workflowObj.message_content) {
//       const grouped = {};
//       workflowObj.message_content.forEach(log => {
//         const key = `${log.step_type}_${log.collection_name}_${log.description}`;
//         if (!grouped[key] || log.status === 'completed') {
//           grouped[key] = log;
//         }
//       });
//       timeline = Object.values(grouped).sort((a, b) =>
//         new Date(a.timestamp) - new Date(b.timestamp)
//       );
//     }

//     return {
//       planning: planningStep?.message_text,
//       code: codeStep?.code,
//       executionStart: execStep?.message_text,
//       timeline: timeline
//     };
//   }, [data]);

//   if (!parsedData) return null;

//   return (
//     <div style={{
//       width: '100%',
//       minHeight: '100vh',
//       background: `
//         radial-gradient(circle at 10% 20%, ${THEME.primary}08 0%, transparent 50%),
//         radial-gradient(circle at 90% 80%, ${THEME.success}05 0%, transparent 50%),
//         linear-gradient(to bottom, ${THEME.bgSecondary}, ${THEME.bgPrimary})
//       `,
//       padding: '16px',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       boxSizing: 'border-box'
//     }}>
//       <div style={{ 
//         maxWidth: '900px', 
//         margin: '0 auto',
//         width: '100%'
//       }}>

//         {/* Reasoning Section */}
//         <div style={{ marginBottom: '48px' }}>
//           <SectionHeader title="System Reasoning" icon={FileText} />

//           <ExpandableSection
//             title="Strategic Planning"
//             icon={Activity}
//             content={parsedData.planning}
//             variant="text"
//             isOpenDefault={true}
//           />

//           <ExpandableSection
//             title="Generated Script"
//             icon={CodeIcon}
//             content={parsedData.code}
//             variant="code"
//           />

//           <ExpandableSection
//             title="Execution Configuration"
//             icon={Play}
//             content={parsedData.executionStart}
//             variant="text"
//           />
//         </div>

//         {/* Timeline Section */}
//         <div>
//           <SectionHeader
//             title="Execution Pipeline"
//             icon={Layers}
//             count={parsedData.timeline.length}
//           />

//           <div style={{ position: 'relative' }}>
//             {parsedData.timeline.map((step, index) => (
//               <TimelineStep
//                 key={`${step.collection_name}-${step.step_type}-${index}`}
//                 step={step}
//                 isLast={index === parsedData.timeline.length - 1}
//                 onOutputClick={outputfun}
//               />
//             ))}
//           </div>
//         </div>

//       </div>

//       <style>{`
//         @media (max-width: 640px) {
//           /* Mobile adjustments */
//         }
//         @media (max-width: 480px) {
//           /* Extra small mobile adjustments */
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useMemo } from 'react';

// --- ELEGANT THEME ---
const THEME = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  success: '#10b981',
  successLight: '#34d399',
  textMain: '#0f172a',
  textSec: '#64748b',
  textLight: '#94a3b8',
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
};

// --- ICONS (SVG Components) ---
const ChevronDown = ({ style }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const FileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const Play = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Layers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const Activity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const Database = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- HELPER ---
const useCleanContent = (content) => useMemo(() => {
  if (!content) return null;
  let text = content;
  // Adjusted regex to match your specific format <div><pre>...</pre></div>
  text = text.replace(/^<div>\s*<pre>/, '').replace(/<\/pre>\s*<\/div>$/, '');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  return text;
}, [content]);

// --- COMPONENT: Code Block ---
const CodeBlock = ({ content, title }) => {
  const [copied, setCopied] = useState(false);
  const cleanedContent = useCleanContent(content);

  const handleCopy = (e) => {
    e.stopPropagation();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanedContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #334155'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{
              marginLeft: '12px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#94a3b8',
              letterSpacing: '0.05em'
            }}>
              {title}
            </span>
          </div>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? THEME.success : '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            title={copied ? "Copied!" : "Copy Code"}
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '16px',
          overflowX: 'auto',
          maxHeight: '400px'
        }}>
          <pre style={{
            margin: 0,
            fontFamily: "'Fira Code', 'Menlo', 'Monaco', monospace",
            fontSize: '12px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            color: '#e2e8f0',
            wordBreak: 'break-word'
          }}
          dangerouslySetInnerHTML={{ __html: cleanedContent }} />
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Content Block ---
const ContentBlock = ({ content }) => {
  const cleanedContent = useCleanContent(content);
  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: THEME.bgSecondary,
      border: `1px solid ${THEME.borderLight}`,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: THEME.textMain,
        lineHeight: 1.6,
        fontSize: '13px'
      }}
      dangerouslySetInnerHTML={{ __html: cleanedContent }} />
    </div>
  );
};

// --- COMPONENT: Expandable Section ---
const ExpandableSection = ({ title, icon: Icon, content, variant = 'text', isOpenDefault = false }) => {
  const [expanded, setExpanded] = useState(isOpenDefault);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpenDefault);
  
  if (!content) return null;

  const handleToggle = () => {
    if (!expanded) {
      setShouldRender(true);
    }
    setExpanded(!expanded);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: THEME.bgPrimary,
          borderRadius: '12px',
          border: `1px solid ${isHovered ? THEME.primary : THEME.border}`,
          boxShadow: isHovered ? '0 8px 16px rgba(99, 102, 241, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'translateY(-3px) scale(1.005)' : 'translateY(0) scale(1)'
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          backgroundColor: expanded ? `${THEME.primary}15` : `${THEME.textLight}10`,
          color: expanded ? THEME.primary : THEME.textLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          flexShrink: 0,
          transform: expanded ? 'scale(1.05)' : 'scale(1)'
        }}>
          <Icon />
        </div>

        <div style={{ 
          flex: 1, 
          fontWeight: 600, 
          color: THEME.textMain, 
          fontSize: '14px', 
          letterSpacing: '-0.01em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </div>

        <div style={{
          color: THEME.textSec,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          marginLeft: '8px'
        }}>
          <ChevronDown />
        </div>
      </div>

      {shouldRender && (
        <div 
          style={{
            paddingLeft: '4px',
            paddingRight: '4px',
            overflow: 'hidden',
            maxHeight: expanded ? '5000px' : '0',
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: expanded ? 'auto' : 'none'
          }}
          onTransitionEnd={() => {
            if (!expanded) setShouldRender(false);
          }}
        >
          {variant === 'code' ? (
            <CodeBlock content={content} title="generated_script.py" />
          ) : (
            <ContentBlock content={content} />
          )}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: Timeline Step ---
const TimelineStep = ({ step, isLast, onOutputClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = step.status === 'completed';

  return (
    <div style={{ display: 'flex', position: 'relative', marginBottom: '20px' }}>
      {/* Vertical Line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '44px',
          bottom: '-20px',
          width: '2px',
          background: `linear-gradient(to bottom, ${THEME.border} 0%, ${THEME.borderLight} 100%)`,
          zIndex: 0
        }} />
      )}

      {/* Status Icon */}
      <div style={{ marginRight: '16px', zIndex: 1, paddingTop: '12px', flexShrink: 0 }}>
        {isCompleted ? (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: `${THEME.success}15`,
            border: `2px solid ${THEME.success}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 0 4px ${THEME.success}08`,
            color: THEME.success,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}>
            <CheckCircle />
          </div>
        ) : (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: THEME.bgPrimary,
            border: `2px solid ${THEME.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: THEME.borderLight,
              transition: 'all 0.3s ease'
            }} />
          </div>
        )}
      </div>

      {/* Content Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          flex: 1,
          backgroundColor: THEME.bgPrimary,
          borderRadius: '12px',
          border: `1px solid ${isHovered ? THEME.primary : THEME.border}`,
          boxShadow: isHovered ? '0 12px 24px rgba(99, 102, 241, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
          padding: '16px',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          minWidth: 0
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '10px',
            backgroundColor: isCompleted ? `${THEME.success}15` : THEME.borderLight,
            color: isCompleted ? THEME.success : THEME.textSec,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease'
          }}>
            {step.step_type || 'Operation'}
          </span>
          <span style={{
            color: THEME.textLight,
            fontFamily: 'monospace',
            fontSize: '10px',
            fontWeight: 500
          }}>
            {new Date(step.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        {/* Description */}
        <div style={{
          fontWeight: 500,
          color: THEME.textMain,
          marginBottom: '12px',
          fontSize: '13px',
          lineHeight: 1.5,
          wordWrap: 'break-word'
        }}>
          {step.description}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: `1px solid ${THEME.borderLight}`,
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: THEME.textLight,
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <Database />
            <span style={{
              color: THEME.textSec,
              fontSize: '11px',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {step.collection_name}
            </span>
          </div>

          {isCompleted && onOutputClick && (
            <button
              onClick={() => onOutputClick(step)}
              style={{
                backgroundColor: `${THEME.primary}10`,
                color: THEME.primary,
                border: 'none',
                borderRadius: '6px',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                flexShrink: 0,
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.backgroundColor = `${THEME.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = `${THEME.primary}10`;
              }}
              title="View Results"
            >
              <Eye />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Section Header ---
const SectionHeader = ({ title, icon: Icon, count }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${THEME.borderLight}`,
    flexWrap: 'wrap'
  }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '10px',
      backgroundColor: `${THEME.primary}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: THEME.primary,
      flexShrink: 0
    }}>
      <Icon />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontWeight: 700,
        color: THEME.textLight,
        letterSpacing: '0.1em',
        fontSize: '10px',
        lineHeight: 1
      }}>
        WORKFLOW STAGE
      </div>
      <div style={{
        fontWeight: 700,
        color: THEME.textMain,
        fontSize: '16px',
        letterSpacing: '-0.02em',
        marginTop: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {title}
      </div>
    </div>
    {count !== undefined && (
      <span style={{
        backgroundColor: THEME.bgSecondary,
        color: THEME.textSec,
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '11px',
        flexShrink: 0
      }}>
        {count} steps
      </span>
    )}
  </div>
);

// --- MAIN COMPONENT ---
export default function WorkflowViewer({ data, outputfun }) {
  const parsedData = useMemo(() => {
    // Check if data is array and has items
    const item = Array.isArray(data) ? data[0] : data;
    if (!item || !item.conversation || !item.conversation[0]) return null;

    const convo = item.conversation[0];
    const steps = convo.generation_steps || {};
    const messageContent = convo.message_content || [];

    // Extract HTML content from generation steps
    // The useCleanContent hook in children will strip the outer <div><pre> tags
    const planning = steps.planning?.content || '';
    const code = steps.code_generation?.content || '';
    const executionReport = steps.execution?.content || '';

    // Process Timeline (message_content)
    let timeline = [];
    if (messageContent.length > 0) {
      const grouped = {};
      messageContent.forEach(log => {
        // Create a unique key based on step type and description 
        // to merge 'pending' and 'completed' states
        const key = `${log.step_type}_${log.collection_name}_${log.description}`;
        
        // Always take the log if it's new, or if it is 'completed' (overwriting pending)
        if (!grouped[key] || log.status === 'completed') {
          grouped[key] = log;
        }
      });
      
      // Sort by timestamp
      timeline = Object.values(grouped).sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
      );
    }

    return {
      planning,
      code,
      executionReport,
      timeline
    };
  }, [data]);

  if (!parsedData) return null;

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 10% 20%, ${THEME.primary}08 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, ${THEME.success}05 0%, transparent 50%),
        linear-gradient(to bottom, ${THEME.bgSecondary}, ${THEME.bgPrimary})
      `,
      padding: '16px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        width: '100%'
      }}>

        {/* Reasoning Section */}
        <div style={{ marginBottom: '48px' }}>
          <SectionHeader title="System Reasoning" icon={FileText} />

          <ExpandableSection
            title="Strategic Planning"
            icon={Activity}
            content={parsedData.planning}
            variant="text"
            isOpenDefault={true}
          />

          <ExpandableSection
            title="Generated Script"
            icon={CodeIcon}
            content={parsedData.code}
            variant="code"
          />

          <ExpandableSection
            title="Execution Report"
            icon={Play}
            content={parsedData.executionReport}
            variant="text"
          />
        </div>

        {/* Timeline Section */}
        <div>
          <SectionHeader
            title="Execution Pipeline"
            icon={Layers}
            count={parsedData.timeline.length}
          />

          <div style={{ position: 'relative' }}>
            {parsedData.timeline.map((step, index) => (
              <TimelineStep
                key={`${step.collection_name}-${step.step_type}-${index}`}
                step={step}
                isLast={index === parsedData.timeline.length - 1}
                onOutputClick={outputfun}
              />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          /* Mobile adjustments */
        }
        @media (max-width: 480px) {
          /* Extra small mobile adjustments */
        }
      `}</style>
    </div>
  );
}