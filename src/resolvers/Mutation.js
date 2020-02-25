const getUserId = require('../utils/getUserId')
const hashPassword = require('../utils/hashPassword')
const generateToken = require('../utils/generateToken')
const bcrypt = require('bcryptjs')

const Mutation = {
    async createReview(root, args, context) {
        const userId = getUserId(context.request)
        const interviewExists = await context.prisma.interview({ id: args.data.interview})
        
        if(!interviewExists) {
            throw new Error('Unable to find post')
        }
        if(args.data.stars > 5 || args.data.stars < 1){
            throw new Error('Please rate between 1 and 5 stars')
        }

        return context.prisma.createReview({
            stars: args.data.stars,
            commentary: args.data.commentary,
            author: {
                connect: { id: userId }
            },
            interview: {
                connect: { id: args.data.interview }
            }
        })
    },
    async updateReview(root, args, context) {
        const userId = getUserId(context.request)
        const reviewExists = await context.prisma.review({ id: args.id }).author()

        if(!reviewExists || reviewExists.id != userId){
            throw new Error('Unable to update review')
        }

        return context.prisma.updateReview({
            where: { id: args.id },
            data: args.data
        })
    },
    async deleteReview(root,args, context) {
        const userId = getUserId(context.request)
        const reviewExists = await context.prisma.review({ id: args.id }).author()

        if(!reviewExists || reviewExists.id != userId){
            throw new Error('Unable to delete review')
        }

        return context.prisma.deleteReview({ id: args.id })
    },
    async login(root, args, context) {
        const user = await context.prisma.user({ email: args.data.email })

        if (!user) {
            throw new Error('Unable to login.')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user: user,
            token: generateToken(user.id)
        }
    },
    async createUser(root, args, context) {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if(!emailRegexp.test(args.data.email)){
            throw new Error('Please enter a valid email')
        }

        const password = await hashPassword(args.data.password)
        const user = await context.prisma.createUser({
            ...args.data,
            password
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async updateUser(root, args, context) {
        const userId = getUserId(context.request)

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        if(args.data.email){
            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            if(!emailRegexp.test(args.data.email)){
                throw new Error('Please enter a valid email')
            }
        }

        return await context.prisma.updateUser({
            where: { id: userId },
            data: args.data
        })
    },
    async deleteUser(root, args, context) {
        const userId = getUserId(context.request)

        return await context.prisma.deleteUser({ id: userId })
    }
}

module.exports = Mutation