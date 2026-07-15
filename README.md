# Trace (WIP)

Sistema de Gestão Empresarial (ERP) focado no fluxo operacional de varejo. O objetivo deste projeto é construir uma plataforma completa (Full-stack) e robusta para gerenciar com integridade a relação entre Clientes, Fornecedores, Produtos, Vendas e a Movimentação de Estoque.

> **Status:** Em desenvolvimento ativo. O banco de dados já está modelado, a API backend possui rotas core estabelecidas, e a interface web (frontend) está em construção.

## Arquitetura (Monorepo)

O projeto está estruturado como um monorepo gerenciado com `pnpm workspaces`, contendo os seguintes pacotes principais:

- **`app/web`**: Frontend moderno e reativo.
- **`app/server`**: API back-end robusta e tipada.
- **`app/shared`**: Código compartilhado entre Frontend e Backend (esquemas de validação, tipos, DTOs).

## Stack

### Frontend (`web`)
- **Framework & UI:** React 19, Vite, Tailwind CSS v4
- **Componentes:** shadcn/ui, Radix UI, Lucide React
- **Roteamento & Estado:** TanStack Router, TanStack Query
- **Formulários & Validação:** React Hook Form, Zod
- **Gráficos:** Recharts

### Backend (`server`)
- **Ecosistema:** Node.js, TypeScript, Express
- **Banco de Dados:** PostgreSQL
- **ORM & Modelagem:** Prisma ORM
- **Validação:** Zod
- **Logs:** Pino (pino-http, pino-pretty)
- **Documentação:** Swagger (OpenAPI)
- **Testes:** Vitest, Supertest

## Features e Arquitetura Core

- **Modelagem Relacional:** Schemas interligados para `Customer`, `Supplier`, `Product`, `Sale` e `StockMovement`.
- **Tipagem Estrita End-to-End:** Compartilhamento de contratos (Zod e TypeScript) garantindo consistência entre o que o frontend envia e o que o backend valida.
- **Validação de Regras de Negócio:** _Refinements_ customizados no Zod para garantir que dados sensíveis (como CPF e CNPJ) sigam padrões matemáticos reais antes de tocarem no banco.
- **Tratamento de Erros Global:** Captura direta de violações de _constraints_ de unicidade (ex: Prisma `P2002`) e outros erros, tratados via middleware global.
- **Autenticação & Autorização:** Controle de acesso baseado em Roles (RBAC) e rate-limiting integrados.

## Roadmap de Desenvolvimento (To-Do)

### Backend (`server`)
- [x] Modelagem do Banco de Dados (Prisma Schema)
- [x] Configuração do Zod e validações de documentos (CPF/CNPJ)
- [x] CRUD e testes de integração das rotas de Fornecedores, Produtos, Usuários e Tipos de Pagamento
- [x] Implementar logs com o Pino
- [x] Implementação do módulo de Controle de Estoque (`StockMovement`) e Fluxo Transacional de Vendas
- [x] Autenticação, Autorização e Rate-Limiting
- [ ] Integração com serviços externos (Enviar NFS-e e NFCe para a SEFAZ)

### Frontend (`web`)
- [x] Setup do Vite, React, TailwindCSS v4 e Shadcn
- [x] Implementação de Telas e Dashboards (Dashboard, Clientes, Fornecedores, Produtos, Vendas, Usuários)
- [x] Integração com as rotas da API usando TanStack Query
- [x] Implementação do Sistema de Login e Controle de Acesso na UI

## Como rodar o projeto localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/gabrielberlucci/trace
cd trace
```

**2. Instale as dependências:**

O repositório usa `pnpm workspaces`. Instale todas as dependências dos pacotes a partir da pasta `app`:

```bash
cd app
pnpm install
```

**3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` dentro da pasta `app/server` com as credenciais do seu PostgreSQL e configurações da API:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
PORT=3000
JWT_SECRET="supersecret"
NODE_ENV="development"
BASE_URL="localhost:3000"
LOG_LEVEL="debug"
```

**4. Execute as Migrations para montar o banco:**

```bash
cd app/server
npx prisma migrate dev && npx prisma generate
```

**5. Execute os setups iniciais do banco (Seed):**

Ainda dentro de `app/server`, execute os comandos abaixo na ordem para popular os registros essenciais do sistema:

```bash
npx tsx ./prisma/setup.total.table.ts
npx tsx ./prisma/setup.trigger.ts
npx tsx ./prisma/populate.city.ts
npx tsx ./prisma/create.roles.ts
npx tsx ./prisma/populate.permissions.ts
npx tsx ./prisma/populate.role.permissions.ts
```

**6. Inicie em modo de desenvolvimento:**

Você pode iniciar o servidor e a aplicação web.

Para o Backend:
```bash
cd app/server
pnpm dev
```

Para o Frontend:
```bash
cd app/web
pnpm dev
```
