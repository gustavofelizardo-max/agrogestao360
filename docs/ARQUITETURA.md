# Arquitetura — AgroTech (Agro Gestão 360)

Este documento descreve a arquitetura inicial do sistema AgroTech. Ele serve de referência rápida para devs e para o Claude.

---

## 🌐 Visão Geral

```
+-----------------+       +-----------------+       +------------------+
|   Frontend      | <-->  |    Backend      | <-->  |   PostgreSQL DB  |
| (Next.js/TW)    |       | (Node/FastAPI)  |       |  (agrotech)      |
+-----------------+       +-----------------+       +------------------+
        |                         |                          |
        |                         |                          |
        v                         v                          v
+------------------+     +------------------+        +-------------------+
|   Integrações    |     |   AdvisorService |        |   Seeds/Migrations|
| (APIs & LLMs)    |     | (LLMs + RAG)     |        |   (i18n JSONB)    |
+------------------+     +------------------+        +-------------------+
        |                         ^
        v                         |
  WhatsApp Gateway  <-------------+
```

### Stack recomendada
- **Frontend**: Next.js + Tailwind + shadcn/ui + Leaflet/MapLibre.
- **Backend**: manter stack existente do repositório. Caso inexistente, adotar Node (Fastify/Express) **ou** FastAPI.
- **Banco**: PostgreSQL `agrotech` (local e nuvem).
- **ORM**: usar o que já existir no repo. Se não houver, preferir **Prisma** (Node) ou **SQLModel/Alembic** (Python).
- **LLMs**: OpenAI / Anthropic / Google / Llama via Groq ou self-host.

---

## 📊 Fluxos principais

1) **Dashboard**
- Frontend carrega quadrantes habilitados (2×2 por página).
- RBAC (Admin, Fazendeiro, Gerente, Agrônomo) filtra menus por perfil.
- Cada quadrante consulta o backend → dados de clima/NDVI/solo/mercado/ops.
- Backend consulta integrações **ativas** (ou mocks) e retorna JSON.

2) **Configurações**
- Admin acessa `/configuracoes` (UI).
- Backend lê tabela `integrations` (status, credenciais mascaradas).
- Botão **Testar conexão** chama provider e retorna status/quota.

3) **Advisor (LLM)**
- “Analisar com IA” → `POST /advisor/summary` com `{role, farmId, menu, locale, context}`.
- AdvisorService seleciona LLM ativa, injeta `locale`, executa RAG e retorna resposta **curta e objetiva**.

4) **WhatsApp**
- Webhook no backend para mensagens e disparo de alertas (clima, pragas, preço).
- Configuração do gateway em `/configuracoes`.

---

## 🗄️ Banco de Dados (PostgreSQL)

- DB local: `agrotech` | User: `gustavo.felizardo` | Pass: `F3liz2025` | Host: `localhost` | Porta: `5432`.
- Campos textuais expostos na UI devem ser `*_i18n JSONB` com chaves obrigatórias `"pt-BR"`, `"en"`, `"es"`.
- Criar **constraints** garantindo presença das 3 chaves. Indexar JSONB (GIN) em campos consultados.

**Tabelas mínimas**
- `users (id, role, display_name_i18n JSONB, ...)`
- `farms (id, name_i18n JSONB, cep, uf, municipio_i18n JSONB, cultura_principal_i18n JSONB, culturas_i18n JSONB, area_ha, poligonos_geojson JSONB, ...)`
- `integrations (id, provider, type, active, credentials JSONB, order_preference, status, quota_info, name_i18n JSONB, description_i18n JSONB, updated_at)`
- `climate/ndvi/soil/market/ops` para cache e histórico.

---

## 🎨 UI/UX

- Paleta: **palha + verdes** (com marrom de acento). Definir tokens em `globals.css` e mapear no `tailwind.config.js`.
- Dashboard: quadrantes com KPI principal, 2 KPIs secundários, mini-gráfico/mini-mapa, botões de ação.
- Estados dos quadrantes: `loading`, `vazio`, `erro`, `integração inativa (CTA para ativar)`.
- i18n 100%: nada de strings hardcoded.

---

## 🔒 Segurança & RBAC

- RBAC no backend + guardas no frontend.
- Rotas `/config/*` restritas a **Admin**.
- Credenciais em DB devem ser mascaradas na UI. Para produção, usar secrets manager.

---

## 📂 Estrutura sugerida

```
/frontend
  /app
    /dashboard
    /configuracoes
  /components
    /quadrantes
    /integrations
  /i18n
    /pt-BR
    /en
    /es

/backend
  /src
    /routes
    /services
      /integrations
      /llm (AdvisorService)
    /models
    /utils
  /tests

/docs
  PLANO_ENTREGA.md
  ARQUITETURA.md
  INTEGRACOES.md
  USUARIO.md
  SECURITY.md
```
