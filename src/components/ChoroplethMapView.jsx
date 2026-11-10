import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Graticule } from 'react-simple-maps';
import SectionHead from './common/SectionHead';
import Segmented from './common/Segmented';
import Icon from './common/Icon';

const GEO_URL = '/countries-110m.json';

const REGION_MAPPING = {
  'United States of America': 'NA',
  'Canada': 'NA',
  'Mexico': 'NA',
  'Japan': 'JP',
  'United Kingdom': 'EU',
  'Germany': 'EU',
  'France': 'EU',
  'Italy': 'EU',
  'Spain': 'EU',
  'Portugal': 'EU',
  'Netherlands': 'EU',
  'Belgium': 'EU',
  'Sweden': 'EU',
  'Norway': 'EU',
  'Finland': 'EU',
  'Denmark': 'EU',
  'Poland': 'EU',
  'Austria': 'EU',
  'Switzerland': 'EU',
  'Ireland': 'EU',
  'Greece': 'EU',
  'Czech Republic': 'EU',
  'Romania': 'EU',
  'Hungary': 'EU',
  'Brazil': 'OTHER',
  'Argentina': 'OTHER',
  'Chile': 'OTHER',
  'Colombia': 'OTHER',
  'Australia': 'OTHER',
  'New Zealand': 'OTHER',
  'South Africa': 'OTHER',
  'India': 'OTHER',
  'Russia': 'OTHER',
  'South Korea': 'OTHER',
  'China': 'OTHER',
  'Egypt': 'OTHER',
  'Saudi Arabia': 'OTHER',
  'United Arab Emirates': 'OTHER',
};

export default function ChoroplethMapView({ summaryData }) {
  const [metric, setMetric] = useState('sales'); // 'sales' or 'revenue'
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 15]);

  const regional = summaryData?.regional_breakdown || {
    NA: { name: 'América do Norte', share_pct: 49.2, sales_millions: 4392.95, revenue_usd_billions: 226.24 },
    EU: { name: 'Europa', share_pct: 27.3, sales_millions: 2434.13, revenue_usd_billions: 129.01 },
    JP: { name: 'Japão', share_pct: 14.5, sales_millions: 1291.02, revenue_usd_billions: 62.23 },
    OTHER: { name: 'Resto do Mundo', share_pct: 8.9, sales_millions: 797.75, revenue_usd_billions: 39.89 },
  };

  const regionCards = [
    {
      code: 'NA',
      index: '01',
      name: 'América do Norte',
      share: `${regional.NA?.share_pct || 49.2}%`,
      copies: `${Number(regional.NA?.sales_millions || 4392).toFixed(0)}M`,
      revenue: `$${Number(regional.NA?.revenue_usd_billions || 226).toFixed(0)}B`,
      cls: 'na',
    },
    {
      code: 'EU',
      index: '02',
      name: 'Europa',
      share: `${regional.EU?.share_pct || 27.3}%`,
      copies: `${Number(regional.EU?.sales_millions || 2434).toFixed(0)}M`,
      revenue: `$${Number(regional.EU?.revenue_usd_billions || 129).toFixed(0)}B`,
      cls: 'eu',
    },
    {
      code: 'JP',
      index: '03',
      name: 'Japão',
      share: `${regional.JP?.share_pct || 14.5}%`,
      copies: `${Number(regional.JP?.sales_millions || 1291).toFixed(0)}M`,
      revenue: `$${Number(regional.JP?.revenue_usd_billions || 62).toFixed(0)}B`,
      cls: 'jp',
    },
    {
      code: 'OTHER',
      index: '04',
      name: 'Resto do Mundo',
      share: `${regional.OTHER?.share_pct || 8.9}%`,
      copies: `${Number(regional.OTHER?.sales_millions || 798).toFixed(0)}M`,
      revenue: `$${Number(regional.OTHER?.revenue_usd_billions || 40).toFixed(0)}B`,
      cls: 'rw',
    },
  ];

  const getRegionCode = (countryName) => {
    return REGION_MAPPING[countryName] || 'OTHER';
  };

  const getRegionColor = (regionCode) => {
    if (regionCode === 'NA') return '#C56B3D'; // orange
    if (regionCode === 'EU') return '#748A99'; // blue-gray
    if (regionCode === 'JP') return '#747B59'; // olive
    if (regionCode === 'OTHER') return '#824D48'; // burgundy
    return '#BAAF99';
  };

  return (
    <>
      <SectionHead
        eyebrow="ANÁLISE 03 / ATLAS ECONÔMICO"
        title="Global Market Distribution"
        desc="Participação regional nas vendas e no faturamento histórico."
        code="03—G"
      />

      {/* Metric Mode Bar */}
      <div className="metric-bar">
        <div>
          <label>MODO DE MEDIÇÃO CARTOGRÁFICA</label>
          <Segmented
            values={[
              { label: 'Vendas em Milhões', value: 'sales' },
              { label: 'Faturamento em $B', value: 'revenue' },
            ]}
            value={metric}
            onChange={setMetric}
            ariaLabel="Modo de medição regional"
          />
        </div>
        <div className="map-scale">
          ESCALA 1:{Math.round(45000000 / zoom).toLocaleString('pt-BR')}
        </div>
      </div>

      {/* 4 Regional Index Cards */}
      <div className="region-grid">
        {regionCards.map((r) => (
          <article key={r.code} className={`region-card ${r.cls}`}>
            <div className="region-index">{r.index}</div>
            <span>{r.name.toUpperCase()}</span>
            <b>{r.share}</b>
            <div>
              <strong>{r.copies}</strong>
              <small>CÓPIAS</small>
            </div>
            <div>
              <strong>{r.revenue}</strong>
              <small>RECEITA</small>
            </div>
          </article>
        ))}
      </div>

      {/* Atlas Viewport Panel */}
      <div className="atlas-panel">
        <div className="atlas-title">
          <span>ATLAS DO COMÉRCIO DIGITAL / PROJEÇÃO CARTOGRÁFICA MERCATOR</span>
          <b>{metric === 'sales' ? 'VENDAS GLOBAIS (CÓPIAS)' : 'RECEITA BRUTA ESTIMADA (USD)'}</b>
        </div>

        <div className="map-viewport">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120, center: [0, 15] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup
              zoom={zoom}
              center={center}
              onMoveEnd={({ coordinates, zoom: newZoom }) => {
                setCenter(coordinates);
                setZoom(newZoom);
              }}
            >
              <Graticule stroke="#b0a590" strokeWidth={0.5} strokeDasharray="3 3" />
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const regionCode = getRegionCode(countryName);
                    const regionData = regional[regionCode] || {};

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(evt) => {
                          setHoveredCountry({ name: countryName, regionCode, regionData });
                          setTooltipPos({ x: evt.clientX, y: evt.clientY });
                        }}
                        onMouseMove={(evt) => setTooltipPos({ x: evt.clientX, y: evt.clientY })}
                        onMouseLeave={() => setHoveredCountry(null)}
                        style={{
                          default: {
                            fill: getRegionColor(regionCode),
                            outline: 'none',
                            stroke: '#3b382d',
                            strokeWidth: 0.6,
                            transition: 'all 0.15s ease',
                          },
                          hover: {
                            fill: '#FAF6ED',
                            outline: 'none',
                            stroke: '#171815',
                            strokeWidth: 1.2,
                            cursor: 'crosshair',
                          },
                          pressed: {
                            fill: '#C56B3D',
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Analog Floating Tooltip */}
          {hoveredCountry && (
            <div
              className="map-tooltip"
              style={{
                position: 'fixed',
                left: tooltipPos.x + 14,
                top: tooltipPos.y - 28,
              }}
            >
              <span>REGIÃO CARTOGRÁFICA: {hoveredCountry.regionData.name || hoveredCountry.regionCode}</span>
              <h3>{hoveredCountry.name}</h3>
              <b>
                {metric === 'sales'
                  ? `${hoveredCountry.regionData.sales_millions}M cópias`
                  : `$${hoveredCountry.regionData.revenue_usd_billions}B USD`}
              </b>
              <small>PARTICIPAÇÃO REGIONAL: {hoveredCountry.regionData.share_pct}% DO TOTAL</small>
            </div>
          )}

          {/* Mechanical Zoom Controls */}
          <div className="map-controls">
            <button
              type="button"
              aria-label="Aumentar zoom do mapa"
              onClick={() => setZoom((z) => Math.min(4.5, z * 1.25))}
            >
              <Icon name="plus" size={15} />
            </button>
            <button
              type="button"
              aria-label="Diminuir zoom do mapa"
              onClick={() => setZoom((z) => Math.max(0.75, z / 1.25))}
            >
              <Icon name="minus" size={15} />
            </button>
            <button
              type="button"
              aria-label="Restaurar zoom original"
              onClick={() => {
                setZoom(1);
                setCenter([0, 15]);
              }}
            >
              <Icon name="reset" size={15} />
            </button>
          </div>
        </div>

        {/* Graphic Scale and Compass Footer */}
        <div className="atlas-foot">
          <span>0</span>
          <i />
          <span>2.000</span>
          <i />
          <span>4.000 KM</span>
          <b>N ↑</b>
        </div>
      </div>
    </>
  );
}
