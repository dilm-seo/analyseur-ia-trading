import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-600" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-gray-700" {...props} />,
          th: ({node, ...props}) => (
            <th className="px-4 py-2 text-left text-sm font-semibold" {...props} />
          ),
          td: ({node, ...props}) => <td className="px-4 py-2 text-sm" {...props} />,
          code: ({node, inline, ...props}) => 
            inline ? (
              <code className="bg-gray-700 px-1 rounded" {...props} />
            ) : (
              <code className="block bg-gray-700 p-4 rounded-lg overflow-x-auto" {...props} />
            ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-blue-400 hover:text-blue-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}