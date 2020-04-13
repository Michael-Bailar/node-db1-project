const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/api/accounts', (req, res) => {
    db('*').from('accounts')   
    .then(accounts => {
        res.status(200).json({data: accounts})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error.message})
    })
})

server.get('/api/accounts/:id', (req, res) => {
    const id = req.params.id
    db('*').from('accounts')
    .where({ id })  
    .then(accounts => {
        res.status(200).json({data: accounts})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error.message})
    })
})

server.post('/api/accounts', (req, res) => {
    const accountData = req.body
    db('accounts').insert(accountData, 'id')
    .then(ids => {
        const id = ids[0]
        db('accounts')
        .where({ id })
        .first()
        .then(account => {
            res.status(200).json({data: account})
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error.message})
    })
})

server.put('/api/accounts/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    db('accounts')
    .where({ id })
    .update(changes)
    .then(count => {
        if (count > 0) {
            res.status(200).json({message: "update successful"})
        } else {
            res.status(404).json({message: "no accounts found with that id"})
        }
    })
})

server.delete('/api/accounts/:id', (req, res) => {
    const { id } = req.params
    db('accounts')
    .where({ id })
    .del()
    .then(count => {
        if (count > 0) {
            res.status(200).json({message: "delete successful"})
        } else {
            res.status(404).json({message: "not posts found with that id"})
        }
    })
})

module.exports = server;
