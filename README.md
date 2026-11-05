# Trace

Sistema de gestão (ERP) voltado para comércio e prestação de serviços.

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-8.x-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Visão Geral

O **Trace** é uma plataforma de gestão empresarial desenvolvida para atender rotinas comerciais do dia a dia, como controle de vendas, estoque, emissão de ordens de serviço e conciliação de compras por meio de arquivos XML de NF-e.

O foco da aplicação é garantir integridade dos dados operacionais: cada movimentação de estoque é registrada em histórico auditável (Kardex), a importação de notas fiscais roda em segundo plano para não travar a API, e o frontend e o backend compartilham os mesmos contratos de validação via Zod.

---

## Módulos do Sistema

### Estoque e Kardex
- Registro auditável de movimentações (`VENDAS`, `SERVICO`, `PERDA`, `IMPORTACAO`, `AJUSTE_ENTRADA`, `AJUSTE_SAIDA`).
- Visualização de Kardex por produto, com saldo anterior, movimentação e saldo atual.
- Suporte a unidades de medida fracionadas e inteiras (`UN`, `CM`, `MT`, `MM`, `BALDE`, `LITRO`).
- Vínculo entre o código do produto no fornecedor e o produto interno (`SupplierProduct`).

### Processamento de NF-e (XML)
- Upload de arquivos XML com processamento assíncrono via filas (BullMQ e Redis).
- Validação de integridade e assinatura digital do XML (`xml-crypto`).
- Identificação de itens não cadastrados (`PendingProduct`), permitindo vincular produtos pendentes sem perder o lote da nota.
- Separação de status de arquivos em disco (`pending`, `processed`, `error`).

### Vendas e PDV
- Fluxo de caixa com suporte a múltiplos métodos de pagamento (`PIX`, `TEF`, `POS`, `CREDITO`, `DEBITO`, `OUTRO`).
- Aplicação de taxas de operação por método de pagamento.
- Baixa automática no estoque ao concluir a venda.

### Ordens de Serviço (OS)
- Controle de serviços prestados e peças utilizadas.
- Cálculo de horas trabalhadas e valor/hora técnico.
- Emissão e impressão de ordens de serviço formatadas em PDF (`@react-pdf/renderer`).

### Cadastros e Multi-empresa
- Cadastros com validação de CPF e CNPJ por algoritmo matemático.
- Estrutura para múltiplas empresas/filiais.
- Gestão de clientes, fornecedores e categorias de produtos.

### Segurança e Controle de Acesso (RBAC)
- Autenticação por JWT em cookies HTTP-Only.
- Permissões granulares associadas a perfis (`Role` e `Permission`).
- Proteção contra requisições abusivas com rate-limiting.

### Observabilidade
- Logs estruturados em formato JSON com Pino.
- Integração para envio de telemetria e logs em nuvem com Axiom HQ.
- Documentação interativa das rotas da API com Swagger UI (`/v1/docs`).

---

## Arquitetura (Monorepo)

O projeto utiliza `pnpm workspaces` dividido em três pacotes principais:

- **`app/server`**: API REST em Express 5, Prisma ORM, PostgreSQL e workers de fila em BullMQ.
- **`app/web`**: SPA construída com React 19, Vite, Tailwind CSS v4, TanStack Router e TanStack Query.
- **`app/shared`**: Schemas Zod, tipos TypeScript e constantes compartilhadas entre backend e frontend.

```mermaid
flowchart TD
    subgraph Client ["Frontend - app/web"]
        UI["React 19 + TanStack Router e Query"]
    end

    subgraph Backend ["Backend - app/server"]
        API["Express 5 REST API"]
        Shared["@app/shared - Schemas Zod e DTOs"]
        Worker["Worker BullMQ - Ingestao XML"]
    end

    subgraph Infra ["Banco de Dados e Filas"]
        DB[("PostgreSQL 18")]
        Redis[("Redis 8")]
    end

    subgraph Logs ["Observabilidade"]
        Axiom["Axiom HQ"]
    end

    UI --> API
    UI -.-> Shared
    API -.-> Shared
    API --> DB
    API --> Redis
    Worker --> Redis
    Worker --> DB
    API --> Axiom
    Worker --> Axiom
```

---

## Tecnologias Utilizadas

### Backend
- Node.js 24, TypeScript 5.9, Express 5
- PostgreSQL 18 e Prisma ORM 7
- BullMQ 5 e Redis 8
- Zod 4
- Pino e Axiom HQ
- Swagger UI (OpenAPI)
- Vitest e Supertest

### Frontend
- React 19 e Vite 7
- Tailwind CSS v4, shadcn/ui e Radix UI
- TanStack Router e TanStack Query
- TanStack Table e Recharts
- React Hook Form e Zod
- @react-pdf/renderer

---

## Como Rodar o Projeto

### Opção 1: Backend Completo via Docker (Recomendado)

Sobe PostgreSQL, Redis, API Express e Worker de processamento de XML em containers integrados, com hot-reload no código, migrações automáticas e compartilhamento da pasta `uploads-xml` entre API e Worker:

```bash
cd app

# Sobe PostgreSQL, Redis, API e Worker
docker compose -f docker-compose.dev.yml up

# Ou via atalho configurado no package.json:
# pnpm dev:docker
```

Em outro terminal, execute o frontend no host:

```bash
cd app/web
pnpm dev
```

Para rodar os seeds iniciais do banco dentro do container da API:

```bash
cd app
pnpm dev:docker:seed
# ou: docker compose -f docker-compose.dev.yml exec api pnpm --filter server run seed:all
```

---

### Opção 2: Execução Manual dos Serviços

#### 1. Instalar dependências

A partir da pasta `app`:

```bash
cd app
pnpm install
```

#### 2. Configurar variáveis de ambiente

Crie o arquivo `app/server/.env`:

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

#### 3. Executar migrations e seeds

```bash
cd app/server
npx prisma migrate dev && npx prisma generate
pnpm run seed:all
```

#### 4. Iniciar os serviços

Em terminais separados:

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

Os testes automatizados cobrem validação de documentos (CPF/CNPJ), regras de cadastro, movimentação de estoque e ordens de serviço:

```bash
cd app/server
pnpm test
```

---

## Licença

Projeto sob licença ISC.
