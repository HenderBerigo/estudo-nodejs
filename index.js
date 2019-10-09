const express = require('express');

const server = express();

server.use(express.json());


const users = ['Hender', 'Foiiiii', 'José'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});
// Middleware que faz a checagem do usuário antes
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  return next();
}
// Middleware que verifica se existe no array
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: 'Usuário não existe' });
  }

  req.user = user;
  return next();

}

//Busca todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
})

//Busca um usuário específico
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
})

//Cria um novo usuário no array
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);


  return res.json(users);
})

//Edita um usuário do array
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

//Deleta um usuário do array
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send('usuário deletado com sucesso');
})

server.listen(3000);