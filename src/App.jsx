import React, { useState } from 'react';
import Header from './components/Header';
import ScatterCorrelationView from './components/ScatterCorrelationView';
import VisNetworkView from './components/VisNetworkView';
import ChoroplethMapView from './components/ChoroplethMapView';
import ReactFlowView from './components/ReactFlowView';
import DataExplorerTable from './components/DataExplorerTable';

import statsSummary from './data/statsSummary.json';
import enrichedGames from './data/enrichedGames.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('scatter');

  return (
    <div className="app-shell">
      {/* Sticky Dark Laboratory Instrument Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Analog Data Lab Workspace */}
      <main className="workspace" key={activeTab}>
        {activeTab === 'scatter' && (
          <ScatterCorrelationView gamesData={enrichedGames} summaryData={statsSummary} />
        )}

        {activeTab === 'visNetwork' && (
          <VisNetworkView summaryData={statsSummary} />
        )}

        {activeTab === 'choropleth' && (
          <ChoroplethMapView summaryData={statsSummary} />
        )}

        {activeTab === 'flow' && (
          <ReactFlowView summaryData={statsSummary} />
        )}

        {activeTab === 'explorer' && (
          <DataExplorerTable gamesData={enrichedGames} summaryData={statsSummary} />
        )}
      </main>

      {/* Laboratory Technical Footer */}
      <footer>
        <span>GAMEPULSE ANALYTICS — DATA RESEARCH SYSTEM</span>
        <span>
          Base de dados Video Game Sales • React Flow • Vis.js • react-simple-maps • Recharts
        </span>
        <b>ANALOG SOUL. DIGITAL PRECISION.</b>
      </footer>
    </div>
  );
}
