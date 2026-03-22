const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Start API',
      version: '1.0.0',
      description:
        'API REST para cadastro de usuários, autenticação com JWT, recuperação de senha por e-mail e gerenciamento de projetos e tarefas.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Axel Otto'
            },
            email: {
              type: 'string',
              example: 'axel.otto@bs.nttdata.com'
            },
            password: {
              type: 'string',
              example: '123456'
            }
          }
        },
        AuthenticateInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'axel.otto@bs.nttdata.com'
            },
            password: {
              type: 'string',
              example: '123456'
            }
          }
        },
        ForgotPasswordInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              example: 'axel.otto@bs.nttdata.com'
            }
          }
        },
        ResetPasswordInput: {
          type: 'object',
          required: ['email', 'token', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'axel.otto@bs.nttdata.com'
            },
            token: {
              type: 'string',
              example: 'abc123token'
            },
            password: {
              type: 'string',
              example: 'novaSenha123'
            }
          }
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'assignedTo'],
          properties: {
            title: {
              type: 'string',
              example: 'Criar autenticação JWT'
            },
            assignedTo: {
              type: 'string',
              example: '64f1f77bcf86cd7994390111'
            },
            completed: {
              type: 'boolean',
              example: false
            }
          }
        },
        ProjectInput: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
              example: 'Projeto API'
            },
            description: {
              type: 'string',
              example: 'Construção de uma API backend'
            },
            tasks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TaskInput'
              }
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              example: {
                _id: '64f1f77bcf86cd7994390111',
                name: 'Axel Otto',
                email: 'axel.otto@bs.nttdata.com',
                createdAt: '2026-03-22T10:00:00.000Z'
              }
            },
            token: {
              type: 'string',
              example: 'jwt.token.aqui'
            }
          }
        },
        ProjectResponse: {
          type: 'object',
          properties: {
            project: {
              type: 'object',
              example: {
                _id: '64f1f77bcf86cd7994390999',
                title: 'Projeto API',
                description: 'Construção de uma API backend'
              }
            }
          }
        },
        ProjectsResponse: {
          type: 'object',
          properties: {
            projects: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Project deleted successfully'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'User not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/app/controllers/*.js']
}

module.exports = swaggerJSDoc(options)