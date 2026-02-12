import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import InitialAnalysis from './InitialAnalysis';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserIcon, BotIcon } from './icons';

interface ChatViewProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim() && !isLoading) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const initialAnalysisText = messages.length > 1 && messages[1].role === 'bot' ? messages[1].text : null;
    const followUpMessages = messages.slice(2);

    return (
        <div className="mt-8 space-y-8">
            <InitialAnalysis text={initialAnalysisText} />

            <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[50vh]">
                    {followUpMessages.length > 0 ? (
                        followUpMessages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && 
                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                        <BotIcon className="w-6 h-6 text-slate-500" />
                                    </div>
                                }
                                <div
                                    className={`max-w-md lg:max-w-xl px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-teal-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {msg.role === 'bot' ? (
                                        <article className="prose dark:prose-invert prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                        </article>
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                                {msg.role === 'user' && 
                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="w-6 h-6 text-slate-500" />
                                    </div>
                                }
                            </div>
                        ))
                    ) : (
                         <p className="text-center text-slate-500 py-4">분석 결과에 대해 궁금한 점을 질문해보세요.</p>
                    )}

                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex items-start gap-3 justify-start">
                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <BotIcon className="w-6 h-6 text-slate-500" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="추가로 궁금한 점을 질문해보세요..."
                            disabled={isLoading}
                            className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputText.trim()}
                            className="p-3 bg-teal-600 text-white rounded-full disabled:bg-slate-400 hover:bg-teal-700 transition-colors shadow-sm"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatView;