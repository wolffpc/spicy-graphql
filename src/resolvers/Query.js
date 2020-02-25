const getUserId = require('../utils/getUserId')

const Query = {
    interviews(root, args, context) {
        return context.prisma.interviews({ where: { season: args.season, episode: args.episode } })
    },
    sauces(root, args, context) {
        return context.prisma.sauces({ where: { appearsIn_every: { season: args.season } } })
    },
    reviews(root, args, context) {
        return context.prisma.reviews({ where: { interview: { season: args.season, episode: args.episode } } })
    },
    me(root, args, context) {
        const userId = getUserId(context.request)
        return context.prisma.user({ id: userId })
    }
}

module.exports = Query