import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import TaskManager from '@/components/TaskManager';
export default async function DashboardPage(){const user=await getCurrentUser();if(!user)redirect('/login');return <TaskManager userName={user.name}/>}
