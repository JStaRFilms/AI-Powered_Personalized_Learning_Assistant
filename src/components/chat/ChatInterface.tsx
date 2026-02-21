"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { clsx } from "clsx";

interface ChatInterfaceProps {
    conversationId?: string;
    initialMessages?: any[];
}

export function ChatInterface({ conversationId = "default-chat", initialMessages = [] }: ChatInterfaceProps) {
    const transport = useMemo(() => new DefaultChatTransport({
        api: "/api/chat",
        body: { conversationId }
    }), [conversationId]);

    const { messages, sendMessage, status } = useChat({
        id: conversationId,
        transport,
        messages: initialMessages,
    });

    const [input, setInput] = useState("");
    const isLoading = status === "streaming" || status === "submitted";

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const content = input.trim();
        setInput("");
        await sendMessage({ role: "user", parts: [{ type: "text", text: content }] });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">AI Tutor</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mt-2">
                                I can answer questions based on your uploaded materials. What would you like to learn today?
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((m) => {
                        const messageText = m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';

                        return (
                            <div
                                key={m.id}
                                className={clsx(
                                    "flex gap-4 w-full",
                                    m.role === "user" ? "flex-row-reverse" : ""
                                )}
                            >
                                <div
                                    className={clsx(
                                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                        m.role === "user"
                                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                                            : "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    )}
                                >
                                    {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div
                                    className={clsx(
                                        "px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%]",
                                        m.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 rounded-tl-none whitespace-pre-wrap"
                                    )}
                                >
                                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                                        {messageText}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                    <div className="flex gap-4 w-full">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                            <Bot size={18} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 rounded-tl-none flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <form
                    onSubmit={handleSubmit}
                    className="flex gap-3 max-w-4xl mx-auto relative items-end rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all"
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your materials..."
                        className="w-full max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-2.5 px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 outline-none"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e as unknown as React.FormEvent);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white transition-colors"
                    >
                        <Send size={18} className={clsx(input.trim() ? "translate-x-0.5" : "")} />
                    </button>
                </form>
                <div className="text-center mt-2 text-xs text-zinc-500 flex justify-center items-center">
                    AI responses are generated based on your uploaded curriculum materials.
                </div>
            </div>
        </div>
    );
}
