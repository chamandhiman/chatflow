import type { Chatbot, Source, ConversationRecord } from '@/types/chatbot';
export const brand = { name: 'ChatFlow AI', workspace: 'Acme Workspace', tagline: 'Your conversations. In good hands.' };
export const initialBots: Chatbot[] = [
{ id:'support',name:'Support Assistant',domain:'example.com',status:'Published',conversations:642,sources:12,activity:'2 minutes ago',kind:'support',greeting:'Hi there! 👋 How can I help you today?',color:'violet',theme:'dark',position:'right',leadCapture:true,handoff:true,launcherSize:56 },
{ id:'sales',name:'Sales Assistant',domain:'shop.example.com',status:'Published',conversations:386,sources:8,activity:'12 minutes ago',kind:'sales',greeting:'Welcome! Let’s find something you’ll love.',color:'cyan',theme:'dark',position:'right',leadCapture:true,handoff:false,launcherSize:56 },
{ id:'appointment',name:'Appointment Assistant',domain:'clinic.example.com',status:'Draft',conversations:168,sources:5,activity:'1 hour ago',kind:'appointment',greeting:'Hello! How can we help with your appointment?',color:'amber',theme:'dark',position:'right',leadCapture:false,handoff:true,launcherSize:56 },
{ id:'docs',name:'Documentation Bot',domain:'docs.example.com',status:'Paused',conversations:88,sources:24,activity:'3 hours ago',kind:'docs',greeting:'What would you like to build today?',color:'rose',theme:'dark',position:'right',leadCapture:false,handoff:false,launcherSize:56 } ];
export const initialSources: Source[] = [
{id:'1',name:'Help Center',type:'Website',bot:'Support Assistant',status:'Ready',updated:'Today, 9:42 AM'},
{id:'2',name:'Product catalog.pdf',type:'PDF',bot:'Sales Assistant',status:'Ready',updated:'Yesterday'},
{id:'3',name:'Returns & refunds',type:'FAQ',bot:'Support Assistant',status:'Ready',updated:'Oct 9, 2026'},
{id:'4',name:'Clinic services.docx',type:'DOCX',bot:'Appointment Assistant',status:'Processing',updated:'Today, 10:20 AM'},
{id:'5',name:'Developer documentation',type:'Website',bot:'Documentation Bot',status:'Failed',updated:'Oct 8, 2026'},
{id:'6',name:'Brand guidelines.txt',type:'TXT',bot:'Sales Assistant',status:'Ready',updated:'Oct 7, 2026'} ];
export const initialConversations: ConversationRecord[] = [
{id:'1',name:'Sarah Johnson',email:'sarah@example.com',preview:'How do I reset my password?',bot:'Support Assistant',time:'2 min ago',status:'Open',unread:true,messages:[{role:'user',text:'Hi! How do I reset my password?'},{role:'assistant',text:'Hi Sarah! You can reset your password by selecting **Forgot password** on the sign-in page. We’ll send you a reset link.'},{role:'user',text:'Thanks! How long is the link valid?'}]},
{id:'2',name:'Michael Chen',email:'michael@example.com',preview:'Do you offer a team discount?',bot:'Sales Assistant',time:'12 min ago',status:'Needs Attention',unread:true,messages:[{role:'user',text:'Do you offer a team discount?'},{role:'assistant',text:'We have flexible options for teams. How many people are on your team?'}]},
{id:'3',name:'Emma Wilson',email:'emma@example.com',preview:'I’d like to book an appointment.',bot:'Appointment Assistant',time:'28 min ago',status:'Open',unread:false,messages:[{role:'user',text:'I’d like to book an appointment.'},{role:'assistant',text:'Of course! Which service are you interested in?'}]},
{id:'4',name:'James Miller',email:'james@example.com',preview:'Perfect, that worked. Thank you!',bot:'Support Assistant',time:'45 min ago',status:'Resolved',unread:false,messages:[{role:'user',text:'Can you help me find my invoice?'},{role:'assistant',text:'Your invoices are under Billing in your account settings.'},{role:'user',text:'Perfect, that worked. Thank you!'}]}
];
export const trend = [38,52,43,72,58,67,51,92,74,88,68,84,62,104,89,114,95,130,103,121,94,145,118,140,112,157,131,148,126,172].map((value,i)=>({day:i+1,conversations:value,previous:Math.round(value*.61+8)}));
