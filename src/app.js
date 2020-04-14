const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryExist = repositories.findIndex(p => p.id === id);

  if (repositoryExist !== -1) {
    const repository = {
      id,
      url,
      title,
      techs,
      likes: repositories[repositoryExist].likes,
    };
  
    return response.json(repository);
  }

  return response.status(400).json({ error: 'Repository already exist' });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryExist = repositories.findIndex(repository => repository.id === id);

  if (repositoryExist === -1) {
    return response.status(400).json({ error: 'Project not found' });
  }

  repositories.splice(repositoryExist, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryExist = repositories.findIndex(p => p.id === id);

  if (repositoryExist !== -1) {

    repositories[repositoryExist].likes += 1;
  
    return response.json(repositories[repositoryExist]);
  }

  return response.status(400).json({ error: 'Project not found' });
});


module.exports = app;
