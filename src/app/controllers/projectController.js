const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

router.use(authMiddleware)

/**
 * @openapi
 * /projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Lista todos os projetos
 *     description: Retorna todos os projetos com usuário e tarefas populados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectsResponse'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Erro ao buscar projetos
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate(['user', 'tasks'])

    return res.send({ projects })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Error fetching projects' })
  }
})

/**
 * @openapi
 * /projects/{projectsId}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Busca um projeto por ID
 *     description: Retorna um projeto específico com usuário e tarefas populados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectsId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     responses:
 *       200:
 *         description: Projeto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Erro ao buscar projeto
 */
router.get('/:projectsId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectsId).populate(['user', 'tasks'])

    return res.send({ project })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Error fetching project' })
  }
})

/**
 * @openapi
 * /projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Cria um novo projeto
 *     description: Cria um projeto associado ao usuário autenticado e registra suas tarefas.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Projeto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Erro ao criar projeto
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, tasks } = req.body

    const project = await Project.create({
      title,
      description,
      user: req.userId
    })

    await Promise.all((tasks || []).map(async task => {
      const projectTask = new Task({
        ...task,
        project: project._id
      })

      await projectTask.save()
      project.tasks.push(projectTask)
    }))

    await project.save()

    return res.send({ project })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Error creating new project' })
  }
})

/**
 * @openapi
 * /projects/{projectsId}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Atualiza um projeto existente
 *     description: Atualiza título, descrição e recria a lista de tarefas do projeto.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectsId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       404:
 *         description: Projeto não encontrado
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Erro ao atualizar projeto
 */
router.put('/:projectsId', async (req, res) => {
  try {
    const { title, description, tasks } = req.body

    const project = await Project.findByIdAndUpdate(
      req.params.projectsId,
      {
        title,
        description
      },
      { returnDocument: 'after' }
    )

    if (!project) {
      return res.status(404).send({ error: 'Project not found' })
    }

    project.tasks = []
    await Task.deleteMany({ project: project._id })

    await Promise.all((tasks || []).map(async task => {
      const projectTask = new Task({
        ...task,
        project: project._id
      })

      await projectTask.save()
      project.tasks.push(projectTask)
    }))

    await project.save()

    return res.send({ project })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Error updating project' })
  }
})

/**
 * @openapi
 * /projects/{projectsId}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Remove um projeto
 *     description: Exclui um projeto pelo ID informado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectsId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do projeto
 *     responses:
 *       200:
 *         description: Projeto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Erro ao deletar projeto
 */
router.delete('/:projectsId', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectsId)

    return res.send({ message: 'Project deleted successfully' })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Error deleting project' })
  }
})

module.exports = app => app.use('/projects', router)