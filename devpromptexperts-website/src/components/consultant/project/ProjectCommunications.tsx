import { useState, useEffect, useRef, useCallback } from "react";
import { ExtendedProjectCommunicationsService, ProjectCommunication, ExtendedProjectMilestonesService, ProjectMilestone } from "@/services/extended";
import { useSession } from "next-auth/react";
import { UserRoles, ProjectCommunicationType } from "@/types";
import { MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdInsertLink } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

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
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadData = useCallback(async () => {
        try {
            console.log("loading data for project", projectId);
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
    }, [projectId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Load draft message
        const draftKey = `draft_message_project_${projectId}`;
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            setNewMessage(savedDraft);
        }
    }, [projectId]);

    useEffect(() => {
        // Save draft message
        const draftKey = `draft_message_project_${projectId}`;
        if (newMessage) {
            localStorage.setItem(draftKey, newMessage);
        } else {
            localStorage.removeItem(draftKey);
        }
    }, [newMessage, projectId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("newMessage", newMessage);
        console.log("session", session);
        if (!newMessage.trim() || !session?.user?.id) return;

        try {
            const senderType = session.user.role === UserRoles.CLIENT ? UserRoles.CLIENT : UserRoles.CONSULTANT;
            console.log("senderType", senderType);
            const sentMessage = await ExtendedProjectCommunicationsService.send({
                subject: "",
                project_id: projectId,
                message: newMessage,
                sender_id: session.user.id,
                sender_type: senderType,
                message_type: ProjectCommunicationType.MESSAGE,
                is_read: false,
                read_at: null,
                created_at: new Date().toISOString(),
                attachments: [],
                milestone_id: selectedMilestoneId || null
            });
            setMessages([...messages, sentMessage]);
            setNewMessage("");
            localStorage.removeItem(`draft_message_project_${projectId}`); // Clear draft
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
                    messages.map((msg) => {
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
                                        <div className="text-[15px] leading-relaxed font-medium prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                                {msg.message}
                                            </ReactMarkdown>
                                        </div>
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

                <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-800 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all shadow-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 space-x-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('write')}
                            className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 transition-colors ${activeTab === 'write' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`text-xs font-bold uppercase tracking-wider py-1 border-b-2 transition-colors ${activeTab === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Preview
                        </button>
                    </div>

                    {activeTab === 'write' ? (
                        <>
                            {/* Toolbar */}
                            <div className="flex items-center space-x-1 p-2 border-b border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const textarea = document.getElementById('messageInput') as HTMLTextAreaElement;
                                        if (!textarea) return;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = newMessage;
                                        const before = text.substring(0, start);
                                        const selection = text.substring(start, end) || "text";
                                        const after = text.substring(end);
                                        setNewMessage(`${before}**${selection}**${after}`);
                                        setTimeout(() => textarea.focus(), 0);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Bold"
                                >
                                    <MdFormatBold className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const textarea = document.getElementById('messageInput') as HTMLTextAreaElement;
                                        if (!textarea) return;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = newMessage;
                                        const before = text.substring(0, start);
                                        const selection = text.substring(start, end) || "text";
                                        const after = text.substring(end);
                                        setNewMessage(`${before}*${selection}*${after}`);
                                        setTimeout(() => textarea.focus(), 0);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Italic"
                                >
                                    <MdFormatItalic className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const textarea = document.getElementById('messageInput') as HTMLTextAreaElement;
                                        if (!textarea) return;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = newMessage;
                                        const before = text.substring(0, start);
                                        const selection = text.substring(start, end) || "item";
                                        const after = text.substring(end);
                                        setNewMessage(`${before}\n- ${selection}${after}`);
                                        setTimeout(() => textarea.focus(), 0);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Bullet List"
                                >
                                    <MdFormatListBulleted className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const textarea = document.getElementById('messageInput') as HTMLTextAreaElement;
                                        if (!textarea) return;
                                        const start = textarea.selectionStart;
                                        const end = textarea.selectionEnd;
                                        const text = newMessage;
                                        const before = text.substring(0, start);
                                        const selection = text.substring(start, end) || "text";
                                        const after = text.substring(end);
                                        setNewMessage(`${before}[${selection}](url)${after}`);
                                        setTimeout(() => textarea.focus(), 0);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Link"
                                >
                                    <MdInsertLink className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSend} className="relative">
                                <textarea
                                    id="messageInput"
                                    className="w-full pl-4 pr-16 py-3 bg-transparent border-none focus:ring-0 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium resize-none min-h-[80px]"
                                    placeholder={selectedMilestoneId ? `Message about ${getMilestoneName(selectedMilestoneId)}... (Markdown supported)` : "Type your message here... (Markdown supported)"}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 bottom-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center group"
                                    disabled={!newMessage.trim()}
                                >
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="p-4 min-h-[125px] prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-800">
                            {newMessage.trim() ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {newMessage}
                                </ReactMarkdown>
                            ) : (
                                <span className="text-gray-400 italic">Nothing to preview</span>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 font-bold uppercase tracking-[0.2em]">
                    End-to-End Encrypted Consultation Channel
                </p>
            </div>
        </div>
    );
}
