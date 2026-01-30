import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile } from '../types';
import { getTutorResponseStream, generateDiagram } from '../services/geminiService';
import { Send, Bot, User, Loader2, ImageIcon } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

interface AIChatProps {
  profile: StudentProfile;
}

const AIChat: React.FC<AIChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hi ${profile.name}! I'm your study buddy. Whether you're stuck on a math problem, need to brainstorm an essay, or just feel overwhelmed, I'm here to help. What are we working on?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGeneratingImage]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Check if user is asking for a diagram
    const diagramKeywords = ['draw', 'diagram', 'sketch', 'visualize', 'image', 'picture', 'illustration'];
    const wantsDiagram = diagramKeywords.some(keyword => userText.toLowerCase().includes(keyword));

    const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
        const streamResult = await getTutorResponseStream(historyForApi, userMsg.text, profile);
        
        // Create placeholder for model response
        const modelMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            text: '',
            timestamp: Date.now()
        }]);

        let fullText = '';
        
        for await (const chunk of streamResult) {
            const c = chunk as GenerateContentResponse;
            const chunkText = c.text;
            if (chunkText) {
                fullText += chunkText;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMsgId ? { ...msg, text: fullText } : msg
                ));
            }
        }

        // If diagram requested, trigger image generation
        if (wantsDiagram) {
            setIsGeneratingImage(true);
            const imageBase64 = await generateDiagram(userText);
            
            if (imageBase64) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 2).toString(),
                    role: 'model',
                    text: 'Here is a diagram to help explain:',
                    image: imageBase64,
                    timestamp: Date.now()
                }]);
            }
            setIsGeneratingImage(false);
        }

    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "I'm having a little trouble connecting right now. Can you try asking again?",
            timestamp: Date.now()
        }]);
        setIsGeneratingImage(false);
    } finally {
        setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white">
        <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="w-6 h-6" />
        </div>
        <div>
            <h2 className="font-bold">AI Tutor</h2>
            <p className="text-xs text-indigo-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online & Ready to Help
            </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                            {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm ${
                            isUser 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                        }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            {msg.image && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={msg.image} alt="AI Generated Diagram" className="w-full h-auto" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        })}
        {isGeneratingImage && (
             <div className="flex justify-start">
                 <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                         <Bot className="w-5 h-5" />
                     </div>
                     <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-2">
                         <ImageIcon className="w-4 h-4 animate-bounce" />
                         <span className="text-sm">Drawing diagram...</span>
                     </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a concept, or type 'Draw a diagram of...'"
                className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isStreaming}
            />
            <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;