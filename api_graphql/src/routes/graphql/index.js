import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

const graphql = Router()
const prisma = new PrismaClient();
const typeDefs = `
  type User {
    id: Int
    email: String!
  }
  type Query {
    allUsers: [User!]!
    getUser(id:Int):User
  }
  type Mutation {
    createUser(email:String):User
    deleteUser(email:String):User
    deleteUserByID(id:Int):User
    updateUser(oldEmail:String,newEmail:String):User
  }
`
const resolvers = {
  Query: {
    allUsers: async () => {
      return await prisma.user.findMany();
    },
    getUser: async (_,args) =>{
      return await prisma.user.findUnique({
        where:{
          id: args.id
        }
      })
    }
  },
  Mutation:{
    createUser: async (_,args) =>{
      await prisma.user.create({
        data:{
          email: args.email
        }
      })

      return await prisma.user.findFirst({
          where:{
            email: args.email
          }
      })
    },
    deleteUser: async (_,args) => {
      const user = await prisma.user.findFirst({
        where:{
          email: args.email
        }
      })
      await prisma.user.delete({
        where:{
          id:user.id
        }
      })
      return user
    },
    deleteUserByID: async (_,args) =>{
      const user = await prisma.user.findUnique({
        where:{
          id: args.id
        }
      })
      await prisma.user.delete({
        where:{
          id: args.id
        }
      })
      return user
    },
    updateUser: async (_,args) => {
      var user = await prisma.user.findFirst({
        where:{
          email: args.oldEmail
        }
      })

      await prisma.user.update({
        where:{
          id: user.id
        },
        data:{
          email: args.newEmail
        }
      })

      user = await prisma.user.findUnique({
        where:{
          id: user.id
        }
      })

      return user
    }
  }
};
export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

graphql.use('/', graphqlHTTP({
  schema,
}));

export default graphql
