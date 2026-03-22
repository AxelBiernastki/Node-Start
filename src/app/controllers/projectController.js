const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks'])

        return res.send({ projects })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Error fetching projects' })
    }
});

router.get('/:projectsId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectsId).populate(['user', 'tasks'])

        return res.send({ project })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Error fetching project' })
    }
})

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

router.put('/:projectsId', async (req, res) => {
    try {
    const { title, description, tasks } = req.body

    const project = await Project.findByIdAndUpdate(req.params.projectsId, {
      title,
      description
    }, { returnDocument: 'after' })

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