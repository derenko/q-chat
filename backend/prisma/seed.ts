import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function load() {
  const project = await prisma.project.create({
    data: {
      name: 'test-project',
      website: 'https://test.com',
      user: {
        create: {
          email: 'test-project@email.com',
          password: bcrypt.hashSync('123456', 10),
        },
      },
    },
  });

  console.log('project created', project);

  const agent = await prisma.agent.create({
    data: {
      user: {
        create: {
          email: 'test-agent@email.com',
          password: bcrypt.hashSync('123456', 10),
          role: 'AGENT',
        },
      },
      name: 'Іван',
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  });

  console.log('agent created', agent);
}

load()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
