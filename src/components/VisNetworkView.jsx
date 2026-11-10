import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import SectionHead from './common/SectionHead';
import Segmented from './common/Segmented';
import Icon from './common/Icon';

export default function VisNetworkView({ summaryData }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const [topSample, setTopSample] = useState(20);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  const rawNetwork = useMemo(() => {
    return summaryData?.vis_network || { nodes: [], edges: [] };
  }, [summaryData]);

  // Compute active nodes for current sample
  const activeNodes = useMemo(() => {
    const topPublishers = rawNetwork.nodes.filter((n) => n.group === 'publisher').slice(0, 6);
    const topGenres = rawNetwork.nodes.filter((n) => n.group === 'genre').slice(0, 6);
    const topPlatforms = rawNetwork.nodes.filter((n) => n.group === 'platform').slice(0, 5);
    const topGames = rawNetwork.nodes.filter((n) => n.group === 'game').slice(0, topSample);

    return [...topPublishers, ...topGenres, ...topPlatforms, ...topGames].map((n) => {
      let bg = '#C3A15A';
      let border = '#E5D5A6';
      let shape = 'dot';
      let size = 26;

      if (n.group === 'publisher') {
        bg = '#C3A15A'; // mustard
        border = '#F4E7C3';
        shape = 'dot';
        size = 38;
      } else if (n.group === 'game') {
        bg = '#824D48'; // burgundy
        border = '#C48A85';
        shape = 'box';
        size = 28;
      } else if (n.group === 'genre') {
        bg = '#747B59'; // olive
        border = '#B5BF96';
        shape = 'diamond';
        size = 32;
      } else if (n.group === 'platform') {
        bg = '#638783'; // teal
        border = '#A3C8C5';
        shape = 'hexagon';
        size = 30;
      }

      return {
        ...n,
        shape,
        size,
        color: {
          background: bg,
          border: border,
          highlight: {
            background: '#C56B3D',
            border: '#F4EFE6',
          },
          hover: {
            background: '#D67443',
            border: '#F4EFE6',
          },
        },
        font: {
          color: '#F4EFE6',
          size: n.group === 'publisher' ? 14 : 12,
          face: 'IBM Plex Sans, sans-serif',
          strokeWidth: 3,
          strokeColor: '#171815',
          bold: true,
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 7,
          x: 2,
          y: 2,
        },
      };
    });
  }, [rawNetwork, topSample]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const selectedNode = useMemo(() => {
    if (selectedNodeId) {
      const found = activeNodes.find((n) => n.id === selectedNodeId);
      if (found) return found;
    }
    return activeNodes.find((n) => n.group === 'publisher') || activeNodes[0] || null;
  }, [activeNodes, selectedNodeId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodeIds = new Set(activeNodes.map((n) => n.id));

    const activeEdges = rawNetwork.edges
      .filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to))
      .map((e) => ({
        ...e,
        color: {
          color: 'rgba(164, 159, 144, 0.45)',
          highlight: '#C56B3D',
          hover: '#C3A15A',
        },
        dashes: true,
        width: 1.4,
      }));

    const nodesDataSet = new DataSet(activeNodes);
    const edgesDataSet = new DataSet(activeEdges);

    const options = {
      nodes: {
        scaling: {
          min: 20,
          max: 48,
        },
      },
      edges: {
        smooth: { type: 'continuous', forceDirection: 'none', roundness: 0.35 },
      },
      physics: {
        enabled: physicsEnabled,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -75,
          centralGravity: 0.15,
          springLength: topSample <= 20 ? 140 : 180,
          springConstant: 0.045,
          damping: 0.6,
          avoidOverlap: 0.85,
        },
        stabilization: { iterations: 120 },
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
        selectConnectedEdges: true,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        selectable: true,
      },
    };

    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        setSelectedNodeId(nodeId);
      }
    });

    return () => {
      network.destroy();
    };
  }, [topSample, activeNodes, rawNetwork.edges, physicsEnabled]);

  const handleCenter = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 550, easingFunction: 'easeInOutQuad' } });
    }
  };

  const handleFocusNode = (nodeToFocus = selectedNode) => {
    if (networkRef.current && nodeToFocus) {
      networkRef.current.selectNodes([nodeToFocus.id]);
      networkRef.current.focus(nodeToFocus.id, {
        scale: 1.4,
        animation: { duration: 500, easingFunction: 'easeInOutQuad' },
      });
    }
  };

  const handleSelectChange = (nodeId) => {
    setSelectedNodeId(nodeId);
    const found = activeNodes.find((n) => n.id === nodeId);
    if (found) {
      handleFocusNode(found);
    }
  };

  return (
    <>
      <SectionHead
        eyebrow="ANÁLISE 02 / SIMULADOR DE FORÇAS"
        title="Network Investigation Board"
        desc="Relações de influência entre distribuidoras, títulos e gêneros."
        code="02—N"
      />

      {/* Toolbar Controls */}
      <div className="toolbar-row">
        <div>
          <label>AMOSTRA DE TÍTULOS</label>
          <Segmented
            values={[
              { label: 'Top 10', value: 10 },
              { label: 'Top 20', value: 20 },
              { label: 'Top 50', value: 50 },
            ]}
            value={topSample}
            onChange={(val) => setTopSample(Number(val))}
            ariaLabel="Amostra de títulos no grafo"
          />
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="mechanical-btn"
            onClick={() => setPhysicsEnabled(!physicsEnabled)}
            aria-pressed={!physicsEnabled}
          >
            <Icon name={physicsEnabled ? 'pause' : 'play'} size={15} />
            {physicsEnabled ? 'Pausar Física' : 'Retomar Física'}
          </button>
          <button
            type="button"
            className="mechanical-btn"
            onClick={handleCenter}
          >
            <Icon name="target" size={15} />
            Centralizar Grafo
          </button>
        </div>
      </div>

      {/* Network Layout: Canvas + Inspection Panel */}
      <div className="network-layout">
        <div className="network-canvas">
          <div className="canvas-id">
            NETWORK FIELD / NF-204 · AMOSTRA TOP {topSample} · FÍSICA {physicsEnabled ? 'ATIVA (ON)' : 'CONGELADA (OFF)'}
          </div>

          <div 
            ref={containerRef} 
            className="network-vis-container"
            aria-label="Visualização interativa em grafo de forças" 
          />

          <div className="diagram-legend">
            <b>LEGENDA DE NÓS:</b>
            <span>
              <i className="pub-key" /> Distribuidoras
            </span>
            <span>
              <i className="game-key" /> Jogos
            </span>
            <span>
              <i className="genre-key" /> Gêneros
            </span>
            <span>
              <i className="plat-key" /> Plataformas
            </span>
          </div>
        </div>

        {/* Archival Node Inspection Panel */}
        <aside className="inspection-panel">
          <div className="inspection-head">
            <span>INSPEÇÃO DE NÓ</span>
            <b>REF. {selectedNode ? String(selectedNode.id).replace(/[^0-9]/g, '').padStart(3, '0') || '001' : '000'}</b>
          </div>

          {/* Direct Entity Selector to easily browse and alter elements */}
          <div style={{ marginTop: 14 }}>
            <label htmlFor="node-switcher-select" style={{ color: 'var(--muted)', display: 'block', marginBottom: 5 }}>
              SELECIONAR / ALTERAR ENTIDADE
            </label>
            <select
              id="node-switcher-select"
              value={selectedNode?.id || ''}
              onChange={(e) => handleSelectChange(e.target.value)}
              style={{
                background: '#2B2A24',
                color: 'var(--paper-light)',
                border: '1px solid #141411',
                padding: '8px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <optgroup label="Distribuidoras">
                {activeNodes.filter((n) => n.group === 'publisher').map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </optgroup>
              <optgroup label="Gêneros">
                {activeNodes.filter((n) => n.group === 'genre').map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </optgroup>
              <optgroup label="Plataformas">
                {activeNodes.filter((n) => n.group === 'platform').map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </optgroup>
              <optgroup label="Jogos">
                {activeNodes.filter((n) => n.group === 'game').map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {selectedNode ? (
            <>
              <div className={`type-badge ${selectedNode.group}`}>
                {selectedNode.group.toUpperCase()}
              </div>

              <h2>{selectedNode.label}</h2>
              <p>
                Entidade ativa no campo relacional. Clique diretamente nos nós do painel ou selecione acima para inspecionar vínculos, vendas e faturamento.
              </p>

              <div className="measure">
                <span>VOLUME TOTAL ESTIMADO</span>
                <b>{selectedNode.value ? `${Number(selectedNode.value).toFixed(1)}M` : '—'}</b>
                <small>CÓPIAS CATALOGADAS</small>
              </div>

              {selectedNode.title && (
                <div 
                  style={{ 
                    marginTop: 12, 
                    fontSize: 11, 
                    color: 'var(--muted)', 
                    background: 'rgba(217, 207, 188, 0.55)', 
                    padding: 10, 
                    border: '1px solid #b3a792',
                    fontFamily: 'var(--font-mono)' 
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedNode.title }}
                />
              )}

              <button
                type="button"
                className="mechanical-btn focus-btn"
                onClick={() => handleFocusNode(selectedNode)}
              >
                <Icon name="target" size={14} />
                Focar neste nó
              </button>

              <div className="calibration">
                CALIBRATION: 02.204 / SCALE: 1:1
                <br />
                SIGNAL STATUS: STABLE / INTERACTION: ACTIVE
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--muted)' }}>
              <p>Clique sobre qualquer elemento no grafo para inspecionar e navegar.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
