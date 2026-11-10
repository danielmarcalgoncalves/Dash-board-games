import React from 'react';
import Icon from './common/Icon';

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'scatter', num: '01', label: 'Correlações', icon: 'scatter' },
    { id: 'visNetwork', num: '02', label: 'Simulador de Forças', icon: 'network' },
    { id: 'choropleth', num: '03', label: 'Mapa Global', icon: 'map' },
    { id: 'flow', num: '04', label: 'Fluxo do Ecossistema', icon: 'flow' },
    { id: 'explorer', num: '05', label: 'Tabela de Jogos', icon: 'table' },
  ];

  return (
    <header className="instrument-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <Icon name="gamepad" size={22} />
          <span>GP</span>
        </div>
        <div>
          <div className="brand-title">
            GAMEPULSE <b>ANALYTICS</b>
          </div>
          <div className="brand-meta">VGChartz Database / 16,598 Titles</div>
        </div>
        <div className="serial">
          DATA RESEARCH SYSTEM
          <br />
          <b>VOL. 01</b>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navegação principal do laboratório">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? 'active' : ''}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.num}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
