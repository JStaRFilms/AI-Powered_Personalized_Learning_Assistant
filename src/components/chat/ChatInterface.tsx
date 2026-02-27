"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";

interface DocumentInfo {
    id: string;
    title: string;
}

interface ChatInterfaceProps {
    conversationId?: string;
    initialMessages?: any[];
    conversationTitle?: string;
    userName?: string;
    documents?: DocumentInfo[];
}

const MODELS = [
    { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", provider: "OpenRouter" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", provider: "OpenRouter" },
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 (Free)", provider: "OpenRouter" },
];

const SUGGESTIONS = [
    { label: "Review an Example", prompt: "Can you walk me through an example from my uploaded materials?" },
    { label: "Give me a Practice Problem", prompt: "Give me a practice problem based on my uploaded curriculum materials." },
    { label: "Explain a concept", prompt: "Explain the key concepts from my uploaded notes in simple terms." },
    { label: "Quiz me", prompt: "Quiz me on the material I've uploaded. Ask me questions to test my understanding." },
];

export function ChatInterface({ conversationId = "default-chat", initialMessages = [], conversationTitle, userName, documents = [] }: ChatInterfaceProps) {
    const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
    const [selectedDocId, setSelectedDocId] = useState<string>("all");
    const [input, setInput] = useState("");

    // Read AI preferences from localStorage (set in Settings page)
    const [preferences, setPreferences] = useState({ socraticMode: true, strictCurriculumMode: true });
    useEffect(() => {
        try {
            const saved = localStorage.getItem('ai_preferences');
            if (saved) setPreferences(JSON.parse(saved));
        } catch { }
    }, []);

    // Memoize transport so it updates when model, preferences, or selected document change
    const transport = useMemo(() => new DefaultChatTransport({
        api: "/api/chat",
        body: {
            conversationId,
            modelId: selectedModel,
            preferences,
            documentId: selectedDocId === "all" ? undefined : selectedDocId,
        }
    }), [conversationId, selectedModel, preferences, selectedDocId]);

    const { messages, sendMessage, status, error } = useChat({
        id: conversationId,
        transport,
        messages: initialMessages,
    });

    const isLoading = status === "streaming" || status === "submitted";
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const content = input.trim();
        setInput("");
        await sendMessage({ text: content });
    };

    const handleSuggestionClick = async (prompt: string) => {
        if (isLoading) return;
        await sendMessage({ text: prompt });
    };

    const handleNewChat = () => {
        window.location.href = `/dashboard/chat?new=${Date.now()}`;
    };

    const isNewSession = messages.length === 0;
    const displayName = userName || "Student";

    return (
        <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">
            {/* Fixed Header */}
            <header className="shrink-0 h-16 glass-solid flex items-center justify-between px-6 z-10 border-b border-surface-200">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-lg font-serif text-surface-900 leading-none">
                            {conversationTitle || "New Tutor Session"}
                        </h2>
                        <span className="text-xs font-medium text-brand-700 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span> Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Context Document Selector */}
                    {documents.length > 0 && (
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-xs text-surface-500 font-medium">Context:</span>
                            <select
                                value={selectedDocId}
                                onChange={(e) => setSelectedDocId(e.target.value)}
                                className="text-xs bg-surface-50/80 border border-surface-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 text-surface-600 shadow-sm max-w-[180px]"
                            >
                                <option value="all">📚 All {documents.length} materials</option>
                                {documents.map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        📄 {doc.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Model Selector */}
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={isLoading}
                        className="text-xs bg-surface-50/80 border border-surface-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 text-surface-600 shadow-sm"
                    >
                        {MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>

                    {/* New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        className="text-xs bg-brand-900 text-surface-50 px-4 py-2 rounded-xl hover:bg-brand-800 transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        New Chat
                    </button>
                </div>
            </header>

            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-8 flex flex-col justify-end min-h-full">

                    {/* Welcome Screen (shown when no messages) */}
                    {isNewSession && (
                        <div className="flex flex-col items-center justify-center flex-1 py-12">
                            {/* Lumina Avatar */}
                            <div className="w-16 h-16 rounded-3xl bg-brand-100 flex items-center justify-center border border-brand-200 shadow-float mb-6">
                                <span className="text-brand-800 font-serif font-bold italic text-3xl">L.</span>
                            </div>

                            <h2 className="text-2xl font-serif text-surface-900 mb-2">
                                Hello, {displayName}
                            </h2>
                            <p className="text-surface-500 font-light text-center max-w-md mb-8">
                                {documents.length > 0
                                    ? `I have access to ${documents.length} document${documents.length === 1 ? '' : 's'} from your library. What would you like to learn today?`
                                    : "Upload some study materials first, then I can help you learn from them."
                                }
                            </p>

                            {/* Suggestion Chips */}
                            {documents.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s.label}
                                            onClick={() => handleSuggestionClick(s.prompt)}
                                            disabled={isLoading}
                                            className="text-sm font-medium px-4 py-2.5 rounded-2xl border transition-all hover:shadow-float disabled:opacity-50
                                                bg-white/80 border-surface-200 text-surface-800 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50"
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No documents CTA */}
                            {documents.length === 0 && (
                                <a
                                    href="/dashboard/library"
                                    className="text-sm font-medium bg-brand-900 text-surface-50 px-6 py-3 rounded-2xl hover:bg-brand-800 transition-colors shadow-float flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Upload Your First Material
                                </a>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((m) => {
                        const messageText = m.parts
                            ?.filter((p: any) => p.type === 'text')
                            .map((p: any) => p.text)
                            .join('') || '';

                        return (
                            <div key={m.id} className={clsx("flex gap-4 w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                                {m.role === "assistant" && (
                                    <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0 border border-brand-200 shadow-sm mt-1">
                                        <span className="text-brand-800 font-serif font-bold italic text-lg">L.</span>
                                    </div>
                                )}

                                <div className={clsx(
                                    "px-6 py-5 rounded-3xl shadow-sm space-y-4 max-w-[85%]",
                                    m.role === "user"
                                        ? "bg-surface-900 text-surface-50 rounded-tr-sm"
                                        : "bg-white/80 border border-surface-200 rounded-tl-sm text-surface-900"
                                )}>
                                    <div className={clsx(
                                        "leading-relaxed max-w-none",
                                        m.role === "assistant"
                                            ? "prose prose-sm prose-p:my-3 prose-headings:mt-5 prose-headings:mb-2 prose-li:my-1 prose-hr:my-4 prose-hr:border-surface-200 prose-strong:text-brand-800 font-light"
                                            : "font-light"
                                    )}>
                                        {m.role === "assistant" ? (
                                            <ReactMarkdown>{messageText}</ReactMarkdown>
                                        ) : (
                                            messageText
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {error && (
                        <div className="flex justify-center mb-4">
                            <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl shadow-sm text-center max-w-md">
                                {(() => {
                                    const errStr = error.message || "";
                                    if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429")) {
                                        return "This AI model is currently busy or rate-limited. Please select a different model from the dropdown above to continue.";
                                    }
                                    if (errStr.includes("error")) {
                                        return "The AI encountered an error processing your request. Please try again or switch to a different model.";
                                    }
                                    return errStr || "An error occurred generating the response.";
                                })()}
                            </span>
                        </div>
                    )}

                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                        <div className="flex justify-start gap-4 w-full">
                            <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0 border border-brand-200 shadow-sm mt-1">
                                <span className="text-brand-800 font-serif font-bold italic text-lg">L.</span>
                            </div>
                            <div className="bg-white/80 border border-surface-200 px-6 py-5 rounded-3xl rounded-tl-sm shadow-sm flex items-center max-w-[85%]">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Fixed Bottom Input */}
            <div className="shrink-0 p-4 md:p-6 pt-0 border-t border-surface-100 bg-white/50 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="glass p-2 rounded-3xl shadow-up flex items-end gap-2 border border-surface-200 transition-all focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-50 bg-white/70"
                    >
                        {/* Attachment Button */}
                        <button
                            type="button"
                            className="p-3 text-surface-500 hover:text-brand-600 hover:bg-surface-100 rounded-2xl transition-colors shrink-0 mb-1 ml-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13">
                                </path>
                            </svg>
                        </button>

                        {/* Textarea */}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e as unknown as React.FormEvent);
                                }
                            }}
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 text-surface-900 placeholder-surface-500 resize-none py-4 text-base font-light leading-relaxed max-h-32 outline-none"
                            placeholder="Ask a question or request a practice problem..."
                            style={{ minHeight: "56px" }}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-brand-900 text-surface-50 hover:bg-brand-800 disabled:opacity-50 disabled:hover:bg-brand-900 rounded-2xl transition-colors shrink-0 mb-1 mr-1 shadow-sm flex items-center justify-center group"
                        >
                            <svg className="w-5 h-5 transform group-disabled:translate-x-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </form>

                    <p className="text-center text-xs text-surface-500 mt-3 font-light">
                        Lumina AI generates responses based on your uploaded curriculum materials.
                    </p>
                </div>
            </div>
        </div>
    );
}
