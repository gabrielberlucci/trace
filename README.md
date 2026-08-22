# Trace

Sistema de Gestão Empresarial (ERP) focado no fluxo operacional de varejo. O objetivo deste projeto é construir uma plataforma completa (Full-stack) e robusta para gerenciar com integridade a relação entre Clientes, Fornecedores, Produtos, Vendas e a Movimentação de Estoque.

> **Status:** Em produção e desenvolvimento ativo. O sistema já está rodando em ambiente real (operando diariamente por 1 empresa ativa, validando o fluxo operacional na prática). A API backend e o banco de dados já possuem uma fundação robusta com rotas core estabelecidas, enquanto a interface web (frontend) continua recebendo novas funcionalidades e refinamentos.

## Arquitetura (Monorepo)

O projeto está estruturado como um monorepo gerenciado com `pnpm workspaces`, contendo os seguintes pacotes principais:

- **`app/web`**: Frontend moderno e reativo.
- **`app/server`**: API back-end robusta, orientada a filas e tipada.
- **`app/shared`**: Código compartilhado entre Frontend e Backend (esquemas de validação, tipos, DTOs).

## Stack

### Backend (`server`)

- **Ecosistema:** Node.js, TypeScript, Express
- **Banco de Dados:** PostgreSQL
- **ORM & Modelagem:** Prisma ORM
- **Validação:** Zod
- **Filas e Background Jobs:** BullMQ e Redis (Processamento de NFe)
- **Parse & Validação de XML:** xmlDOM e xml-crypto
- **Logs e Observabilidade:** Pino (pino-http, pino-pretty) e exportação para o Axiom HQ
- **Documentação:** Swagger (OpenAPI)
- **Testes:** Vitest, Supertest

### Frontend (`web`)

- **Framework & UI:** React 19, Vite, Tailwind CSS v4
- **Componentes:** shadcn/ui, Radix UI, Lucide React
- **Roteamento & Estado:** TanStack Router, TanStack Query
- **Formulários & Validação:** React Hook Form, Zod
- **Gráficos:** Recharts

## Features e Arquitetura Core

- **Modelagem Relacional Completa:** Schemas robustos interligados para `Customer`, `Supplier`, `Product`, `Sale`, `StockMovement`, `Company`, `PaymentMethod` e controle de permissões de usuário.
- **Processamento Assíncrono de NFe (XML):** Upload, validação de assinatura e extração automática de dados de Notas Fiscais Eletrônicas via _Workers_ executados no BullMQ/Redis. Atualiza dados do emitente (Fornecedor), destinatário (Empresa) e o saldo de Produtos automaticamente, com fluxo organizado de arquivos `processed` e `error`.
- **Tipagem Estrita End-to-End:** O _workspace_ compartilhado (`shared`) provê os esquemas em Zod garantindo consistência total entre o payload enviado pelo frontend e o que o backend espera/valida.
- **Validação de Regras de Negócio:** _Refinements_ customizados no Zod para garantir integridade e validade de dados sensíveis (CPFs e CNPJs) baseados em algoritmos matemáticos reais antes de encostarem no banco.
- **Tratamento Global de Erros:** Captura unificada para infrações de _constraints_ do banco (como unicidade Prisma `P2002`) e erros de negócio disparados no serviço, convertidos adequadamente via middlewares.
- **Autenticação & Autorização (RBAC):** Controle de acesso rigoroso baseado em Roles e permissões, juntamente com proteção JWT e _rate-limiting_ integrado na API.
- **Logs Estruturados e Auditoria:** Rastreio de requisições, métricas e eventos internos complexos em _background_ usando integração nativa do Pino com serviços modernos de observabilidade (Axiom HQ).

## Roadmap de Desenvolvimento (To-Do)

### Backend (`server`)

- [x] Modelagem do Banco de Dados (Prisma Schema) completo
- [x] Configuração do Zod e validações estritas de documentos (CPF/CNPJ)
- [x] CRUD e testes de integração das rotas de Fornecedores, Produtos, Clientes, Usuários e Tipos de Pagamento
- [x] Implementação de Logs com Pino integrados com Axiom HQ
- [x] Implementação do módulo de Controle de Estoque (`StockMovement`) e Fluxo Transacional de Vendas (`Sale`, `SaleItem`)
- [x] Rotas de Upload e Processamento em _Background_ de arquivos XML (NFe) usando BullMQ/Redis
- [x] Autenticação, Autorização (Roles e Permissions) e Rate-Limiting
- [x] Implementação de rotas e fluxo completo de Ordens de Serviço (`ServiceOrder`)
- [ ] Integração de emissão (envio) de NFS-e e NFCe para a SEFAZ

### Frontend (`web`)

- [x] Setup do Vite, React, TailwindCSS v4 e Shadcn
- [x] Implementação de Telas e Dashboards (Dashboard, Clientes, Fornecedores, Produtos, Vendas, Usuários)
- [x] Integração com as rotas da API usando TanStack Query
- [x] Implementação do Sistema de Login e Controle de Acesso na UI
- [x] Interface para gerenciamento de Filas e Upload de NFes
- [x] Interface para gerenciamento e emissão de Ordens de Serviço

## Como rodar o projeto localmente

**Requisitos:** Node.js, pnpm, PostgreSQL e Redis.

**1. Clone o repositório:**

```bash
git clone https://github.com/gabrielberlucci/trace
cd trace
```

**2. Instale as dependências:**

O repositório usa `pnpm workspaces`. Instale todas as dependências a partir da raiz ou pasta `app`:

```bash
cd app
pnpm install
```

**3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` dentro da pasta `app/server` com as credenciais do seu PostgreSQL, Redis e configurações da API:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
PORT=3000
JWT_SECRET="supersecret"
NODE_ENV="development"
BASE_URL="http://localhost:3000"
LOG_LEVEL="debug"
FRONT_END_ORIGIN="http://localhost:5173"

# Configurações do Redis para o BullMQ (Fila de XML)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

# Tokens de serviço (Axiom para logs, etc)
# AXIOM_TOKEN="..."
```

**4. Execute as Migrations para montar o banco:**

```bash
cd app/server
npx prisma migrate dev && npx prisma generate
```

**5. Execute os setups iniciais do banco (Seed):**

Ainda dentro de `app/server`, execute o comando consolidado que aciona todos os seeds (tabelas totais, triggers, cidades, cargos e usuários):

```bash
pnpm run seed:all
```

_(Alternativamente, execute na ordem definida no pacote: `seed:total-table`, `seed:trigger`, `seed:city`, `seed:roles`, etc.)_

**6. Inicie em modo de desenvolvimento:**

Você precisará iniciar o servidor (com seu _worker_ atrelado) e a aplicação web.

Para o Backend:

```bash
cd app/server
pnpm dev
# (Para rodar o worker separadamente, caso queira testar as filas de XML: pnpm run worker:upload-xml)
```

Para o Frontend:

```bash
cd app/web
pnpm dev
```
