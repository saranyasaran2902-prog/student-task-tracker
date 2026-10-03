import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
const schema = z.object({ email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(1).max(100) });
export async function POST(request: Request) {
  try { const input = schema.parse(await request.json()); const user = await prisma.user.findUnique({ where: { email: input.email } }); if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 }); await createSession(user.id); return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }); } catch { return NextResponse.json({ error: 'Unable to sign in.' }, { status: 400 }); }
}
