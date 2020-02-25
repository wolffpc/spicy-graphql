const { prisma } = require('../../prisma/generated/prisma-client')

const Sauce = {
    appearsIn(parent) {
        return prisma.sauce({ id: parent.id }).appearsIn()
    }
}

module.exports = Sauce