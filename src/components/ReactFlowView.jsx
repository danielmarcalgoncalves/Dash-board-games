import React, { useCallback, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Handle, 
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SectionHead from './common/SectionHead';
import Icon from './common/Icon';

function AnalogCustomNode({ data }) {
  const getBorderColor = () => {
    if (data.category?.includes('Distribuidora')) return '#C3A15A';
    if (data.category?.includes('Hardware') || data.category?.includes('Plataforma')) return '#638783';
    if (data.category?.includes('Preço')) return '#C56B3D';
    return '#824D48';
  };

  const accentColor = getBorderColor();

  return (
    <div
      style={{
        background: '#EEE6D7',
        border: '1px solid #847E6E',
        borderLeft: `5px solid ${accentColor}`,
        borderRadius: '2px',
        padding: '11px 15px',
        boxShadow: '3px 4px 0 rgba(70, 65, 54, 0.22)',
        color: '#282720',
        minWidth: 190,
        position: 'relative',
        fontFamily: 'IBM Plex Sans, sans-serif',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#24231F',
          border: '2px solid #E9E1D1',
          width: 9,
          height: 9,
          left: -6,
        }}
      />

      <div
        style={{
          fontSize: '7.5px',
          fontFamily: 'IBM Plex Mono, monospace',
          color: '#777366',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 700,
          marginBottom: 3,
        }}
      >
        {data.category}
      </div>

      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '17px',
          fontWeight: 700,
          color: '#171815',
          lineHeight: 1.15,
          marginBottom: 4,
        }}
      >
        {data.label}
      </div>

      <div
        style={{
          fontSize: '9px',
          fontFamily: 'IBM Plex Mono, monospace',
          color: '#555144',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px dashed #b5ab97',
          paddingTop: 4,
          marginTop: 4,
        }}
      >
        <span>VENDAS:</span>
        <strong style={{ color: '#24231F' }}>{data.sales || '—'}</strong>
      </div>

      {data.revenue && (
        <div
          style={{
            fontSize: '8.5px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: '#777366',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>FATURAMENTO:</span>
          <strong style={{ color: '#C56B3D' }}>{data.revenue}</strong>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#24231F',
          border: '2px solid #E9E1D1',
          width: 9,
          height: 9,
          right: -6,
        }}
      />
    </div>
  );
}

const nodeTypes = {
  customHub: AnalogCustomNode,
};

function FlowInner({ summaryData }) {
  const initialNodes = summaryData?.flow_graph?.nodes || [];
  const initialEdges = (summaryData?.flow_graph?.edges || []).map((e) => ({
    ...e,
    animated: true,
    style: {
      stroke: '#5c584b',
      strokeWidth: 1.8,
      strokeDasharray: '4 3',
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [resetKey, setResetKey] = useState(0);

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#C56B3D', strokeWidth: 2, strokeDasharray: '4 3' },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setResetKey((k) => k + 1);
    setTimeout(() => {
      fitView({ duration: 400 });
    }, 50);
  };

  const columns = [
    { num: '01', title: 'Distribuidoras' },
    { num: '02', title: 'Plataformas' },
    { num: '03', title: 'Faixas de Preço' },
    { num: '04', title: 'Faturamento Global' },
  ];

  return (
    <>
      <SectionHead
        eyebrow="ANÁLISE 04 / DIAGRAMA INDUSTRIAL"
        title="Fluxo de Valor: Distribuidoras ➔ Plataformas ➔ Preços ➔ Vendas"
        desc="Encadeamento estrutural do valor no ecossistema global."
        code="04—F"
      />

      <div className="flow-toolbar">
        <div className="blueprint-key">
          SCHEMATIC GP–VF.04 / REV. B • BLUEPRINT LABORATORY ECOSYSTEM
        </div>
        <button
          type="button"
          className="mechanical-btn"
          onClick={handleReset}
        >
          <Icon name="reset" size={14} />
          Resetar Posições
        </button>
      </div>

      <div className="flow-canvas" key={resetKey}>
        {/* Visual 4-Column Header Track */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            padding: '12px 30px 0',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {columns.map((col) => (
            <div key={col.num} className="column-label" style={{ margin: 0 }}>
              <span>{col.num}</span>
              {col.title}
            </div>
          ))}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#9e9783"
            gap={20}
            size={1.2}
            style={{ opacity: 0.25 }}
          />
          <Controls showInteractive={false} style={{ display: 'none' }} />
          <MiniMap
            nodeColor={(n) => {
              if (n.data?.category?.includes('Distribuidora')) return '#C3A15A';
              if (n.data?.category?.includes('Hardware')) return '#638783';
              if (n.data?.category?.includes('Preço')) return '#C56B3D';
              return '#824D48';
            }}
            maskColor="rgba(36, 35, 31, 0.75)"
            style={{
              background: '#2B2A24',
              border: '1px solid #6b6657',
              borderRadius: '2px',
              bottom: 14,
              left: 14,
            }}
          />
        </ReactFlow>

        {/* Mechanical Controls on Canvas */}
        <div className="flow-controls">
          <button
            type="button"
            aria-label="Aumentar zoom do fluxo"
            onClick={() => zoomIn({ duration: 300 })}
          >
            <Icon name="plus" size={15} />
          </button>
          <button
            type="button"
            aria-label="Diminuir zoom do fluxo"
            onClick={() => zoomOut({ duration: 300 })}
          >
            <Icon name="minus" size={15} />
          </button>
          <button
            type="button"
            aria-label="Ajustar visão completa"
            onClick={() => fitView({ duration: 400 })}
          >
            <Icon name="target" size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

export default function ReactFlowView({ summaryData }) {
  return (
    <ReactFlowProvider>
      <FlowInner summaryData={summaryData} />
    </ReactFlowProvider>
  );
}
