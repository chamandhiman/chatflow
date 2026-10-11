import { createFileRoute } from '@tanstack/react-router';
import { MarketingLayout } from '@/components/chatflow/marketing-layout';
import { MarketingSection } from '@/features/marketing';
import { pageHead } from '@/components/chatflow/shared';
export const Route = createFileRoute('/legal')({head:()=>pageHead('Legal','Explore ChatFlow AI legal.'),component:Page});
function Page(){return <MarketingLayout><MarketingSection section="legal"/></MarketingLayout>;}
