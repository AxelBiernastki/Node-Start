# Arquitetura

## Visão geral

O projeto segue uma **arquitetura em camadas**, com organização modular inspirada em **MVC para APIs REST**.

A separação principal acontece por responsabilidade:

- **controllers**: recebem e tratam as requisições HTTP
- **models**: definem as entidades e o acesso ao MongoDB com Mongoose
- **middlewares**: concentram regras reutilizáveis, como autenticação
- **config**: centraliza configurações externas
- **database**: inicializa a conexão com o banco
- **modules**: agrupa módulos auxiliares, como envio de e-mail
- **resources**: armazena templates utilizados pela aplicação

## Estrutura de pastas

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

## Stack técnica
 - **Node.js**: runtime da aplicação
 - **Express**: criação da API REST
 - **MongoDB Atlas**: banco de dados em nuvem
 - **Mongoose**: modelagem e persistência de dados
 - **JWT**: autenticação baseada em token
 - **BCryptJS**: hash de senhas
 - **Nodemailer**: envio de e-mails
 - **Mailtrap**: ambiente SMTP de teste
 - **Swagger / OpenAPI**: documentação interativa da API
 - **Dotenv**: carregamento de variáveis de ambiente

## Fluxo da aplicação

### Autenticação
 1. o usuário realiza cadastro
 2. a senha é criptografada antes de ser salva
 3. no login, a API valida as credenciais
 4. um token JWT é gerado e retornado
 5. esse token é usado nas rotas protegidas

### Recuperação de senha
 1. o usuário informa o e-mail
 2. a API gera um token temporário
 3. o token recebe prazo de expiração
 4. o sistema envia esse token por e-mail
 5. o usuário informa token e nova senha para redefinição

### Projetos e tarefas
 1. o usuário autenticado cria um projeto
 2. o projeto é associado ao usuário logado
 3. tarefas podem ser criadas junto com o projeto
 4. os relacionamentos são persistidos no MongoDB

## Modelagem

### User
 - name
 - email
 - password
 - passwordResetToken
 - passwordResetExpires
 - createdAt

### Project
 - title
 - description
 - user
 - tasks
 - createdAt

### Task
 - title
 - project
 - assignedTo
 - completed
 - createdAt

### Relacionamentos
 - um usuário pode ter vários projetos
 - um projeto pertence a um usuário
 - um projeto pode ter várias tarefas
 - uma tarefa pertence a um projeto
 - uma tarefa pode ser atribuída a um usuário

### Segurança aplicada
 - senhas armazenadas com hash via BCrypt
 - autenticação com JWT
 - proteção de rotas com middleware
 - uso de variáveis de ambiente para dados sensíveis
 - senha oculta nas consultas padrão do usuário
 - token temporário para redefinição de senha

### Limitações atuais
 - não possui camada de services
 - não possui testes automatizados
 - ainda não há validação robusta de entrada
 - não há controle de autorização por dono do projeto
 - o tratamento de erros ainda não está centralizado
