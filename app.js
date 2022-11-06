import express, { response } from 'express'
import * as server from './server.js'
// const server = require('./server.js');
const app = express();
app.use(express.json());
const port = 3000;
const path = require('path');

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './html_files', 'profile.html'));
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