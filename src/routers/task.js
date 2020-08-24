const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// Create task - POST

router.post('/tasks', auth, async(req, res) => {

    // const task = new Task(req.body)
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})

// Read tasks - GET

router.get('/tasks', auth, async(req, res) => {

    try {
        await req.user.populate('tasks').execPopulate()


        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send()
    }
})


// Read task by id - GET

router.get('/tasks/:id', auth, async(req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update task by id - PATCH

router.patch('/tasks/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }

        updates.forEach((update) => task[update] = req.body[update])
        task.save()
        res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})

// Delete task by id- DELETE

router.delete('/tasks/:id', auth, async(req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router