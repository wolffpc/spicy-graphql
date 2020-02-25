const { prisma } = require('../../prisma/generated/prisma-client')

const User = {
    reviews(parent) {
        return prisma.user({ id: parent.id }).reviews()
    }
}

module.exports = User