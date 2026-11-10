import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  Building2, 
  Sparkles,
} from 'lucide-react';

export default function PublishersEfficiencyView({ summaryData }) {
  const [metricMode, setMetricMode] = useState('efficiency'); // 'efficiency', 'totalSales', 'volume'
  const [searchTerm] = useState('');
  const [topCount] = useState(15);

  const publishers = useMemo(() => summaryData?.publishers || [], [summaryData]);

  // Filter & calculate efficiency
  const processedPublishers = useMemo(() => {
    return publishers.map(p => ({
      ...p,
      sales_per_game: Number((p.global_sales / p.games_count).toFixed(2)),
      revenue_per_game: Number((p.total_revenue / p.games_count).toFixed(2)),
    }));
  }, [publishers]);

  const filteredList = useMemo(() => {
    let list = processedPublishers;
    if (searchTerm.trim()) {
      list = list.filter(p => p.publisher.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (metricMode === 'efficiency') {
      return [...list].sort((a, b) => b.sales_per_game - a.sales_per_game).slice(0, topCount);
    } else if (metricMode === 'volume') {
      return [...list].sort((a, b) => b.games_count - a.games_count).slice(0, topCount);
    } else {
      return [...list].sort((a, b) => b.global_sales - a.global_sales).slice(0, topCount);
    }
  }, [processedPublishers, searchTerm, metricMode, topCount]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'rgba(59, 130, 246, 0.2)' }}>
              <Building2 size={22} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: 0 }}>
                Distribuidoras: Volume de Jogos vs Eficiência Comercial
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                Lançar mais jogos garante mais vendas? Descubra a comparação entre volume de catálogo e taxa de acerto por título.
              </p>
            </div>
          </div>

          {/* Metric View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>ORDENAR POR:</span>
            {[
              { id: 'efficiency', label: '⚡ Eficiência (Vendas / Jogo)' },
              { id: 'totalSales', label: '🏆 Vendas Globais Totais' },
              { id: 'volume', label: '📦 Qtde de Jogos Feitos' },
            ].map(m => (
              <button
                key={m.id}
                className={`btn btn-secondary ${metricMode === m.id ? 'active' : ''}`}
                style={{ fontSize: 12, padding: '6px 14px' }}
                onClick={() => setMetricMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparative Spotlight: Nintendo vs EA */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: 16, margin: 0, color: '#f8fafc' }}>
            Estudo de Caso Emblemático: Nintendo (Foco em Qualidade) vs Electronic Arts (Foco em Volume)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* Nintendo Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#f87171' }}>Nintendo</span>
              <span className="badge badge-rose">Campeã de Eficiência</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Jogos Lançados:</span>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#f8fafc' }}>703 jogos</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vendas Globais:</span>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#38bdf8' }}>1.786M cópias</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Média por Jogo:</span>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#34d399' }}>2.54M cópias/jogo</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Maior Sucesso:</span>
                <div style={{ fontWeight: 600, color: '#fcd34d' }}>Wii Sports (82.7M)</div>
              </div>
            </div>
          </div>

          {/* Electronic Arts Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#60a5fa' }}>Electronic Arts (EA)</span>
              <span className="badge badge-cyan">Campeã de Volume</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Jogos Lançados:</span>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#f8fafc' }}>1.351 jogos (quase 2x)</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vendas Globais:</span>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#38bdf8' }}>1.110M cópias</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Média por Jogo:</span>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#93c5fd' }}>0.82M cópias/jogo</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Maior Sucesso:</span>
                <div style={{ fontWeight: 600, color: '#fcd34d' }}>FIFA 16 (8.49M)</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          💡 <strong>Conclusão do Dado:</strong> A Nintendo gerou <strong>60% mais vendas</strong> que a EA com praticamente <strong>metade dos jogos lançados</strong>. Isso comprova que na indústria de jogos eletrônicos, o valor percebido de franquias consagradas e excelência de qualidade gera retornos muito mais exponenciais do que a mera proliferação de títulos anuais.
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>
            Ranking Top {topCount} Distribuidoras — {metricMode === 'efficiency' ? 'Vendas Médias por Jogo (M)' : metricMode === 'totalSales' ? 'Vendas Totais Acumuladas (M)' : 'Catálogo Total de Jogos'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Exibir:</span>
            {[10, 15, 25].map(cnt => (
              <button
                key={cnt}
                className={`btn btn-secondary ${topCount === cnt ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => setTopCount(cnt)}
              >
                Top {cnt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredList} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis 
                dataKey="publisher" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[0, 'auto']}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="custom-chart-tooltip">
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#ffffff', marginBottom: 4 }}>
                          {data.publisher}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                          Gênero Forte: <strong style={{ color: 'var(--accent-cyan)' }}>{data.top_genre}</strong> | Console Principal: <strong style={{ color: '#f59e0b' }}>{data.top_platform}</strong>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 8,
                          paddingTop: 6,
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          fontSize: 11,
                        }}>
                          <div>Vendas Totais: <strong style={{ color: '#38bdf8' }}>{data.global_sales}M</strong></div>
                          <div>Jogos Catalogados: <strong style={{ color: '#ffffff' }}>{data.games_count}</strong></div>
                          <div>Eficiência: <strong style={{ color: '#34d399' }}>{data.sales_per_game}M/jogo</strong></div>
                          <div>Faturamento: <strong style={{ color: '#c084fc' }}>${data.total_revenue}M</strong></div>
                          <div>Nota Média: <strong style={{ color: '#fcd34d' }}>{data.avg_score}/100</strong></div>
                          <div>Share Global: <strong style={{ color: '#f43f5e' }}>{data.market_share_pct}%</strong></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={metricMode === 'efficiency' ? 'sales_per_game' : metricMode === 'totalSales' ? 'global_sales' : 'games_count'} 
                radius={[6, 6, 0, 0]}
              >
                {filteredList.map((entry, index) => {
                  const color = entry.publisher === 'Nintendo' ? '#ef4444' :
                                entry.publisher === 'Electronic Arts' ? '#3b82f6' :
                                entry.publisher === 'Activision' ? '#8b5cf6' :
                                entry.publisher === 'Sony Computer Entertainment' ? '#06b6d4' :
                                '#6366f1';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
