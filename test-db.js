// test-db.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const sleepEntry = await prisma.sleepEntry.create({
      data: {
        userId: 'test-user-id', // Substitua por um ID de usuário válido
        date: new Date(),
        sleepDuration: 8,
        mood: 'Good',
        comment: 'Test entry'
      }
    })
    console.log('Created sleep entry:', sleepEntry)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()