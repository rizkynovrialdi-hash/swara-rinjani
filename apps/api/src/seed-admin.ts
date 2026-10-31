// One-time script to create the first admin account with a properly hashed password.
// Run with: npx ts-node src/seed-admin.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@swararinjani.com';
  const plainPassword = 'rinjani123'; // change this after first login in production
  const name = 'Admin Rinjani';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hashedPassword, name },
  });

  console.log('Admin account ready:');
  console.log('  email:', admin.email);
  console.log('  password (plain, for first login only):', plainPassword);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());