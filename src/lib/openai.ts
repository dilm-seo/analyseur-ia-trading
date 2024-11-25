import OpenAI from 'openai';
import type { Settings } from '../types/settings';
import type { FeedItem } from './rss';

export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateAnalysisPrompt = async (feedItems: FeedItem[], settings: Settings) => {
  const openai = createOpenAIClient(settings.apiKey);
  
  const response = await openai.chat.completions.create({
    model: settings.model,
    messages: [
      {
        role: "system",
        content: `Tu es un expert en analyse de trading et en ingénierie de prompts. En tant qu'analyste financier expérimenté, tu dois créer un prompt détaillé qui sera utilisé pour analyser les opportunités de trading basées sur les actualités du marché forex fournies.

Le prompt que tu vas générer doit inclure :
1. Une analyse du contexte macroéconomique global
2. L'impact potentiel sur les principales paires de devises
3. Les indicateurs techniques et fondamentaux à surveiller
4. Les niveaux de support et résistance importants
5. Les risques potentiels et les événements à surveiller

Réponds en français avec un prompt structuré et détaillé.`
      },
      {
        role: "user",
        content: `Voici les dernières actualités forex à analyser : ${JSON.stringify(
          feedItems.map(item => ({
            titre: item.title,
            contenu: item.contentSnippet,
            date: item.pubDate,
            auteur: item.creator
          })),
          null,
          2
        )}`
      }
    ],
    temperature: settings.temperature
  });

  return response.choices[0].message.content;
};

export const analyzeTradingOpportunities = async (generatedPrompt: string, feedItems: FeedItem[], settings: Settings) => {
  const openai = createOpenAIClient(settings.apiKey);
  
  const response = await openai.chat.completions.create({
    model: settings.model,
    messages: [
      {
        role: "system",
        content: `${generatedPrompt}

En tant qu'expert en trading forex, analyse ces informations et fournis :
1. Une synthèse des mouvements de marché attendus
2. Des recommandations de trading spécifiques
3. Les niveaux d'entrée, de stop-loss et de take-profit suggérés
4. Une évaluation des risques
5. Un horizon temporel recommandé

Réponds en français de manière structurée et professionnelle.`
      },
      {
        role: "user",
        content: JSON.stringify(
          feedItems.map(item => ({
            titre: item.title,
            contenu: item.contentSnippet,
            date: item.pubDate,
            auteur: item.creator
          })),
          null,
          2
        )
      }
    ],
    temperature: settings.temperature
  });

  return response.choices[0].message.content;
};