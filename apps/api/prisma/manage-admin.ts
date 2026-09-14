import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

type Command = 'create' | 'update' | 'reset-password';

function usage() {
  console.log(`
Manage production admin accounts from this laptop.

Usage:
  npm.cmd run admin:manage --workspace=@coach-rickie/api -- create --name "Admin Name" --email admin@example.com --confirm-production
  npm.cmd run admin:manage --workspace=@coach-rickie/api -- update --email current@example.com --name "Updated Name" --new-email new@example.com --confirm-production
  npm.cmd run admin:manage --workspace=@coach-rickie/api -- reset-password --email admin@example.com --confirm-production

Passwords are requested privately and are never accepted as command-line arguments.
`);
}

function argsFrom(argv: string[]) {
  const [command, ...rest] = argv;
  const options = new Map<string, string | true>();
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw new Error(`Unexpected argument: ${key}`);
    const next = rest[index + 1];
    if (!next || next.startsWith('--')) {
      options.set(key, true);
    } else {
      options.set(key, next);
      index += 1;
    }
  }
  return { command, options };
}

function required(options: Map<string, string | true>, name: string) {
  const value = options.get(name);
  if (!value || value === true) throw new Error(`${name} is required`);
  return value;
}

function normaliseEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Use a valid email address');
  return email;
}

async function promptHidden(label: string) {
  if (!process.stdin.isTTY) throw new Error('A terminal is required to enter a password securely');
  process.stdout.write(label);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  let value = '';
  return new Promise<string>((resolve, reject) => {
    const finish = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
    };
    const onData = (input: string) => {
      if (input === '\u0003') {
        finish();
        reject(new Error('Cancelled'));
      } else if (input === '\r' || input === '\n') {
        finish();
        resolve(value);
      } else if (input === '\u007f' || input === '\b') {
        value = value.slice(0, -1);
      } else {
        value += input;
      }
    };
    process.stdin.on('data', onData);
  });
}

async function passwordHash() {
  const password = await promptHidden('New password: ');
  const confirmation = await promptHidden('Confirm password: ');
  if (password.length < 12) throw new Error('Password must be at least 12 characters long');
  if (password !== confirmation) throw new Error('Passwords do not match');
  return bcrypt.hash(password, 12);
}

async function main() {
  const { command, options } = argsFrom(process.argv.slice(2));
  if (command === '--help' || command === '-h' || !command) {
    usage();
    return;
  }
  if (!['create', 'update', 'reset-password'].includes(command)) {
    usage();
    throw new Error(`Unsupported action: ${command}`);
  }
  if (options.get('--confirm-production') !== true)
    throw new Error('Refusing to write. Add --confirm-production to continue.');
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is missing. Add the production Neon URL to apps/api/.env.');

  const prisma = new PrismaClient();
  try {
    if (command === 'create') {
      const name = required(options, '--name').trim();
      const email = normaliseEmail(required(options, '--email'));
      if (name.length < 2) throw new Error('Name must be at least two characters long');
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing) throw new Error('An admin with this email already exists');
      await prisma.admin.create({ data: { name, email, passwordHash: await passwordHash() } });
      console.log(`Created admin account for ${email}.`);
      return;
    }

    const email = normaliseEmail(required(options, '--email'));
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (!existing) throw new Error('Admin account not found');

    if (command === 'reset-password') {
      await prisma.admin.update({
        where: { id: existing.id },
        data: { passwordHash: await passwordHash() },
      });
      console.log(`Password reset for ${email}.`);
      return;
    }

    const name = options.get('--name');
    const newEmail = options.get('--new-email');
    if ((!name || name === true) && (!newEmail || newEmail === true))
      throw new Error('Provide --name and/or --new-email for an update');
    const data = {
      ...(typeof name === 'string' ? { name: name.trim() } : {}),
      ...(typeof newEmail === 'string' ? { email: normaliseEmail(newEmail) } : {}),
    };
    if (data.name !== undefined && data.name.length < 2)
      throw new Error('Name must be at least two characters long');
    await prisma.admin.update({ where: { id: existing.id }, data });
    console.log(`Updated admin account for ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
