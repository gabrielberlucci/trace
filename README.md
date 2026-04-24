# Trace (WIP)

Sistema de Gestão Empresarial (ERP) focado no fluxo operacional de varejo. O objetivo deste projeto é construir uma API back-end robusta para gerenciar com integridade a relação entre Clientes, Fornecedores, Produtos, Vendas e a Movimentação de Estoque.

> **Status:** Em desenvolvimento ativo. O banco de dados já está modelado e as rotas core estão sendo implementadas.

## Stack Tecnológica

- **Ecosistema:** Node.js, TypeScript, Express
- **Banco de Dados:** PostgreSQL
- **ORM & Modelagem:** Prisma ORM
- **Validação:** Zod

## Features e Arquitetura Core

- **Modelagem Relacional:** Schemas interligados para `Customer`, `Supplier`, `Product`, `Sale` e `StockMovement`.
- **Tipagem Estrita de Domínio:** Utilização de `Enums` no nível do banco de dados para controle de Tipos de Pessoa (Física/Jurídica) e Unidades de Medida.
- **Validação de Regras de Negócio:** _Refinements_ customizados no Zod para garantir que dados sensíveis (como CPF e CNPJ) sigam padrões matemáticos reais antes de tocarem no banco.
- **Tratamento de Erros:** Captura direta de violações de _constraints_ de unicidade (ex: Prisma `P2002`) tratadas via middleware global.

## Roadmap de Desenvolvimento (To-Do)

- [x] Modelagem do Banco de Dados (Prisma Schema)
- [x] Configuração do Zod e validações de documentos (CPF/CNPJ)
- [x] CRUD e testes de integração das rotas de Fornecedores (com Vitest/Supertest)
- [x] Implementar logs com o PINE
- [x] CRUD e testes de integração das rotas de Produtos (com Vitest/Supertest)
- [ ] CRUD e testes de integração das rotas de Usuarios (com Vitest/Supertest)
- [ ] Implementação do módulo de Controle de Estoque (`StockMovement`)
- [ ] Construção do fluxo transacional de Vendas
- [ ] Autenticação e Rate-Limiting
- [ ] Autorização de usuário
- [ ] Enviar NFS-e e NFCe para a SEFAZ

## Como rodar o projeto localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/gabrielberlucci/trace
```

**2. Instale as dependências:**

```bash
cd app/server && pnpm install
cd app/web && pnpm install
```

**3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto com as credenciais do seu PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
PORT= 3000
```

**4. Execute as Migrations para montar o banco:**

```bash
npx prisma migrate dev
```

**5. Inicie o servidor em modo de desenvolvimento:**

```bash
cd app/server && pnpm run dev
```
