import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/chatflow/app-layout';
import { pageHead } from '@/components/chatflow/shared';
import { Analytics } from '@/features/analytics';
export const Route = createFileRoute('/analytics')({ head:()=>pageHead('Analytics','Explore assistant performance and conversation insights.'), component:Page });
function Page(){return <AppLayout><Analytics/></AppLayout>;}
