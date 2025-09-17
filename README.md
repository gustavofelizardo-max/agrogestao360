# 🌱 AgroGestão360

**AgroGestão360** é uma plataforma de gestão completa para o agronegócio, conectando produtores, gerentes, agrônomos e compradores em um único ecossistema.  
O sistema permite controle de fazendas, culturas, safras, estoque, financeiro, emissão de NF-e, LCDPR, além de um marketplace integrado para compra e venda de safra e insumos.  
Conta também com módulos de inteligência via APIs e LLMs, trazendo insights em tempo real para apoiar decisões estratégicas.

---

## 🚀 Funcionalidades Principais

- **Gestão de Fazendas & Talhões**: cadastro de áreas próprias ou arrendadas, culturas ativas e safras.
- **Estoque**: múltiplos depósitos, movimentações, inventário físico, rastreabilidade por lote/validade/fabricante.
- **Financeiro**: lançamentos a pagar/receber, centros de custo, fluxo de caixa projetado e integração com tokenização de safra (**Agro-Caixa**).
- **Marketplace**:
  - **Central de Compras**: produtores publicam demandas de safra; compradores negociam e fecham contratos.
  - **Central de Insumos**: produtores publicam ofertas de insumos e atendem demandas de outros produtores.
- **NF-e**: emissão modelo 55, certificado A1, todas as UFs, ambientes Homologação/Produção, eventos (CCe, Cancelamento, Inutilização).
- **LCDPR**: geração e validação no layout oficial da RFB, com plano de contas pré-configurado.
- **Clima e Alertas**: integração com INMET (Day-1), CPTEC e OpenWeather (fallback), além de alertas climáticos, financeiros e de mercado.
- **Copiloto (IA)**: geração de matriz SWOT + plano de ação 30/60/90 dias, pré-preenchido com dados de safra, clima, NDVI, custos e preços. Proativo e integrado ao WhatsApp.

---

## 🛠️ Arquitetura

- **Frontend**: React + Next.js (multilingue: pt-BR, en, es)
- **Backend**: Node.js + Express, com camada Repository/DAO
- **Banco de Dados**: PostgreSQL (localmente pode usar SQLite enquanto evolui)
- **Infra**: Docker + docker-compose
- **APIs externas**: INMET, CPTEC, OpenWeather, NASA POWER, SoilGrids, Sentinel Hub, CONAB, CEPEA, AGROFIT
- **Integrações opcionais**: WhatsApp, LLMs (OpenAI, Anthropic, Gemini, Groq)

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js (>=18)
- Docker e Docker Compose
- PostgreSQL (opcional: use o container incluso)

### Passos
```bash
# 1. Clone o repositório
git clone https://github.com/gustavofelizardo-max/agrogestao360.git
cd agrogestao360

# 2. Crie o arquivo .env
cp .env.example .env
# configure as variáveis de conexão do Postgres e APIs

# 3. Suba o banco via docker
docker compose up -d postgres

# 4. Instale dependências
cd backend && npm install
cd ../frontend && npm install

# 5. Rode backend
cd backend
npm run dev

# 6. Rode frontend
cd ../frontend
npm run dev

# 7. Acesse no navegador
http://localhost:3000
