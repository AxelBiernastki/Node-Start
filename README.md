# Node Start API

API REST desenvolvida com **Node.js**, **Express** e **MongoDB** para estudo de fundamentos de backend.

## Principais funcionalidades

- cadastro de usuários
- autenticação com **JWT**
- hash de senha com **BCrypt**
- recuperação de senha por e-mail com **NodeMailer**
- CRUD de projetos
- relacionamento entre **usuários, projetos e tarefas**
- documentação interativa com **Swagger / OpenAPI**

## Tecnologias

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- BCryptJS
- Nodemailer
- Mailtrap
- Swagger / OpenAPI
- Dotenv

## Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/authenticate`
- `POST /auth/forgot_password`
- `POST /auth/reset_password`

### Projects
- `GET /projects`
- `GET /projects/:projectsId`
- `POST /projects`
- `PUT /projects/:projectsId`
- `DELETE /projects/:projectsId`

## Como executar

### 1. Clonar o repositório
```bash
git clone https://github.com/AxelBiernastki/Node-Start.git
cd Node-Start
 ```
### 2. Instalar as dependências
```bash
npm install
 ```

### 3. Criar o arquivo .env

 - Use o **.env.example** como base
   
    Criar conta no ***Mailtrap*** e no ***MongoDB Atlas*** para configurar suas variáveis

### 4. Executar a aplicação
```bash
npm run start
 ```

## Swagger

Com a aplicação rodando, acesse:

 - `http://localhost:3000/api-docs`

## Estrutura do projeto

```bash
Node-Start/ 
  ├── docs/                                 # Documentação complementar
  │   ├── arquitetura.md
  │   └── produto.md 
  │   src/
  │   ├── app/
  │   │   ├── controllers/
  │   │   │   ├── authController.js         # Rotas de autenticação e recuperação de senha
  │   │   │   ├── index.js                  # Carregamento automático dos controllers
  │   │   │   └── projectController.js      # Rotas de projetos e tarefas 
  │   │   ├── middlewares/
  │   │   │   └── auth.js                   # Middleware de validação do JWT
  │   │   ├── models/
  │   │   │   ├── project.js                # Model de projeto
  │   │   │   ├── task.js                   # Model de tarefa
  │   │   │   └── user.js                   # Model de usuário
  │   │   └── config/
  │   │       ├── auth.js                   # Configuração do JWT
  │   │       ├── mail.js                   # Configuração do serviço de e-mail
  │   │       └── swagger.js                # Configuração do Swagger / OpenAPI
  │   ├── database/
  │   │   └── index.js                      # Conexão com o MongoDB Atlas
  │   ├── modules/
  │   │   └── mailer.js                     # Transporte de e-mail com Nodemailer
  │   └── resources/
  │       └── mail/
  │          └── auth/
  │               └── forgot_password.html  # Template HTML do e-mail de recuperação
  │
  ├── index.js                              # Arquivo principal da aplicação
  ├── .env.example                          # Exemplo para variáveis de ambiente
  ├── .gitignore                            # Arquivos para não serem upados no git
  ├── package.json                          # Manifesto de configurações do projeto
  └── README.md                             # Visão geral do projeto
```
## Observações
- Banco de dados utilizado: MongoDB Atlas
- Serviço SMTP de teste: Mailtrap
- Rotas de projetos protegidas com Bearer Token
- Documentação disponível via Swagger
