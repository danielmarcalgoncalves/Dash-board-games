# GamePulse Analytics — Analog Data Lab

Dashboard editorial e científico para análise mercadológica, correlações e exploração histórica de mais de 16.500 títulos da indústria global de videogames (base VGChartz).

> **Conceito**: *"Analog Soul. Digital Precision."* — Um laboratório de dados inspirado em equipamentos analógicos dos anos 1970–1980 (Leica, Pentax), fichas técnicas e relatórios impressos.

---

## 🔬 As 5 Pranchas de Análise

1. **PLATE 01—A / Photographic Data Study (Correlações e Dispersão)**:
   * Gráfico de dispersão (*Recharts*) em papel milimetrado técnico.
   * Seletores dinâmicos de amostra (Top 10 a Top 200), cenários rápidos e eixos X/Y independentes.
   * Cálculo ao vivo do coeficiente de correlação de Pearson ($r$) com mostrador analógico (*dial* mecânico) e notas de pesquisa automáticas.

2. **PLATE 02—N / Network Investigation Board (Simulador de Forças em Grafo)**:
   * Grafo de influência com física em tempo real (*Vis.js Network*).
   * Mapeamento relacional entre distribuidoras, plataformas, gêneros e jogos.
   * Formas geométricas e cores dedicadas, pausa/retomada de física, centralização e painel de inspeção de nó.

3. **PLATE 03—G / Global Market Distribution (Atlas Cartográfico Econômico)**:
   * Mapa-múndi com projeção Mercator (*react-simple-maps* / *TopoJSON*).
   * Cartões regionais consolidados (América do Norte 49.2%, Europa 27.3%, Japão 14.5%, Resto do Mundo 8.9%).
   * Alternância entre volume de vendas (M) e faturamento ($B), zoom com escala dinâmica e bússola.

4. **PLATE 04—F / Fluxo do Ecossistema (Diagrama Industrial de Valor)**:
   * Diagrama interativo de 4 colunas (*@xyflow/react*): Distribuidoras ➔ Plataformas ➔ Preços ➔ Faturamento.
   * Módulos industriais com portas de conexão e minimapa em estilo blueprint.

5. **PLATE 05—R / Catálogo Estatístico de Jogos (Registro Mestre)**:
   * Arquivo de dados completo com busca instantânea, filtro por gênero, paginação mecânica e download dinâmico em CSV.

---

## 🛠️ Stack Tecnológica

* **Framework**: React 19 + Vite
* **Gráficos & Mapas**: Recharts, Vis.js (`vis-network`), React Flow (`@xyflow/react`), `react-simple-maps`, `topojson-client`
* **Estilização**: CSS modular com variáveis semânticas analógicas e tipografia Google Fonts (*Cormorant Garamond*, *IBM Plex Mono*, *IBM Plex Sans*)
* **Qualidade de Código**: Oxlint (0 erros, 0 warnings)

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Executar lint
npm run lint
```
