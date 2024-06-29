import express, { Express, Request, Response } from 'express';

const app = express()
const port = 8080


// import UserReader from "./interactor/userInteractor/userReader"
import UserReader from './interactor/userInteractor/userReader.js';
// respond with "hello world" when a GET request is made to the homepage

/**
 * Sends a dispute object from the user to the backend
 */
app.post('/user/form', (req : Request, res : Response) => {
  res.send('Form submitted')
})


app.post('/user/appeal', (req : Request, res : Response) => {
    res.send("Appeal submitted")
})



/**
 * Requests for current disputes 
 */
app.get('user/info', (req : Request, res : Response) => {
    let userReader = new UserReader()
    let userInfo = userReader.getUser(req.body)
    res.send(userInfo)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })