# SECURITY.md — Diretrizes de Segurança

- Nunca comitar `.env` com segredos reais em repositório público.
- Em produção, usar **secrets manager** (AWS Secrets Manager, GCP Secret Manager, etc.).
- Armazenar credenciais criptografadas no DB; mascarar na UI.
- Habilitar HTTPS/TLS nos endpoints públicos.
- Aplicar rate-limits a rotas que chamam provedores externos.
- Auditar alterações em integrações (quem ativou/desativou, quando).
