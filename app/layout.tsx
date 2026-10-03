import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'FocusFlow — Student Task Tracker', description: 'Daily tasks, reminders, and productivity insights.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
