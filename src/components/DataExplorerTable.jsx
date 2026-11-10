import React, { useState, useMemo } from 'react';
import SectionHead from './common/SectionHead';
import Segmented from './common/Segmented';
import Icon from './common/Icon';

export default function DataExplorerTable({ gamesData, summaryData }) {
  const [sampleLimit, setSampleLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredGames = useMemo(() => {
    let result = (gamesData || []).slice(0, sampleLimit);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.publisher.toLowerCase().includes(term) ||
          g.platform.toLowerCase().includes(term)
      );
    }

    if (selectedGenre !== 'ALL') {
      result = result.filter((g) => g.genre === selectedGenre);
    }

    return result;
  }, [gamesData, sampleLimit, searchTerm, selectedGenre]);

  const totalPages = Math.ceil(filteredGames.length / pageSize) || 1;
  const paginatedGames = filteredGames.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownloadCSV = () => {
    const headers = [
      'Rank',
      'Título',
      'Console',
      'Gênero',
      'Distribuidora',
      'Preço (USD)',
      'Metascore',
      'Vendas Globais (M)',
      'Receita Estimada ($M)',
    ];

    const rows = filteredGames.map((g) => [
      g.rank,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.platform}"`,
      `"${g.genre}"`,
      `"${g.publisher.replace(/"/g, '""')}"`,
      g.price ? Number(g.price).toFixed(2) : '0.00',
      g.critic_score || 0,
      g.global_sales ? Number(g.global_sales).toFixed(2) : '0.00',
      g.revenue ? Number(g.revenue).toFixed(2) : ((g.global_sales * g.price) || 0).toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gamepulse-catalogo-top${sampleLimit}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPlatformClass = (plat) => {
    const p = String(plat).toLowerCase();
    if (p.includes('wii')) return 'wii';
    if (p.includes('360') || p.includes('xbox')) return 'x360';
    if (p.includes('ps3') || p.includes('ps2') || p.includes('ps4')) return 'ps3';
    if (p.includes('ds') || p.includes('gb') || p.includes('nes') || p.includes('snes')) return 'ds';
    return '';
  };

  return (
    <>
      <SectionHead
        eyebrow="ANÁLISE 05 / REGISTRO MESTRE"
        title="Catálogo Estatístico de Jogos"
        desc="Arquivo explorável de títulos, desempenho crítico e resultados comerciais."
        code="05—R"
      />

      {/* Filter and Query Console */}
      <div className="table-filters">
        <div>
          <label>AMOSTRA DE REGISTROS</label>
          <Segmented
            values={[
              { label: 'Top 10', value: 10 },
              { label: 'Top 20', value: 20 },
              { label: 'Top 100', value: 100 },
              { label: 'Top 200', value: 200 },
            ]}
            value={sampleLimit}
            onChange={(val) => {
              setSampleLimit(Number(val));
              setCurrentPage(1);
            }}
            ariaLabel="Amostra de registros da tabela"
          />
        </div>

        <div className="search-box">
          <label htmlFor="search-archive-input">LOCALIZAR NO ARQUIVO</label>
          <div>
            <Icon name="search" size={14} />
            <input
              id="search-archive-input"
              type="text"
              placeholder="Título, console ou distribuidora..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="select-box">
          <label htmlFor="table-genre-select">GÊNERO</label>
          <select
            id="table-genre-select"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">Todos os Gêneros</option>
            {summaryData?.genres?.map((g) => (
              <option key={g.genre} value={g.genre}>
                {g.genre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="download-btn"
          onClick={handleDownloadCSV}
        >
          <Icon name="download" size={14} />
          Baixar CSV do Arquivo
        </button>
      </div>

      {/* Master Register Table Container */}
      <div className="register-wrap">
        <div className="register-head">
          <span>GAMEPULSE / MASTER REGISTER ARCHIVE</span>
          <b>VG–DATA–16598</b>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Título</th>
                <th>Console</th>
                <th>Gênero</th>
                <th>Distribuidora</th>
                <th>Preço</th>
                <th>Metascore</th>
                <th>Vendas Globais</th>
                <th>Receita Est.</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGames.length > 0 ? (
                paginatedGames.map((game) => {
                  const estRev = game.revenue
                    ? (game.revenue >= 1000 ? `$${(game.revenue / 1000).toFixed(2)}B` : `$${Number(game.revenue).toFixed(1)}M`)
                    : `$${(((game.global_sales || 0) * (game.price || 0)) / 1000).toFixed(2)}B`;
                  return (
                    <tr key={game.rank}>
                      <td className="rank">#{String(game.rank).padStart(3, '0')}</td>
                      <td className="game-title">
                        {game.name}
                        <small>CAT. VG/{game.rank} • ANO {game.year || 'N/A'}</small>
                      </td>
                      <td>
                        <span className={`platform ${getPlatformClass(game.platform)}`}>
                          {game.platform}
                        </span>
                      </td>
                      <td>{game.genre}</td>
                      <td>{game.publisher}</td>
                      <td className="num">${Number(game.price || 0).toFixed(2)}</td>
                      <td>
                        <span className={`score ${game.critic_score >= 85 ? 'high' : ''}`}>
                          {game.critic_score || '—'}
                        </span>
                      </td>
                      <td className="num">
                        <b>{Number(game.global_sales || 0).toFixed(2)}M</b>
                      </td>
                      <td className="num">{estRev}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--muted)' }}>
                    Nenhum registro encontrado para os critérios de busca especificados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mechanical Pagination */}
        <div className="pagination">
          <span>
            Exibindo página <b>{currentPage}</b> de <b>{totalPages}</b> (Total de <b>{filteredGames.length}</b> títulos filtrados)
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </button>
            <span>
              {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
