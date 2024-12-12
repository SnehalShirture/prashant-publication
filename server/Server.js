import express from 'express'

let Server = express()

Server.get('/', (req, res) => {
    res.send("Hi...from Server")
})

Server.listen(5000, () => {
    console.log("Server Started...");
})