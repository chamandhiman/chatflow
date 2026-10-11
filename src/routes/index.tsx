import { createFileRoute } from '@tanstack/react-router';
import { MarketingLayout } from '@/components/chatflow/marketing-layout';
import { Marketing } from '@/features/marketing';
import { pageHead } from '@/components/chatflow/shared';
export const Route = createFileRoute('/')({head:()=>pageHead('Your AI Support Team. On Every Website.','Build, customize, and embed business AI assistants with ChatFlow AI. Explore the interactive prototype.'),component:Index});
function Index(){return <MarketingLayout><Marketing/></MarketingLayout>;}
