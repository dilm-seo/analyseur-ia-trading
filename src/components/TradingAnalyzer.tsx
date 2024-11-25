import React, { useState, useEffect, useRef } from 'react';
import { Brain, LineChart, Loader2, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { generateAnalysisPrompt, analyzeTradingOpportunities } from '../lib/openai';
import { fetchRSSFeed } from '../lib/rss';
import type { FeedItem } from '../lib/rss';
import Settings from './Settings';
import NewsFeed from './NewsFeed';
import MarkdownViewer from './MarkdownViewer';
import { DEFAULT_SETTINGS } from '../types/settings';
import type { Settings as SettingsType } from '../types/settings';

export default function TradingAnalyzer() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const promptSectionRef = useRef<HTMLDivElement>(null);
  const analysisSectionRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchNews = async () => {
    try {
      setIsLoadingFeed(true);
      const items = await fetchRSSFeed();
      setFeedItems(items);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return interval;
  };

  const handleGeneratePrompt = async () => {
    try {
      setIsLoading(true);
      const progressInterval = simulateProgress();
      const prompt = await generateAnalysisPrompt(feedItems, settings);
      setGeneratedPrompt(prompt || '');
      setStep(2);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => scrollToRef(promptSectionRef), 100);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      const progressInterval = simulateProgress();
      const result = await analyzeTradingOpportunities(generatedPrompt, feedItems, settings);
      setAnalysis(result || '');
      setStep(3);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => scrollToRef(analysisSectionRef), 100);
    } catch (error) {
      console.error('Error analyzing opportunities:', error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Analyseur IA Trading</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNews}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLoadingFeed}
            >
              <RefreshCw className={`w-6 h-6 ${isLoadingFeed ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <Settings
          settings={settings}
          onUpdate={setSettings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <div className="space-y-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${
                  s !== 3 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s !== 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* News Feed Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Actualités Forex</h2>
              <button
                onClick={handleGeneratePrompt}
                disabled={isLoading || feedItems.length === 0 || !settings.apiKey}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && step === 1 ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Brain className="w-5 h-5" />
                )}
                Générer l'Analyse
              </button>
            </div>
            <NewsFeed items={feedItems} isLoading={isLoadingFeed} />
          </div>

          {/* Generated Prompt Section */}
          {generatedPrompt && (
            <div ref={promptSectionRef} className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Prompt d'Analyse Généré</h2>
              <MarkdownViewer content={generatedPrompt} />
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && step === 2 ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LineChart className="w-5 h-5" />
                )}
                Analyser les Opportunités
              </button>
            </div>
          )}

          {/* Analysis Results Section */}
          {analysis && (
            <div ref={analysisSectionRef} className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Analyse des Opportunités de Trading</h2>
              <MarkdownViewer content={analysis} />
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && progress > 0 && (
            <div className="fixed bottom-4 right-4 w-64 bg-gray-700 rounded-lg p-4 shadow-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Progression</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}