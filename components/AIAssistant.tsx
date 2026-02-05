
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your Daltex AI Advisor. I can help you with Daltex maintenance strategies, seasonal planning, or technical asset optimization. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the Daltex AI Advisor, a specialized CMMS/ERP consultant for the Daltex agricultural enterprise.
          Your expertise includes:
          - High-level SAP-style maintenance management.
          - Agricultural machinery lifecycle (John Deere, Case IH, etc.).
          - Irrigation infrastructure reliability.
          - Seasonal maintenance planning (Pre/Post Harvest).
          Keep your tone professional, efficient, and authoritative. Refer to Daltex as the standard context for all advice.`,
          temperature: 0.7
        }
      });

      const aiText = response.text || "I apologize, but I couldn't generate a recommendation at this time.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "System connection error. Please verify the Daltex AI service status." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-emerald-500" />
            Daltex AI Advisor
          </h2>
          <p className="text-gray-500 text-sm">Strategic intelligent consultation for Daltex agricultural operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-2 px-3 rounded-lg border border-blue-100 text-blue-700 text-xs font-semibold">
          <Bot size={16} />
          Technical Engine Active
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 sap-shadow flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#0a1e36] text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <img src="https://daltexcorp.com/wp-content/uploads/2021/05/logo-daltex.png" className="w-5 h-5 object-contain invert" alt="logo" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0a1e36] text-white flex items-center justify-center animate-pulse">
                   <Bot size={16} />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border border-gray-200">
                  <Loader2 className="animate-spin text-blue-600" size={20} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask for Daltex maintenance advice..."
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-14 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-sm"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
