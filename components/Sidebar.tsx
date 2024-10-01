import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
    chatHistory: any[]; // Can be more specific with a type if needed
    onSessionSelect: (sessionId: string) => void;
    onNewChat: () => void;
    onDeleteChat: (sessionId: string, confirmed: boolean) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatHistory, onSessionSelect, onNewChat, onDeleteChat }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);

    const handleDelete = (chatId: string) => {
        if (onDeleteChat && typeof onDeleteChat === 'function') {
            onDeleteChat(chatId, true); // Pass true to indicate user has confirmed
        } else {
            console.warn('onDeleteChat is not provided or is not a function');
        }
        setChatToDelete(null);
    };


    return (
        <div className="relative h-full bg-opacity-90">
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-green-900 text-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <h2 className="text-3xl pt-2 font-bold pl-4 mb-4">Chat History</h2>
                    <button
                        onClick={onNewChat}
                        className="mb-4 mt-4 flex text-sm items-center text-green-900 justify-center w-full py-2 bg-white hover:bg-black hover:text-white rounded-full transition duration-150 ease-in-out"
                    >
                        <Plus size={15} className="mr-2" />
                        New Chat
                    </button>
                    <ul className="space-y-2 flex-grow">
                        {chatHistory.map((chat) => (
                            <li
                                key={chat.id}
                                onClick={() => onSessionSelect(chat.id)}
                                className="cursor-pointer hover:bg-black p-2 rounded transition duration-150 ease-in-out flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-normal text-sm">
                                        {chat.title || `Chat on ${new Date(chat.timestamp?.seconds * 1000).toLocaleString()}`}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        {chat.timestamp ? new Date(chat.timestamp.seconds * 1000).toLocaleDateString() : 'No date'}
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-white hover:text-red-700 transition duration-150 ease-in-out p-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setChatToDelete(chat.id);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to delete {chat.title} chat?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your chat history.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setChatToDelete(null)}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className='bg-green-900' onClick={() => chatToDelete && handleDelete(chatToDelete)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div
                className="fixed top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <ChevronLeft size={40} className="text-gray-500 hover:text-[#E6D7FF]" />
                ) : (
                    <ChevronRight size={40} className="text-gray-500 hover:text-[#E6D7FF]" />
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;