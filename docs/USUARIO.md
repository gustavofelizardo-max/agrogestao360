# USUARIO.md — Perfis e Acesso

## Perfis
- **Admin**: gerencia usuários, RBAC e integrações; acesso completo, inclusive `/configuracoes`.
- **Fazendeiro**: visão macro (rentabilidade, clima, benchmark, timeline).
- **Gerente**: visão operacional (insumos, logística, timeline).
- **Agrônomo**: visão técnica (NDVI/NDWI, solo, fitossanitário, clima).

## Regras
- RBAC no backend decide o acesso às rotas.
- Frontend esconde/mostra quadrantes conforme role e integrações ativas.
- Todas as operações suportam CRDU (Create, Read, Delete, Update) com auditoria básica.

## WhatsApp
- O usuário (Admin) pode ativar a integração para receber alertas (clima, pragas, preços) e enviar comandos.
