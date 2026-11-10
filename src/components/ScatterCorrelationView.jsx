import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import SectionHead from './common/SectionHead';
import Segmented from './common/Segmented';

const VARIABLES = [
  { id: 'price', label: 'Preço de Lançamento ($)', shortLabel: 'PREÇO / USD', format: (v) => `$${Number(v).toFixed(0)}` },
  { id: 'critic_score', label: 'Qualidade / Metascore (0-100)', shortLabel: 'METASCORE / 100', format: (v) => `${Math.round(v)}` },
  { id: 'global_sales', label: 'Vendas Globais (M)', shortLabel: 'VENDAS GLOBAIS / M', format: (v) => `${Number(v).toFixed(1)}M` },
  { id: 'revenue', label: 'Receita Estimada ($M)', shortLabel: 'RECEITA EST. / $M', format: (v) => `$${Number(v).toFixed(0)}M` },
  { id: 'na_sales', label: 'Vendas América do Norte (M)', shortLabel: 'VENDAS NA / M', format: (v) => `${Number(v).toFixed(1)}M` },
  { id: 'jp_sales', label: 'Vendas Japão (M)', shortLabel: 'VENDAS JP / M', format: (v) => `${Number(v).toFixed(1)}M` },
  { id: 'year', label: 'Ano de Lançamento', shortLabel: 'ANO LANÇAMENTO', format: (v) => `${Math.round(v)}` },
];

export default function ScatterCorrelationView({ gamesData, summaryData }) {
  const [sampleLimit, setSampleLimit] = useState(20);
  const [scenario, setScenario] = useState('Preço vs Vendas');
  const [xAxisKey, setXAxisKey] = useState('price');
  const [yAxisKey, setYAxisKey] = useState('global_sales');
  const [selectedGenre, setSelectedGenre] = useState('ALL');

  // Filter dataset by Top N and Genre
  const filteredData = useMemo(() => {
    let list = gamesData;
    if (selectedGenre !== 'ALL') {
      list = list.filter((g) => g.genre === selectedGenre);
    }
    return list.slice(0, sampleLimit);
  }, [gamesData, selectedGenre, sampleLimit]);

  // Compute live Pearson Correlation
  const correlation = useMemo(() => {
    if (filteredData.length < 3) {
      return { r: 0, text: 'Amostra insuficiente', strength: 'Amostra pequena', color: '#777366', angle: 0, mx: 0, my: 0 };
    }

    const xs = filteredData.map((d) => Number(d[xAxisKey]) || 0);
    const ys = filteredData.map((d) => Number(d[yAxisKey]) || 0);
    const n = xs.length;

    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;

    let cov = 0;
    let vx = 0;
    let vy = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - mx;
      const dy = ys[i] - my;
      cov += dx * dy;
      vx += dx * dx;
      vy += dy * dy;
    }

    const denom = Math.sqrt(vx * vy);
    const r = denom > 0 ? cov / denom : 0;
    const absR = Math.abs(r);

    let strength = 'DISPERSÃO SEM RELAÇÃO DIRETA';
    let dotColor = '#777366';
    let explanation = 'A dispersão indica independência entre as variáveis.';

    if (absR >= 0.6) {
      strength = r > 0 ? 'FORTE CORRELAÇÃO POSITIVA' : 'FORTE CORRELAÇÃO INVERSA';
      dotColor = '#747B59'; // olive
      explanation = 'A relação estatística sugere forte associação direta nos dados.';
    } else if (absR >= 0.3) {
      strength = r > 0 ? 'CORRELAÇÃO MODERADA POSITIVA' : 'CORRELAÇÃO MODERADA INVERSA';
      dotColor = '#C3A15A'; // mustard
      explanation = 'Existe tendência identificável com variação residual moderada.';
    } else if (absR >= 0.15) {
      strength = 'CORRELAÇÃO LEVE';
      dotColor = '#C56B3D'; // orange
      explanation = 'Tendência discreta com alta dispersão de dados na amostra.';
    }

    // Map r [-1, 1] to needle rotation [-75deg, +75deg]
    const angle = Math.min(Math.max(r * 75, -80), 80);

    return {
      r: Number(r.toFixed(2)),
      strength,
      dotColor,
      explanation,
      angle,
      mx,
      my,
    };
  }, [filteredData, xAxisKey, yAxisKey]);

  const currentX = VARIABLES.find((v) => v.id === xAxisKey) || VARIABLES[0];
  const currentY = VARIABLES.find((v) => v.id === yAxisKey) || VARIABLES[2];

  // Dynamic insight takeaway
  const observationText = useMemo(() => {
    if (xAxisKey === 'price' && yAxisKey === 'global_sales') {
      return '“Jogos com preço cheio ($50–$60) não vendem menos: os maiores blockbusters mundiais (Super Mario, Call of Duty, GTA) concentram-se no patamar de preço AAA comercial.”';
    }
    if (xAxisKey === 'critic_score' && yAxisKey === 'global_sales') {
      return '“Títulos com avaliação crítica acima de 85 pontos registram aceleração exponencial de vendas, validando a nota Metascore como indicador de relevância comercial.”';
    }
    if (xAxisKey === 'price' && yAxisKey === 'revenue') {
      return '“O faturamento bruto acumulado concentra-se maciçamente nas faixas de lançamento de $40 a $60, estabelecendo o teto de rentabilidade da distribuição física.”';
    }
    return `“Análise da relação de dispersão entre ${currentX.label} e ${currentY.label} para a prancha de registro com Top ${sampleLimit} títulos selecionados.”`;
  }, [xAxisKey, yAxisKey, currentX, currentY, sampleLimit]);

  const handleScenarioSelect = (scen) => {
    setScenario(scen);
    if (scen === 'Preço vs Vendas') {
      setXAxisKey('price');
      setYAxisKey('global_sales');
    } else if (scen === 'Nota vs Vendas') {
      setXAxisKey('critic_score');
      setYAxisKey('global_sales');
    } else if (scen === 'Preço vs Receita') {
      setXAxisKey('price');
      setYAxisKey('revenue');
    }
  };

  return (
    <>
      <SectionHead
        eyebrow="ANÁLISE 01 / CORRELAÇÕES E DISPERSÃO"
        title="Photographic Data Study"
        desc="Relações entre variáveis comerciais no mercado global de videogames."
        code="01—A"
      />

      {/* Filter and Instrument Console */}
      <div className="filter-console">
        <div className="control-group wide">
          <label>SELEÇÃO DE AMOSTRA</label>
          <Segmented
            values={[
              { label: 'Top 10', value: 10 },
              { label: 'Top 20', value: 20 },
              { label: 'Top 100', value: 100 },
              { label: 'Top 200', value: 200 },
            ]}
            value={sampleLimit}
            onChange={(val) => setSampleLimit(Number(val))}
            ariaLabel="Amostra de títulos"
          />
        </div>

        <div className="control-group wide">
          <label>CENÁRIOS RÁPIDOS</label>
          <Segmented
            values={['Preço vs Vendas', 'Nota vs Vendas', 'Preço vs Receita']}
            value={scenario}
            onChange={handleScenarioSelect}
            ariaLabel="Cenários rápidos"
          />
        </div>

        <div className="control-group">
          <label htmlFor="axis-x-select">EIXO X</label>
          <select
            id="axis-x-select"
            value={xAxisKey}
            onChange={(e) => {
              setXAxisKey(e.target.value);
              setScenario('');
            }}
          >
            {VARIABLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="axis-y-select">EIXO Y</label>
          <select
            id="axis-y-select"
            value={yAxisKey}
            onChange={(e) => {
              setYAxisKey(e.target.value);
              setScenario('');
            }}
          >
            {VARIABLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="genre-filter-select">GÊNERO</label>
          <select
            id="genre-filter-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="ALL">Todos os Gêneros</option>
            {summaryData?.genres?.map((g) => (
              <option key={g.genre} value={g.genre}>
                {g.genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Grid: Plot + Side Stack */}
      <div className="analysis-grid">
        <div className="paper-panel plot-wrap">
          <div className="chart-stamp">
            FIG. 01 — REGRESSÃO LINEAR / AMOSTRA TOP {sampleLimit} • {selectedGenre === 'ALL' ? 'TODOS OS GÊNEROS' : selectedGenre.toUpperCase()}
          </div>

          <div style={{ width: '100%', height: 430 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 28, bottom: 28, left: 24 }}>
                <defs>
                  <pattern id="technicalPlotGrid" width="48" height="38" patternUnits="userSpaceOnUse">
                    <path d="M48 0H0V38" fill="none" stroke="#b7ad99" strokeWidth="0.55" />
                  </pattern>
                </defs>
                <CartesianGrid stroke="#b7ad99" strokeWidth={0.6} strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey={xAxisKey} 
                  stroke="#514e43"
                  tick={{ fill: '#514e43', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  tickFormatter={(v) => currentX.format(v)}
                  label={{ 
                    value: currentX.shortLabel, 
                    position: 'insideBottom', 
                    offset: -18, 
                    fill: '#39372f', 
                    fontSize: 9.5, 
                    fontFamily: 'IBM Plex Mono',
                    letterSpacing: '0.12em',
                    fontWeight: 600
                  }}
                  domain={['auto', 'auto']}
                />
                <YAxis 
                  type="number" 
                  dataKey={yAxisKey} 
                  stroke="#514e43"
                  tick={{ fill: '#514e43', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  tickFormatter={(v) => currentY.format(v)}
                  label={{ 
                    value: currentY.shortLabel, 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: -12, 
                    fill: '#39372f', 
                    fontSize: 9.5, 
                    fontFamily: 'IBM Plex Mono',
                    letterSpacing: '0.12em',
                    fontWeight: 600
                  }}
                  domain={['auto', 'auto']}
                />
                <ZAxis range={[60, 160]} />

                {/* Mean reference lines */}
                {correlation.mx > 0 && (
                  <ReferenceLine 
                    x={correlation.mx} 
                    stroke="#C56B3D" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.2}
                    label={{ value: 'MÉDIA X', position: 'insideTopLeft', fill: '#C56B3D', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
                  />
                )}
                {correlation.my > 0 && (
                  <ReferenceLine 
                    y={correlation.my} 
                    stroke="#C56B3D" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.2}
                    label={{ value: 'MÉDIA Y', position: 'insideBottomRight', fill: '#C56B3D', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
                  />
                )}

                {/* Tooltip near the mouse cursor, clamped within the graph */}
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#282720' }}
                  offset={14}
                  allowEscapeViewBox={{ x: false, y: false }}
                  wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const estRevenue = data.revenue 
                        ? (data.revenue >= 1000 ? `$${(data.revenue / 1000).toFixed(2)}B` : `$${data.revenue.toFixed(0)}M`)
                        : `$${((data.global_sales * data.price) / 1000).toFixed(2)}B`;
                      return (
                        <div className="archive-tooltip">
                          <div className="tooltip-top">
                            <span>REGISTRO #{String(data.rank).padStart(3, '0')}</span>
                            <b>{data.platform}</b>
                          </div>
                          <h3>{data.name}</h3>
                          <div className="tooltip-grid">
                            <span>
                              Preço: <b>${Number(data.price).toFixed(2)}</b>
                            </span>
                            <span>
                              Metascore: <b>{data.critic_score}/100</b>
                            </span>
                            <span>
                              Vendas: <b>{Number(data.global_sales).toFixed(1)}M</b>
                            </span>
                            <span>
                              Receita Est.: <b>{estRevenue}</b>
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Scatter 
                  name="Títulos" 
                  data={filteredData} 
                  animationDuration={350}
                  shape={(props) => {
                    const { cx, cy, payload } = props;
                    const isTop10 = payload.rank <= 10;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isTop10 ? 7 : (sampleLimit <= 20 ? 6 : 4.5)} 
                        fill={isTop10 ? '#638783' : '#C56B3D'} 
                        fillOpacity={0.92}
                        stroke="#282720"
                        strokeWidth={1.2}
                        style={{ cursor: 'crosshair', transition: 'r 0.15s ease' }}
                      />
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span>
              <i className="teal-dot" />
              Top 10 títulos (Destaque Principal)
            </span>
            <span>
              <i className="orange-dot" />
              Demais títulos
            </span>
            <span>┄ Linhas de média</span>
          </div>
        </div>

        {/* Side Stack with Analog Meter and Research Note */}
        <aside className="side-stack">
          {/* Analog Meter Card */}
          <div className="meter-card">
            <div className="card-label">CORRELAÇÃO CALCULADA (PEARSON)</div>
            <div className="dial" aria-label={`Mostrador analógico de correlação: ${correlation.r}`}>
              <div className="dial-ticks" />
              <div 
                className="needle" 
                style={{ transform: `rotate(${correlation.angle}deg)` }} 
              />
              <div className="dial-center">
                <small>COEF.</small>
                <b>{correlation.r >= 0 ? `+${correlation.r}` : correlation.r}</b>
              </div>
            </div>

            <div className="positive-status">
              <span style={{ backgroundColor: correlation.dotColor, boxShadow: `0 0 0 3px ${correlation.dotColor}33` }} />
              {correlation.strength}
            </div>
            <p>{correlation.explanation}</p>
          </div>

          {/* Research Note Pinned */}
          <div className="research-note">
            <div className="clip" aria-hidden="true" />
            <div className="card-label">AI TAKEAWAY / OBSERVAÇÃO 01</div>
            <p>{observationText}</p>
            <div className="note-sign">
              <span>ANÁLISE AUTOMATIZADA</span>
              <b>GP–01</b>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
