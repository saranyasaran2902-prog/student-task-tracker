import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from './prisma';

const COOKIE = 'student_tracker_session';
const secret = () => process.env.AUTH_SECRET || 'development-only-secret-change-me';
export async function createSession(userId: string) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString('base64url');
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
  (await cookies()).set(COOKIE, `${payload}.${sig}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
}
export async function destroySession() { (await cookies()).delete(COOKIE); }
export async function getCurrentUser() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { sub: string; exp: number };
    if (data.exp < Date.now()) return null;
    return prisma.user.findUnique({ where: { id: data.sub }, select: { id: true, name: true, email: true, defaultReminderMinutes: true, remindersEnabled: true, overdueEnabled: true, dailySummaryEnabled: true } });
  } catch { return null; }
}
export async function requireUser() { const user = await getCurrentUser(); if (!user) throw new Error('UNAUTHORIZED'); return user; }
