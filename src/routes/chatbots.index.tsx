import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/chatflow/app-layout';
import { pageHead } from '@/components/chatflow/shared';
import { Chatbots } from '@/features/chatbots';
export const Route = createFileRoute('/chatbots/')({ head:()=>pageHead('My Chatbots','Create and manage your business AI assistants.'), component:Page });
function Page(){return <AppLayout><Chatbots/></AppLayout>;}
