import express, { response } from 'express'
import * as server from './server.js'
// const server = require('./server.js');
const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req,res) => {
  response.send("IM HERE");
})

app.get('/user/read', [server.readUserErrorHandler, server.readUser]);

app.post('/chat/new', (req,res) => {
  const { message } = req.body;

  if(!message){
    res.status(418).send({message: 'No message written!'});
  }

  res.send({
    mess: `message from ${req.query.sender} to ${req.query.reciever} containing ${message} was sent!`,
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});