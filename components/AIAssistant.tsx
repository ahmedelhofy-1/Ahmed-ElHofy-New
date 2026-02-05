
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your AgriMant AI Consultant. I can help you with maintenance planning, spare parts forecasting, or analyzing asset health data. How can I assist you today?' }
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
          systemInstruction: `You are an expert ERP and CMMS consultant specializing in the agriculture industry. 
          Your goals are to:
          1. Provide professional maintenance advice for tractors, irrigation, and processing equipment.
          2. Help plan seasonal maintenance cycles (Pre-harvest, Post-harvest).
          3. Suggest predictive maintenance strategies based on usage data.
          4. Assist in optimizing spare parts inventory and warehouse logistics.
          Keep your tone professional, authoritative (like an SAP consultant), yet helpful. Use clear bullet points for complex advice.`,
          temperature: 0.7
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AgriMant AI Engine. Please check your system logs." }]);
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
            AI ERP Advisor
          </h2>
          <p className="text-gray-500 text-sm">Real-time intelligent consultation for your agricultural maintenance operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 p-2 px-3 rounded-lg border border-emerald-100 text-emerald-700 text-xs font-semibold">
          <Bot size={16} />
          Gemini 3 Pro Active
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 sap-shadow flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
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
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border border-gray-200">
                  <Loader2 className="animate-spin text-emerald-600" size={20} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Info size={14} className="text-gray-400" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Suggested: "Optimize harvester maintenance for harvest season"</span>
          </div>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask for maintenance advice, inventory planning, or asset reports..."
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-14 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-4">
            AgriMant AI may provide insights based on provided context. Verify critical decisions with certified technicians.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
