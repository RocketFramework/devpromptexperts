import { useState, useEffect, useRef } from "react";
import { ExtendedProjectCommunicationsService, ProjectCommunication, ExtendedProjectMilestonesService, ProjectMilestone } from "@/services/extended";
import { useSession } from "next-auth/react";
import { UserRoles, ProjectCommunicationType } from "@/types";

interface ProjectCommunicationsProps {
    projectId: string;
}

export default function ProjectCommunications({ projectId }: ProjectCommunicationsProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ProjectCommunication[]>([]);
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        // In a real app, subscribe to realtime updates here
    }, [projectId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [msgs, mstones] = await Promise.all([
                ExtendedProjectCommunicationsService.findByProjectId(projectId),
                ExtendedProjectMilestonesService.findByProjectId(projectId)
            ]);
            setMessages(msgs);
            setMilestones(mstones);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user?.id) return;

        try {
            const senderType = session.user.role === UserRoles.CLIENT ? UserRoles.CLIENT : UserRoles.CONSULTANT;
            const sentMessage = await ExtendedProjectCommunicationsService.send({
                project_id: projectId,
                message: newMessage,
                sender_id: session.user.id,
                sender_type: senderType,
                message_type: ProjectCommunicationType.MESSAGE,
                milestone_id: selectedMilestoneId || null
            });
            setMessages([...messages, sentMessage]);
            setNewMessage("");
            setSelectedMilestoneId(""); // Reset selection after send? Or keep it? keeping it might be better for threaded convo
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    const getMilestoneName = (id: string | null) => {
        if (!id) return null;
        return milestones.find(m => m.id === id)?.milestone;
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Send a message to sync on project goals, ask questions, or provide updates.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender_id === session?.user?.id;
                        const milestoneName = getMilestoneName(msg.milestone_id as string | null);

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex items-end gap-3 max-w-[90%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`group relative rounded-3xl px-6 py-3.5 shadow-sm transition-all ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700/50 rounded-bl-lg'
                                        }`}>
                                        {milestoneName && (
                                            <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isMe ? 'text-blue-200' : 'text-blue-500'}`}>
                                                Ref: {milestoneName}
                                            </span>
                                        )}
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
            <div className="p-6 bg-white/50 dark:bg-gray-900/30 backdrop-blur-md border-t border-white dark:border-gray-700/50">
                {/* Context Selector */}
                {milestones.length > 0 && (
                    <div className="mb-3 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            type="button"
                            onClick={() => setSelectedMilestoneId("")}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${!selectedMilestoneId
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                }`}
                        >
                            General
                        </button>
                        {milestones.map(m => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setSelectedMilestoneId(m.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedMilestoneId === m.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                            >
                                {m.milestone}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="relative group">
                    <input
                        type="text"
                        className="w-full pl-6 pr-16 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all shadow-lg placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                        placeholder={selectedMilestoneId ? `Message about ${getMilestoneName(selectedMilestoneId)}...` : "Type your message here..."}
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
                    End-to-End Encrypted Consultation Channel
                </p>
            </div>
        </div>
    );
}
