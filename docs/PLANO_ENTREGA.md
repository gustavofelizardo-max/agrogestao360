# Plano de Entrega — AgroTech (Agro Gestão 360)

Este documento define a sequência de tarefas (status inicial **TODO**) a partir do repositório existente.

---

## 🔑 Tarefas Iniciais
- [ ] **Inventário do repositório**
  - Ler a versão atual no GitHub.
  - Listar pastas/arquivos críticos (frontend, backend, configs, migrations, seeds, docker, etc.).
  - Produzir resumo em até 15 linhas.

- [ ] **Configuração do Banco de Dados (PostgreSQL)**
  - Confirmar conexão local com `agrotech` (user: `gustavo.felizardo`, senha: `F3liz2025`).
  - Configurar ORM (usar o que já existe; se não houver, preferir Prisma).
  - Ajustar `.env.example` com credenciais e placeholders.
  - Criar migrations para colunas JSONB `_i18n` e constraints.

- [ ] **Seeds iniciais**
  - Criar 3 fazendas (SP/soja, MT/milho, PR/cana).
  - Preencher todos os campos `_i18n` (pt-BR, en, es).
  - Mockar dados de clima/NDVI/solo/mercado.

---

## ⚙️ Configurações & Integrações
- [ ] **Modelo `integrations` no DB**
  - Campos: provider, type, active, credentials(JSON), order_preference, status, quota_info, name_i18n, description_i18n, updated_at.

- [ ] **Rotas backend (config)**
  - `GET /config/integrations`
  - `POST /config/integrations/test`

- [ ] **Tela `/configuracoes` (frontend)**
  - Formulário por integração, Toggle `ativo`, botão **Testar conexão**.
  - Exibir credenciais mascaradas e status/quota.

---

## 👥 Perfis & Segurança
- [ ] **RBAC**
  - Roles: `Admin`, `Fazendeiro`, `Gerente`, `Agrônomo`.
  - Guardas de rota no backend; esconder/mostrar quadrantes no frontend.
  - Proteger rotas `/config/*` apenas para Admin.

---

## 📊 Dashboard & Quadrantes
- [ ] **Dashboard base**
  - Grid 2×2 (quadrantes), paginação/scroll se >4.
  - Estados: loading, vazio, erro, integração inativa (CTA).
  - Componente `QuadranteCard`.

- [ ] **Quadrante inicial obrigatório**
  - **Clima por Fazenda (CEP + APIs climáticas)**.
  - Mock de resposta (chuva, temperatura, previsão).
  - Botão **Analisar com IA** (chama `/advisor/summary` mock).

- [ ] **Demais quadrantes (mock)**
  - Rentabilidade & Preço.
  - Operações & Insumos.
  - Vigor Vegetativo (NDVI).
  - Solo & Adubação.
  - Fitossanitário.
  - Logística & Escoamento.
  - Linha do Tempo da Safra.

---

## 🤖 AdvisorService (LLM)
- [ ] **Backend AdvisorService**
  - Endpoint: `POST /advisor/summary` com `{ role, farmId, menu, locale, context }`.
  - Selecionar provider ativo das Configurações. Responder mock inicialmente.

- [ ] **Frontend**
  - Botão “Analisar com IA” em cada quadrante → chama Advisor e renderiza resposta.

---

## 🎨 UI/UX
- [ ] **Paleta de cores**
  - Tons de palha, verdes, marrom acento. Tokens em Tailwind. Contraste AA.

- [ ] **Internacionalização (i18n)**
  - Configurar `next-intl` com namespaces.
  - Refatorar strings para JSON (pt-BR, en, es).
  - Implementar switch de idioma no header.

---

## 📑 Documentação
- [ ] **docs/ARQUITETURA.md**
  - Diagrama ASCII e fluxos.

- [ ] **docs/PLANO_ENTREGA.md**
  - Este checklist atualizado.

- [ ] **docs/INTEGRACOES.md**
  - APIs suportadas, credenciais e exemplos.

- [ ] **docs/USUARIO.md**
  - Manual por role e uso das integrações.

- [ ] **README.md**
  - Setup local (Mac + Postgres), docker-compose, migrations/seeds, como rodar front/back.

---

## ✅ Critérios de Aceite Globais
- [ ] Sistema roda local no Mac com Postgres (docker-compose opcional).
- [ ] Seeds aplicados e dashboard funcional com pelo menos 1 quadrante (Clima).
- [ ] RBAC ativo e rotas protegidas.
- [ ] i18n funcionando end-to-end (pt-BR, en, es).
- [ ] Configurações salvas e `Testar conexão` funcionando (mock/real).
- [ ] Documentação atualizada.
