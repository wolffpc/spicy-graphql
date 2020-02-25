const { prisma } = require('../../prisma/generated/prisma-client')

const Interview = {
    reviews(parent) {
        return prisma.interview({ id: parent.id }).reviews()
    },
    sauces(parent) {
        return prisma.interview({ id: parent.id }).sauces()
    }
}

module.exports = Interview