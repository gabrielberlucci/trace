# Trace

ERP para comércio e prestação de serviços — **em operação contínua** por empresa ativa do setor. Unifica ordens de serviço (antes emitidas manualmente em Word) e controle de estoque com rastro auditável, em substituição a um sistema legado que não cobria o fluxo de OS.

> Sistema real, não projeto de curso: roda diariamente no fluxo de vendas, estoque e ordens de serviço de uma empresa de comércio e serviços.

**Stack:** Node.js 24 · TypeScript · Express 5 · PostgreSQL 18 · Prisma 7 · Redis 8 · BullMQ 5 · React 19 · Docker

---

## O problema que o Trace resolve

A empresa operava com dois fluxos desconectados:

- **Sistema legado** — cobria cadastro e estoque parcial, mas não tinha módulo de ordens de serviço.
- **Word** — as ordens de serviço eram redigidas manualmente, sem vínculo com estoque, peças ou histórico de cliente.

O Trace unifica esse fluxo: OS com cálculo de horas técnicas, peças e taxas, conciliação automática de estoque via Kardex e histórico auditável por cliente. A operação de vendas e PDV também foi centralizada, com baixa automática de estoque e suporte a múltiplos métodos de pagamento.

**Migração em andamento:** os dados de produtos do sistema legado estão sendo migrados via inventário manual, com o sistema antigo mantido em paralelo até a conclusão — decisão deliberada para evitar perda de dados em produção. O Trace já opera o fluxo novo (OS, vendas, Kardex) enquanto a base de produtos é reconciliada.

---

## Screenshots

### Dashboard Operacional
Visão consolidada com métricas de vendas, ordens de serviço e produtos com estoque crítico.

![Dashboard Operacional](docs/screenshots/dashboard.png)

### Trilha de Auditoria de Estoque (Kardex)
Histórico cronológico de movimentações com saldo acumulado por SKU, tipo de operação e código de venda/importação.

![Kardex - Auditoria de Estoque](docs/screenshots/kardex.png)

### Gestão de Ordens de Serviço (OS)
Controle e histórico de atendimentos e serviços técnicos prestados.

![Ordens de Serviço](docs/screenshots/service-orders.gif)

---

## Arquitetura (Monorepo)

O projeto utiliza `pnpm workspaces` dividido em três pacotes principais:

- **`app/server`**: API REST em Express 5, Prisma ORM, PostgreSQL e workers de fila em BullMQ.
- **`app/web`**: SPA construída com React 19, Vite, Tailwind CSS v4, TanStack Router e TanStack Query.
- **`app/shared`**: Schemas Zod, tipos TypeScript e constantes compartilhadas entre backend e frontend.

```mermaid
flowchart TD
    subgraph Front ["Frontend - app/web"]
        React["React 19 + TanStack Router/Query"]
    end

    subgraph Shared ["Contratos Compartilhados"]
        SharedPkg["@app/shared<br/>(Schemas Zod, DTOs, Types)"]
    end

    subgraph Back ["Backend - app/server"]
        API["Express 5 REST API"]
        Worker["Worker BullMQ<br/>(Ingestão XML)"]
    end

    subgraph Data ["Persistência e Filas"]
        Redis[("Redis 8")]
        PG[("PostgreSQL 18")]
    end

    subgraph Obs ["Observabilidade"]
        Axiom["Axiom HQ"]
    end

    %% Conexões Front/Back
    React -->|"HTTP REST"| API
    React -.->|"Import (pnpm workspace)"| SharedPkg
    API -.->|"Import (pnpm workspace)"| SharedPkg
    Worker -.->|"Import (pnpm workspace)"| SharedPkg

    %% Fluxo de Filas e Banco
    API -->|"Enfileira upload"| Redis
    Redis -->|"Consome job"| Worker
    API -->|"SQL (Prisma)"| PG
    Worker -->|"SQL (Prisma)"| PG

    %% Observabilidade
    API -->|"Logs JSON"| Axiom
    Worker -->|"Logs JSON"| Axiom
```

---

## Decisões de engenharia

As escolhas que mais impactaram o sistema — e o porquê de cada uma:

- **Worker desacoplado (BullMQ + Redis) para importação de NF-e** — a API tem o papel de receber a requisição, não de processar arquivos pesados. A leitura de um XML com centenas de itens, validação de regras e checagem de assinatura criptográfica bloqueariam o Event Loop do Node.js, derrubando a disponibilidade da API para o resto do sistema. O worker em background processa a fila de forma isolada, permitindo retry em caso de falha sem impactar a operação de vendas e PDV. O estado de cada arquivo é persistido em disco (`pending`, `processed`, `error`), tornando o processamento observável sem consultar o banco.
- **Validação criptográfica de integridade de NF-e (`xml-crypto`)** — o XML não é tratado apenas como texto estruturado. O parser extrai o certificado `X509Certificate` e valida a assinatura digital da tag `<Signature>` contra a canonicalização da NF-e antes da persistência. Isso blinda a entrada de estoque contra arquivos adulterados manualmente, documentos fiscais não assinados ou sem autorização da SEFAZ.
- **Fila PendingProduct para itens não catalogados** — uma NF-e com item desconhecido não pode ser descartada. O lote fica retido até o vínculo entre código do fornecedor e SKU interno (`SupplierProduct`) ser resolvido. Prioridade explícita: não perder dados.
- **Kardex com saldo anterior + movimentação + saldo resultante** — toda alteração de estoque é auditável, incluindo unidades fracionadas (`UN`, `CM`, `MT`, `MM`, `BALDE`, `LITRO`). Base para reconciliação e detecção de divergência entre estoque físico e sistêmico.
- **Contagem de paginação via Triggers (`TotalCount`) em vez de `COUNT(*)`** — no PostgreSQL, o `SELECT COUNT(*)` exige varredura sequencial completa (devido ao MVCC), tornando-se um gargalo severo em tabelas de vendas e movimentações à medida que o volume cresce. A tabela `TotalCount` sincronizada via triggers automáticos (`AFTER INSERT`, `DELETE`, `TRUNCATE`) transforma o cálculo do total de registros para paginação em uma consulta $O(1)$ de leitura instantânea.
- **Renderização de PDF no Client-Side (`@react-pdf/renderer`)** — gerar ordens de serviço no backend via headless browser (como Puppeteer ou Chromium) consome centenas de megabytes de RAM por requisição e pode derrubar a API sob concorrência. Ao transferir a montagem do documento para o navegador a partir de payloads JSON leves da API, o servidor mantém consumo mínimo de recursos e o usuário obtém preview e impressão imediatos.
- **Lock pessimista (`SELECT FOR UPDATE`) e atomicidade transacional (`$transaction`)** — em operações críticas de concorrência como baixa de estoque na venda e ajuste manual de inventário, o sistema bloqueia as linhas do produto no PostgreSQL (`FOR UPDATE`) dentro de transações ACID isoladas. Isso previne race conditions e divergência de saldo quando múltiplos caixas operam em paralelo. Se qualquer etapa falhar (divergência de estoque ou erro de pagamento), o rollback é total, evitando estados parciais e estoque fantasma.
- **Zod compartilhado via monorepo** — o mesmo schema valida no front e no back; contrato único elimina divergência de payload entre camadas e reduz duplicação de regra de validação.
- **JWT em cookies HTTP-Only + RBAC granular** — escolha deliberada para mitigar ataques de XSS: o token não fica exposto ao `localStorage` nem pode ser lido por JavaScript via `document.cookie`. O controle de acesso é feito por Role e Permission, em vez de checagens ad-hoc por rota. Rate-limiting atua como camada extra de proteção contra abusos.
- **Logs estruturados (Pino → Axiom)** — JSON com contexto, enviado para nuvem. Permite rastrear incidente por request sem grep em arquivo local.

---

## Módulos do Sistema

- **Estoque e Kardex** — trilha auditável de movimentações (venda, serviço, perda, importação, ajustes); saldo anterior → movimentação → saldo atual; suporte a unidades inteiras e fracionadas.
- **Processamento de NF-e (XML)** — upload com processamento assíncrono, validação de assinatura digital (`xml-crypto`), tratamento de itens pendentes sem perda de lote e separação de status de arquivos em disco (`pending`, `processed`, `error`), tornando o processamento observável.
- **Vendas e PDV** — múltiplos métodos de pagamento (`PIX`, `TEF`, `POS`, crédito, débito, outro) com taxa por operação; baixa automática de estoque ao concluir venda.
- **Ordens de Serviço** — horas técnicas + peças + taxas; exportação e impressão em PDF (`@react-pdf/renderer`).
- **Cadastros e Multi-empresa** — validação matemática de CPF/CNPJ; clientes, fornecedores, categorias e produtos; estrutura de dados preparada para múltiplas empresas/filiais.
- **Segurança** — JWT em cookie HTTP-Only, RBAC por Role/Permission, rate-limiting.
- **Observabilidade** — logs estruturados (Pino → Axiom); documentação interativa em `/v1/docs` (Swagger/OpenAPI).

---

## Como Rodar o Projeto

### Opção 1: Backend Completo via Docker (Recomendado)

Sobe PostgreSQL, Redis, API e Worker em containers integrados, com hot-reload, migrações automáticas e compartilhamento da pasta `uploads-xml` entre API e Worker:

```bash
cd app

# Sobe PostgreSQL, Redis, API e Worker
docker compose -f docker-compose.dev.yml up

# Ou via atalho no package.json:
# pnpm dev:docker
```

Em outro terminal, rode o frontend no host:

```bash
cd app/web
pnpm dev
```

Para rodar os seeds iniciais dentro do container da API:

```bash
cd app
pnpm dev:docker:seed
# ou: docker compose -f docker-compose.dev.yml exec api pnpm --filter server run seed:all
```

Para rodar migrações sob demanda no container:

```bash
cd app
pnpm dev:docker:migrate
```

---

### Opção 2: Execução Manual dos Serviços

#### 1. Instalar dependências (a partir de `app/`):

```bash
cd app
pnpm install
```

#### 2. Configurar variáveis de ambiente — crie `app/server/.env`:

```env
DATABASE_URL="postgresql://trace:password@localhost:5432/trace?schema=public"
PORT=3000
NODE_ENV="development"
BASE_URL="http://localhost:3000"
FRONT_END_ORIGIN="http://localhost:5173"
JWT_SECRET="sua-chave-secreta-jwt"

# Logs
LOG_LEVEL="debug"
# AXIOM_TOKEN=""
# AXIOM_DATASET="trace"

# Filas (BullMQ)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
```

#### 3. Executar migrations e seeds:

```bash
cd app/server
npx prisma migrate dev && npx prisma generate
pnpm run seed:all
```

#### 4. Iniciar os serviços (em terminais separados):

```bash
# Terminal 1: Backend
cd app/server
pnpm dev

# Terminal 2: Worker de processamento de XML
cd app/server
pnpm run worker:upload-xml

# Terminal 3: Frontend
cd app/web
pnpm dev
```

URLs de acesso:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/v1/docs

---

## Testes

Os testes automatizados cobrem validação de documentos (CPF/CNPJ), regras de cadastro, movimentação de estoque e ordens de serviço.

Stack: **Vitest + Supertest**, com foco em testes de integração dos fluxos críticos.

```bash
cd app/server
pnpm test
```

---

## Limitações conhecidas / Próximos passos

- **JWT Stateless:** a autenticação atual não possui mecanismo de revogação de token em tempo real (blacklist ou refresh token rotation). Se um token vazar, ele é válido até expirar. É um trade-off conhecido do modelo stateless, e a inclusão de refresh tokens com rotação está no radar.
- **Multi-empresa em evolução:** a estrutura de dados prevê múltiplas empresas/filiais, mas o isolamento completo de dados por filial (multi-tenant real) ainda não está implementado. Hoje o sistema opera com uma empresa ativa.
- **Migração de produtos do sistema legado em andamento:** inventário manual, com sistema antigo em paralelo até conclusão.
- **Sem testes E2E de frontend:** cobertura atual focada em integração de backend.
- **Sem CI/CD configurado:** deploy manual via Docker Compose.

---

## Licença

Projeto sob licença ISC.
