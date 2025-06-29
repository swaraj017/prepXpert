import React from 'react';
import { X } from 'lucide-react';

const ExplanationCard = ({ question, explanation, onClose }) => {
  // Parse the explanation if it's a JSON string
  const parseExplanation = (rawExplanation) => {
  try {
    if (typeof rawExplanation === 'string') {
      const parsed = JSON.parse(rawExplanation);
      if (typeof parsed.explanation === 'string') {
        // Convert \\n to real newlines
        return parsed.explanation.replace(/\\n/g, '\n');
      }
      return rawExplanation;
    }
    return rawExplanation;
  } catch (error) {
    return rawExplanation;
  }
};


  // Simple markdown-like text processor
  const processMarkdown = (text) => {
    if (!text) return 'Loading explanation...';
    
    // Split into lines and process each
    const lines = text.split('\n');
    const elements = [];
    let currentElement = '';
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.startsWith('```') || line.startsWith('`js')) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeLanguage = line.replace(/`/g, '').trim();
          if (currentElement) {
            elements.push({ type: 'text', content: currentElement });
            currentElement = '';
          }
        } else {
          // Ending code block
          inCodeBlock = false;
          elements.push({ type: 'code', language: codeLanguage, content: codeContent });
          codeContent = '';
          codeLanguage = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Handle headers
      if (line.startsWith('###')) {
        if (currentElement) {
          elements.push({ type: 'text', content: currentElement });
          currentElement = '';
        }
        elements.push({ type: 'header', level: 3, content: line.replace('###', '').trim() });
        continue;
      }

      if (line.startsWith('##')) {
        if (currentElement) {
          elements.push({ type: 'text', content: currentElement });
          currentElement = '';
        }
        elements.push({ type: 'header', level: 2, content: line.replace('##', '').trim() });
        continue;
      }

      // Regular text
      currentElement += line + '\n';
    }

    if (currentElement) {
      elements.push({ type: 'text', content: currentElement });
    }

    return elements;
  };

  const formatText = (text) => {
    if (!text) return '';
    
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Handle numbered lists with bold
    text = text.replace(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.*?)$/gm, '<div class="list-item"><strong>$1:</strong> $2</div>');
    // Handle numbered lists without bold
    text = text.replace(/^\d+\.\s*(.*?)$/gm, '<div class="list-item">$1</div>');
    // Handle line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };

  const parsedExplanation = parseExplanation(explanation);
  const processedContent = processMarkdown(parsedExplanation);

  const renderContent = () => {
    if (typeof processedContent === 'string') {
      return (
        <div 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatText(processedContent) }}
        />
      );
    }

    return processedContent.map((element, index) => {
      switch (element.type) {
        case 'header':
          const HeaderTag = `h${element.level}`;
          return (
            <div key={index} className={`font-semibold text-gray-900 mt-4 mb-2 ${
              element.level === 2 ? 'text-xl' : 'text-lg'
            }`}>
              {element.content}
            </div>
          );
        case 'code':
          return (
            <div key={index} className="my-4">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-800 font-mono">
                  {element.content.trim()}
                </code>
              </pre>
            </div>
          );
        case 'text':
          const formattedText = formatText(element.content);
          return (
            <div 
              key={index}
              className="text-gray-700 leading-relaxed mb-3"
              dangerouslySetInnerHTML={{ __html: formattedText }}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Explanation</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close explanation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Question Section */}
        <div>
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded mb-2">
            Question
          </div>
          <div className="text-lg font-medium text-gray-900">{question}</div>
        </div>

        {/* Explanation Section */}
        <div>
          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
            Detailed Explanation
          </div>
          <div className="prose prose-sm max-w-none">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>

      <style jsx>{`
        .inline-code {
          background-color: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .list-item {
          margin: 8px 0;
          padding-left: 16px;
          position: relative;
        }
        .list-item::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

 

 

export default ExplanationCard;
