import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/chatflow/app-layout';
import { pageHead } from '@/components/chatflow/shared';
import { Help } from '@/features/help';
export const Route = createFileRoute('/help')({ head:()=>pageHead('Help & Support','Find guidance for creating and managing your AI assistants.'), component:Page });
function Page(){return <AppLayout><Help/></AppLayout>;}
