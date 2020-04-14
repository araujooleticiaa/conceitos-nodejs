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

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const projectExist = repositories.findIndex(p => p.id === id);

  if (projectExist !== -1) {
    const project = {
      id,
      url,
      title,
      techs,
      likes: repositories[projectExist].likes,
    };
  
    return response.json(project);
  }

  return response.status(400).json({ error: 'Project already exist' });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectExist = repositories.findIndex(repository => repository.id === id);

  if (projectExist === -1) {
    return response.status(400).json({ error: 'Project not found' });
  }

  repositories.splice(projectExist, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectExist = repositories.findIndex(p => p.id === id);

  if (projectExist !== -1) {

    repositories[projectExist].likes += 1;
  
    return response.json(repositories[projectExist]);
  }

  return response.status(400).json({ error: 'Project not found' });
});


module.exports = app;
