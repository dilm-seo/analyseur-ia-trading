import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import type { Settings } from '../types/settings';

interface SettingsProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ settings, onUpdate, isOpen, onClose }: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => onUpdate({ ...settings, apiKey: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              value={settings.model}
              onChange={(e) => onUpdate({ ...settings, model: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Temperature ({settings.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onUpdate({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}