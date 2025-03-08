import { AppPrompt } from "@/components/app-prompt";
import { AppTopbar } from "@/components/app-topbar";

export default function AssistantLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className='flex flex-col h-full'>
            <AppTopbar />
            <div className='flex flex-1 flex-col h-full w-full overflow-hidden  overflow-y-auto'>
                {children}
            </div>
            <div className='relative flex flex-none flex-col w-full items-center px-6 mt-0 h-auto'>
                <AppPrompt />
            </div>
        </div>
    );
}
