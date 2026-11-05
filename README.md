# Trace — Enterprise Retail & Operations Platform

<div align="center">

![Trace ERP Banner](https://img.shields.io/badge/TRACE-ENTERPRISE%20ERP-2563eb?style=for-the-badge&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-8.x-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.x-FF6B6B?style=flat-square)](https://bullmq.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

<p align="center">
  <b>Plataforma Full-Stack de Gestão Empresarial (ERP) e Operações Comerciais de Alta Performance.</b>
  <br />
  Projetada para escalabilidade, integridade transacional rigorosa, controle de estoque em tempo real (Kardex) e processamento assíncrono de documentos fiscais (NF-e).
</p>

</div>

---

## ⚡ Status & Visão Geral

> **Status:** 🚀 **Production-Ready & Active Evolution**  
> Arquitetura modular operando em ambiente de produção com validação diária de fluxos transacionais, processamento contínuo de dados fiscais e auditoria contábil de estoque. O backend conta com fundação orientada a eventos e filas distribuídas, enquanto a interface web oferece um design system reativo de alto padrão.

O **Trace** é um ERP contemporâneo construído sob medida para o varejo e empresas prestadoras de serviço que demandam confiabilidade operacional, segurança em conformidade fiscal e automação de fluxos críticos de suprimentos e vendas.

---

## 🏛️ Arquitetura do Sistema

O projeto é estruturado como um **Monorepo modular** utilizando **pnpm workspaces**, assegurando isolamento de responsabilidades e compartilhamento rigoroso de contratos e regras de validação ponta a ponta:

```
trace/
├── app/
│   ├── server/       # API RESTful, Background Workers & Engine de Dados
│   ├── web/          # Single Page Application (React 19 + Vite)
│   ├── shared/       # Schemas Zod, DTOs, Contratos e Enums compartilhados
│   ├── Dockerfile    # Build multi-stage para produção
│   └── docker-compose.yml # Orquestração completa de containers
└── README.md
```

### Diagrama de Fluxo e Componentes

```mermaid
flowchart TD
    subgraph Client ["Client Tier"]
        UI["React 19 SPA (TanStack Router & Query)"]
    end

    subgraph Backend ["Application Tier (Node.js / Express)"]
        API["REST API Core (Express 5 + Zod)"]
        Shared["@app/shared (Validation Schemas & DTOs)"]
        Worker["BullMQ Ingestion Worker (Processamento de NF-e)"]
    end

    subgraph Persistence ["Data & Queue Tier"]
        DB[("PostgreSQL 18 (Prisma ORM)")]
        Redis[("Redis 8 (Message Broker & Cache)")]
    end

    subgraph Observability ["Observability Tier"]
        Axiom["Axiom HQ (Structured Telemetry & Logs)"]
    end

    UI -->|HTTP / REST (JSON)| API
    UI -.->|Tipagem estrita| Shared
    API -.->|Tipagem estrita| Shared
    API -->|Consultas e Mutações| DB
    API -->|Enfileira Jobs XML| Redis
    Worker -->|Consome Jobs| Redis
    Worker -->|Atualiza Catálogo e Estoque| DB
    API & Worker -->|Pino Streams| Axiom
```

---

## 🚀 Capacidades e Módulos Principais

### 📦 Controle de Estoque & Auditoria Kardex
- **Movimentações Multidimensionais:** Suporte a movimentações transacionais tipadas (`VENDAS`, `SERVICO`, `PERDA`, `IMPORTACAO`, `AJUSTE_ENTRADA`, `AJUSTE_SAIDA`).
- **Ledger Kardex:** Histórico contábil e auditoria imutável por SKU, data, usuário e motivo operacional.
- **Unidades Flexíveis:** Tratamento de unidades inteiras e fracionadas (`UN`, `CM`, `MT`, `MM`, `BALDE`, `LITRO`) com validações estritas de precisão decimal.
- **Vínculo com Fornecedores:** Mapeamento de múltiplos códigos de fornecedor para um produto interno (`SupplierProduct`) com **fator de conversão automático de embalagem**.

### ⚡ Motor Assíncrono de Ingestão de NF-e (XML)
- **Pipeline em Segundo Plano:** Processamento não bloqueante de arquivos XML via filas BullMQ e Redis.
- **Validação Criptográfica:** Verificação de assinaturas digitais de documentos fiscais com `xml-crypto`.
- **Tratamento Inteligente de Pendências:** Identificação e isolamento de produtos não cadastrados (`PendingProduct`), permitindo associação e conciliação assistida sem travar o processamento da nota.
- **Ciclo de Vida de Arquivos:** Segregação controlada de diretórios (`pending`, `processed`, `error`).

### 💳 Frente de Caixa & Ponto de Venda (PDV)
- **Checkout Transacional:** Registro atômico de vendas, associação de múltiplos itens e baixa automática em estoque.
- **Meios de Pagamento:** Suporte a `PIX`, `TEF`, `POS`, `CREDITO`, `DEBITO` e `OUTRO`, com cálculo parametrizável de taxas operacionais.
- **Associação de Clientes & Empresas:** Rastreabilidade entre consumidor final e empresa emitente.

### 🛠️ Gestão de Ordens de Serviço (OS)
- **Fluxo de Oficina e Serviços:** Acompanhamento de serviços técnicos com taxa horária (`hourlyRate`), cálculo de horas fracionadas e peças consumidas.
- **Emissão de Relatórios em PDF:** Geração dinâmica e estilizada de relatórios em alta resolução utilizando `@react-pdf/renderer`.

### 🛡️ Segurança Corporativa & RBAC
- **Controle de Acesso Granular:** Matriz de papéis (`Role`) e permissões (`Permission`) com autorização baseada em níveis de privilégio.
- **Proteção de Sessão:** Autenticação via JSON Web Tokens (JWT) seguros via cookies HTTP-Only e mitigação de brute-force via _rate-limiting_.
- **Validação de Documentos Oficiais:** Validação matemática real para algoritmos de cálculo de dígitos verificadores de CPF e CNPJ antes da persistência.

### 📊 Business Intelligence & Observabilidade
- **Dashboards Gerenciais:** Visão consolidada de KPIs operacionais, volume de vendas e desempenho de estoque com gráficos reativos em Recharts.
- **Telemetria Estruturada:** Logs estruturados em formato JSON com Pino e streaming em tempo real para nuvem via **Axiom HQ**.
- **Documentação de API Nativa:** Especificação OpenAPI 3.0 / Swagger UI interativo disponível em `/v1/docs`.

---

## 🛠️ Stack Tecnológica

### Backend (`app/server`)
- **Runtime & Framework:** Node.js (v24), TypeScript (v5.9), Express 5
- **Banco de Dados & ORM:** PostgreSQL 18, Prisma ORM 7 (`@prisma/adapter-pg`)
- **Filas & Mensageria:** BullMQ 5, Redis 8
- **Validação & Schemas:** Zod 4
- **Segurança & Criptografia:** bcrypt, jsonwebtoken, xml-crypto
- **Processamento de XML:** fast-xml-parser, fast-xml-validator, @xmldom/xmldom
- **Logs & Observabilidade:** Pino, pino-http, Axiom HQ (`@axiomhq/pino`)
- **Documentação:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Testes:** Vitest, Supertest

### Frontend (`app/web`)
- **Core & Build:** React 19, Vite 7, TypeScript 5.9
- **Design System & Estilização:** Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React
- **Roteamento & Estado Server-Side:** TanStack Router, TanStack Query
- **Tabelas & Gráficos:** TanStack Table, Recharts
- **Formulários:** React Hook Form, Zod, Hookform Resolvers
- **Documentos & Impressão:** @react-pdf/renderer
- **Isolamento de Componentes:** React Cosmos

### Pacote Compartilhado (`app/shared`)
- **Contratos & Tipagem:** Schemas de validação Zod, tipos de domínio e constantes compartilhadas entre cliente e servidor, eliminando divergências de contrato.

---

## 🚦 Primeiros Passos

### Pré-requisitos
- [Node.js](https://nodejs.org/) `>= 22` (Recomendado v24+)
- [pnpm](https://pnpm.io/) `>= 10`
- [PostgreSQL](https://www.postgresql.org/) `>= 16` (ou Docker)
- [Redis](https://redis.io/) `>= 7` (ou Docker)

---

### Opção 1: Execução com Docker (Ambiente Integrado)

O projeto inclui configuração de containers para banco de dados, broker de mensagens, API e Worker de background:

```bash
# Clone o repositório
git clone https://github.com/gabrielberlucci/trace.git
cd trace/app

# Suba os serviços (PostgreSQL, Redis, API e Background Worker)
docker compose up -d
```

---

### Opção 2: Desenvolvimento Local Passo a Passo

#### 1. Instalação das Dependências

A partir do diretório raiz do monorepo (`trace/app`):

```bash
cd app
pnpm install
```

#### 2. Configuração de Ambiente

Crie o arquivo `.env` em `app/server/.env`:

```env
# Banco de Dados e Aplicação
DATABASE_URL="postgresql://trace:password@localhost:5432/trace?schema=public"
PORT=3000
NODE_ENV="development"
BASE_URL="http://localhost:3000"
FRONT_END_ORIGIN="http://localhost:5173"
JWT_SECRET="sua-chave-secreta-jwt-super-segura"

# Configuração de Logs
LOG_LEVEL="debug"
# AXIOM_TOKEN="seu-token-axiom"
# AXIOM_DATASET="trace"

# Fila e Mensageria (BullMQ / Redis)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
```

#### 3. Migrations e Seeds Estruturados

Execute as migrações do banco de dados e acione os seeds automatizados (cidades IBGE, papéis RBAC, permissões, usuários administrativos e triggers de auditoria):

```bash
cd app/server

# Executa as migrations do Prisma
npx prisma migrate dev && npx prisma generate

# Popula o banco com seeds estruturados
pnpm run seed:all
```

#### 4. Inicialização dos Serviços

Abra terminais dedicados para cada componente:

```bash
# Terminal 1: Backend API (Express)
cd app/server
pnpm dev

# Terminal 2: Worker de NF-e (BullMQ)
cd app/server
pnpm run worker:upload-xml

# Terminal 3: Frontend (React 19 / Vite)
cd app/web
pnpm dev
```

Acesse as aplicações em seu navegador:
- **Interface Web:** [http://localhost:5173](http://localhost:5173)
- **API REST:** [http://localhost:3000](http://localhost:3000)
- **Documentação Swagger UI:** [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs)

---

## 🧪 Testes Automatizados

O projeto utiliza **Vitest** para testes unitários de regras de negócio críticas e testes de integração de rotas e serviços:

```bash
cd app/server

# Executar suite completa de testes
pnpm test
```

A suíte abrange:
- Validação matemática de algoritmos de CPF e CNPJ
- Regras de integridade transacional de clientes e fornecedores
- Fluxo de cálculo e transações de Ordens de Serviço
- Ajustes atômicos e conciliação de estoque (`StockMovement`)

---

## 📜 Licença

Distribuído sob a licença **ISC**. Consulte o arquivo de licença para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido com foco em alta performance e escalabilidade por <a href="https://github.com/gabrielberlucci">Gabriel Berlucci</a>.</sub>
</div>
