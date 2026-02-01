import { useState, useEffect, useRef, useCallback } from "react";
import { ExtendedProposalCommunicationsService } from "@/services/extended";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/types";

interface ProposalCommunicationsProps {
    responseId: string;
}

interface ProposalMessage {
    id: string;
    project_response_id: string;
    sender_id: string;
    sender_type: string;
    message: string;
    is_read: boolean;
    created_at: string;
    users?: {
        full_name: string | null;
        profile_image_url: string | null;
    } | null;
}

export default function ProposalCommunications({ responseId }: ProposalCommunicationsProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ProposalMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const msgs = await ExtendedProposalCommunicationsService.getMessages(responseId);
            setMessages(msgs || []);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [responseId]);

    useEffect(() => {
        if (responseId) {
            loadMessages();
        }
    }, [responseId, loadMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (responseId) {
            // Load draft message
            const draftKey = `draft_message_proposal_${responseId}`;
            const savedDraft = localStorage.getItem(draftKey);
            if (savedDraft) {
                setNewMessage(savedDraft);
            }
        }
    }, [responseId]);

    useEffect(() => {
        if (responseId) {
            // Save draft message
            const draftKey = `draft_message_proposal_${responseId}`;
            if (newMessage) {
                localStorage.setItem(draftKey, newMessage);
            } else {
                localStorage.removeItem(draftKey);
            }
        }
    }, [newMessage, responseId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user?.id) return;

        try {
            const senderType = session.user.role === UserRoles.CLIENT ? UserRoles.CLIENT : UserRoles.CONSULTANT;
            const sentMessage = await ExtendedProposalCommunicationsService.sendMessage(
                responseId,
                session.user.id,
                senderType,
                newMessage
            );

            // Add sender info to the local message for immediate display
            const enrichedMsg = {
                ...sentMessage,
                users: {
                    full_name: session.user.name,
                    profile_image_url: session.user.image
                }
            };

            setMessages([...messages, enrichedMsg]);
            setNewMessage("");
            localStorage.removeItem(`draft_message_proposal_${responseId}`); // Clear draft
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 h-[500px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading conversation...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-10">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Start the Discussion</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Ask questions about the RFP or provide additional details about your proposal.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === session?.user?.id;

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex items-end gap-3 max-w-[90%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`group relative rounded-3xl px-6 py-3.5 shadow-sm transition-all ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700/50 rounded-bl-lg'
                                        }`}>
                                        <p className="text-[15px] leading-relaxed font-medium">{msg.message}</p>
                                        <div className={`text-[10px] mt-2 font-bold uppercase tracking-wider opacity-60 ${isMe ? 'text-white' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/50 dark:bg-gray-900/30 backdrop-blur-md border-t border-white dark:border-gray-700/50 rounded-b-xl">
                <form onSubmit={handleSend} className="relative group">
                    <input
                        type="text"
                        className="w-full pl-6 pr-24 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all shadow-lg placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center group"
                        disabled={!newMessage.trim()}
                    >
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
                <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 font-bold uppercase tracking-[0.2em]">
                    End-to-End Encrypted Proposal Channel
                </p>
            </div>
        </div>
    );
}
