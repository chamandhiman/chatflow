import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/chatflow/app-layout';
import { pageHead } from '@/components/chatflow/shared';
import { Studio } from '@/features/studio';
export const Route = createFileRoute('/chatbots/$id/studio')({head:()=>pageHead('Chatbot Studio','Customize your assistant and preview its appearance live.'),component:Page});
function Page(){const {id}=Route.useParams();return <AppLayout><Studio key={id} id={id}/></AppLayout>;}
