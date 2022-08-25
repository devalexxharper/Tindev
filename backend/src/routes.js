const express = require('express')
const Router = express.Router()
const devC = require('./controller/devC')
const likeController = require('./controller/likeC')
const unlikeController = require('./controller/unlikeC')




Router.get('/', (req, res) => {
  res.json({ message: `Hello ${req.query.name}` })
})

Router.get('/devs', devC.index)
Router.post('/devs', devC.store)
Router.post('/devs/:devId/likes', likeController.store)
Router.post('/devs/:devId/unlikes', unlikeController.store)


module.exports = Router