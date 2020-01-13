const express = require('express');
const Hubs = require('./data/db')

const server = express();
server.use(express.json())

server.get('/', function (request, response) {
    response.send({ hello: 'Web 25!' });
});

server.get('/api/users', (req, res) => {
    Hubs.find()
        .then(hub => {
            res.status(200).json(hub)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error getting the hub list.'
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    Hubs.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    errorMessage: 'user not found'
                })
            }
            res.status(200).json(user)
        })
        .catch(error => {

            res.status(500).json({
                errorMessage: 'failed to find user'
            })

        })
})

server.post('/api/users', (req, res) => {
    const userData = req.body

    if (!userData.name || !userData.bio) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    } else {
        Hubs.insert(userData)
            .then(id => {
                res.status(201).json(id)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    errorMessage: 'sorry, we ran into an error getting the hub list.'
                })
            })
    }
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const userData = req.body
    Hubs.update(id, userData)
        .then((data) => {
            if (!data) {
                res.status(404).json({
                    errorMessage: 'user not found'
                })
            }
            if (!userData.name && !userData.bio) {
                res.status(400).json({
                    errorMessage: 'provide name or bio field'
                })
            }
            res.status(200).json(data)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                errorMessage: 'failed'
            })
        })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id

    Hubs.remove(id)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    errorMessage: 'user not found'
                })
            }
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                errorMessage: 'request failed'
            })
        })
})

const port = 8003;

server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));
