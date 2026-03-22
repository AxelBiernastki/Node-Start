# Produto

## Visão geral

O projeto é uma **API backend para autenticação e gerenciamento de projetos e tarefas**.

Foi desenvolvido para praticar conceitos essenciais de backend, simulando funcionalidades comuns de sistemas reais.

## Objetivo

Centralizar operações básicas de um sistema com:

- cadastro de usuários
- login com autenticação segura
- recuperação de senha por e-mail
- criação e gerenciamento de projetos
- associação de tarefas a projetos

## Funcionalidades principais

### Usuários
- cadastro
- autenticação
- recuperação de senha
- redefinição de senha

### Projetos
- criação de projeto
- listagem de projetos
- busca por ID
- atualização
- exclusão

### Tarefas
- associação de tarefas a projetos
- definição de responsável
- controle de conclusão

## Fluxo principal

### 1. Cadastro
O usuário cria uma conta informando nome, e-mail e senha.

### 2. Login
O sistema valida as credenciais e retorna um token JWT.

### 3. Acesso autenticado
Com o token, o usuário acessa as rotas protegidas.

### 4. Gestão de projetos
O usuário cria projetos e pode associar tarefas a eles.

### 5. Recuperação de senha
Caso esqueça a senha, o usuário solicita um token por e-mail e redefine o acesso.

## Público-alvo

Este projeto foi construído com foco em:

- estudo de backend
- prática de API REST
- portfólio técnico
- evolução futura para um sistema mais completo

## Diferenciais

- autenticação com JWT
- senhas criptografadas com BCrypt
- recuperação de senha por e-mail
- relacionamento entre entidades no MongoDB
- documentação interativa com Swagger

## Regras do cenário atual

- rotas de projetos exigem autenticação
- senha não é retornada nas consultas padrão
- token de recuperação possui expiração
- tarefas podem ser vinculadas a usuários e projetos
