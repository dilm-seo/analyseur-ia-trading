import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  level?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatValue = (value: any): JSX.Element | string => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          return <JsonViewer data={parsed} level={level + 1} />;
        }
      } catch {
        return value;
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      return <JsonViewer data={value} level={level + 1} />;
    }
    
    return String(value);
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (typeof data === 'string') {
    return (
      <div className="font-mono text-sm bg-gray-700 p-4 rounded-lg overflow-x-auto">
        {data.split('\n').map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: level * 20 }}>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-blue-400"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span>[{data.length}]</span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="my-1">
                {formatValue(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div style={{ marginLeft: level * 20 }}>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-blue-400"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span>{'{...}'}</span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="my-1">
                <span className="text-blue-400">{key}:</span>{' '}
                {formatValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export default JsonViewer;