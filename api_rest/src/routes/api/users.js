import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const api = Router()

/** GET /api/users > Retrieve all users */
api.get('/', async (_, response) => {
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany()

  response.json({ data: { users: users } })
})

/** GET /api/users > Retrieve one user by id */

api.get('/id', async (request, response) => {
  const prisma = new PrismaClient()
  const id = parseInt(request.body.id)
  const user = await prisma.user.findFirst({
    where: {
      id:id
    }
  })

  response.json({ data: { user: user } })
})

/** POST /api/users > Create one user */

api.post("/", async (request, response) => {
  const prisma = new PrismaClient()

  await prisma.user.create({
    data: {
       email: request.body.email
      }
    })

    response.json({ data: { email: request.body.email } })
})

/** PUT /api/users > Alter an users */

api.put("/", async (request, response) => {
  const prisma = new PrismaClient()

  var user = await prisma.user.findFirst({ 
    where: {
      email : request.body.old
    }
  })

  await prisma.user.update({ 
    where: {
      id: user.id
    },
    data: {
      email : request.body.new
    }
  })

  user = await prisma.user.findFirst({ 
    where: {
      email : request.body.new
    }
  })

  response.json({ 
    data: { 
      user: user
    }
  })
})

/** DELETE /api/users > Delete an users by id */

api.delete("/id",async (request, response) => {
  const prisma = new PrismaClient()

  const user = await prisma.user.findFirst({
    where:{
      id: parseInt(request.body.id)
    }
  })

  await prisma.user.delete({
    where: {
      id: parseInt(request.body.id)
    }
  })

  response.json({
    data:{
      email: user.email
    }
  })
})

/** DELETE /api/users > Delete an users */

api.delete("/",async (request, response) => {
  const prisma = new PrismaClient()

  var user = await prisma.user.findFirst({
    where: {
      email: request.body.email
    }
  })

  await prisma.user.delete({
    where: {
      id: user.id
    }
  })

  response.json({
    data:{
      user: user
    }
  })
})

export default api
