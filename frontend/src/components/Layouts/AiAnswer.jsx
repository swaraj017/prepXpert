import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Pin, PinOff, Sparkles, Copy, Check } from 'lucide-react';

// Simple AiAnswer Component
const AiAnswer = ({ content }) => {
  const [copied, setCopied] = useState({});

  const copyCode = async (code, index) => {
    await navigator.clipboard.writeText(code);
    setCopied(prev => ({ ...prev, [index]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [index]: false })), 2000);
  };

  const formatContent = (text) => {
    if (!text) return '';
    
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="border border-gray-200 rounded-lg my-4 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
              <span className="text-xs font-medium text-gray-600 uppercase">{language || 'CODE'}</span>
              <button
                onClick={() => copyCode(code, index)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
              >
                {copied[index] ? <Check size={14} /> : <Copy size={14} />}
                {copied[index] ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 text-sm overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Format regular text
      const formatted = part
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs">$1</code>')
        .replace(/^#{1,6}\s+(.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/\n\n/g, '</p><p class="mb-3">');
      
      return (
        <div
          key={index}
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${formatted}</p>` }}
        />
      );
    });
  };

  return (
    <div className="prose max-w-none text-sm">
      {formatContent(content)}
    </div>
  );
};

// Simple QuestionCard Component
const QuestionCard = ({ question, answer, isPinned, onLearnMore, onTogglePin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight + 20 : 0);
    }
  }, [isExpanded]);

  return (
    <div className={`rounded-xl border-2 mb-6 transition-all  ${
      isPinned ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white hover:shadow-lg'
    }`}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-start p-5 cursor-pointer"
      >
        <h3 className="font-medium text-gray-900 pr-4">{question}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onTogglePin?.(); }}
            className={`p-2 rounded-lg transition-colors ${
              isPinned ? 'text-purple-600 bg-purple-100' : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onLearnMore?.(); }}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Sparkles size={16} />
          </button>
          <ChevronDown
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300"
      >
        <div ref={contentRef} className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4">
            <AiAnswer content={answer} />
          </div>
        </div>
      </div>
    </div>
  );
};

 
export default AiAnswer;
