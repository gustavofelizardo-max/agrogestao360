# INTEGRACOES.md — APIs & LLMs

Listagem resumida das integrações suportadas. Cada integração é configurável em `/configuracoes` com `ativo`, credenciais (mascaradas) e Teste de Conexão.

## Clima
- **INMET**: token (público/cadastro). Previsão/estações. Uso: risco geada, vento, chuva.
- **CPTEC/INPE**: chave pública. Previsões regionais.
- **OpenWeather**: `OPENWEATHER_API_KEY`. Planos pagos com limites maiores.
- **NASA POWER**: base histórica (sem chave), radiação/vento/temperatura.

## Geocodificação/Localidades
- **ViaCEP**: sem chave, CEP → logradouro/município/UF.
- **IBGE Localidades/OGC**: malhas municipais/UF, WMS/WFS.

## Satélite/Índices
- **Sentinel Hub**: `SENTINELHUB_CLIENT_ID`/`_SECRET`, `INSTANCE_ID`. Process API para NDVI/NDWI.

## Solo
- **ISRIC SoilGrids**: REST público (sem chave).

## Mercado/Preços
- **CONAB**: séries e preços. (chaves/limites variam conforme endpoint).
- **CEPEA**: consultar modelo de acesso (pode exigir licença).
- **FAOSTAT**: macro global (sem chave).

## Fitossanitário
- **AGROFIT (MAPA)**: registros/labels de defensivos (endpoints/portais).

## LLMs
- **OpenAI (GPT-4.x/4o mini)** — `OPENAI_API_KEY`
- **Anthropic (Claude 3.5)** — `ANTHROPIC_API_KEY`
- **Google (Gemini 1.5)** — `GOOGLE_API_KEY`
- **Groq/self-host (Llama/Mixtral)** — `GROQ_API_KEY` ou endpoint próprio

## WhatsApp
- **Meta WhatsApp Cloud API** — `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_BUSINESS_ID`

### Observações
- Usuário pode inserir suas próprias credenciais para planos pagos.
- UI deve mascarar credenciais e permitir **Teste de Conexão** e exibir `quota` quando disponível.
