const { prisma } = require('../prisma/generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Interview = require('./resolvers/Interview')
const Review = require('./resolvers/Review')
const Sauce = require('./resolvers/Sauce')
const User = require('./resolvers/User')

const resolvers = {
    Query,
    Mutation,
    Interview,
    Review,
    Sauce,
    User
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            prisma,
            request
        }
    }
})
server.start({ port: process.env.PORT || 4000 }, () => console.log('Server is up!'))