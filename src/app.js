const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: validUuid } = require("uuid")

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkValidId = (request, response, next) => {

  const { id } = request.params

  if ( !validUuid(id) ) {
    return response.status(400).json({ error: "invalid id"})
  }

  if (!repositories.find( repo => repo.id === id)) {
    return response.status(400).json({ error: "repository not found"})
  }

  return next()

}

app.use(["/repositories/:id","/repositories/:id/like"], checkValidId)
// app.use(/^\/repositories\/\:id(\/like)?/, checkValidId)


app.get("/repositories", (request, response) => {

  return response.status(200).json(repositories)

});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body

  const repository = { 
    id: uuid(),  
    title, url, techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)


});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(
    repo => repo.id == id
  )
  
  repositories[repositoryIndex] = { 
    ...repositories[repositoryIndex],  
    title, url, techs
  }


  return response.status(200).json(repositories[repositoryIndex])

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repo => repo.id == id
  )

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repo => repo.id == id
  )
  
  repositories[repositoryIndex] = { 
    ...repositories[repositoryIndex],  
    likes: repositories[repositoryIndex].likes + 1
  }

  return response.status(200).json(repositories[repositoryIndex])


});

module.exports = app;
