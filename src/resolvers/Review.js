const { prisma } = require('../../prisma/generated/prisma-client')

const Review = {
    interview(parent) {
        return prisma.review({ id: parent.id }).interview()
    },
    author(parent) {
        return prisma.review({ id: parent.id }).author()
    }
}

module.exports = Review