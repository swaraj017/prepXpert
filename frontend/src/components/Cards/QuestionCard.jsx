import React, { useState, useRef, useEffect } from 'react';
import {
  LucideChevronDown,
  LucidePin,
  LucidePinOff,
  LucideSparkle,
  LucideCopy,
  LucideCheck
} from 'lucide-react';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionCard = ({ question, answer, isPinned, onLearnMore, onTogglePin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 20); // add padding
    } else {
      setHeight(0);
    }
  }, [isExpanded, answer]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`rounded-xl border-2 transition-all ${
        isPinned ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-start gap-4 p-5 cursor-pointer"
      >
        <h3 className="text-[1.04rem] font-semibold text-gray-900 pr-4">{question}</h3>

        <div className="flex gap-3 shrink-0 mt-1">
          {/* Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.();
            }}
            title="Toggle Pin"
            className={`text-purple-600 rounded-md transition-colors ${
              isPinned
                ? 'bg-purple-50'
                : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            {isPinned ? <LucidePinOff size={19} /> : <LucidePin size={19} />}
          </button>

          {/* Learn More */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore?.();
            }}
            title="Learn More"
            className="p-1.5 rounded-md bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors"
          >
            <LucideSparkle size={19} />
          </button>

          {/* Expand Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-transform"
          >
            <LucideChevronDown
              size={16}
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Answer Body with Expand Animation */}
      <motion.div
        animate={{ height }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden px-5"
      >
        <div
          ref={contentRef}
          className="pb-5 text-base text-gray-700 prose prose-slate max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeText = String(children).trim();

                return !inline && match ? (
                  <div className="relative group my-4 rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      style={oneLight}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: '8px',
                        padding: '1em',
                        marginTop: '0.5rem',
                        backgroundColor: '#f9fafb',
                      }}
                      {...props}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopy(codeText, node.position?.start.line)}
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded shadow-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-200"
                    >
                      {copiedIndex === node.position?.start.line ? (
                        <LucideCheck size={14} />
                      ) : (
                        <LucideCopy size={14} />
                      )}
                      {copiedIndex === node.position?.start.line ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <code className="bg-gray-100 text-xs px-1.5 py-0.5 rounded">
                    {children}
                  </code>
                );
              },
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionCard;
