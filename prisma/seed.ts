import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a guest user
  const guestUser = await prisma.user.create({
    data: {
      email: `guest-${Date.now()}@example.com`,
      name: 'Guest User',
      isGuest: true,
      portfolios: {
        create: [
          { currency: 'USD', amount: 100000 },
          { currency: 'EUR', amount: 50000 },
          { currency: 'BTC', amount: 1 },
        ],
      },
    },
  });

  console.log('Guest user created:', guestUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
