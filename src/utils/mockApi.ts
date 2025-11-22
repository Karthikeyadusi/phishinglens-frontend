export type FusionSource = { label: 'phish' | 'safe' | 'suspicious'; score: number };

export type AnalyzeResponse = {
  verdict: 'phish' | 'safe' | 'suspicious';
  phishing_prob: number;
  fusion: Record<string, FusionSource>;
  detected_brands: string[];
  visual_reasons: string[];
  extracted_urls: string[];
  model_version: string;
  request_id: string;
  timestamp: string;
};

export type AnalyzePayload = {
  mode: 'url' | 'text' | 'image';
  value: string;
};

const verdictPalette: AnalyzeResponse['verdict'][] = ['phish', 'safe', 'suspicious'];

const randomFusion = (): Record<string, FusionSource> => {
  const keys = ['DistilBERT', 'pipeline', 'graph', 'otx'];
  return keys.reduce<Record<string, FusionSource>>((acc, key) => {
    const score = Math.random();
    const label = score > 0.66 ? 'phish' : score > 0.33 ? 'suspicious' : 'safe';
    acc[key] = {
      label,
      score: Math.round(score * 1000) / 1000
    };
    return acc;
  }, {});
};

export const analyzeMockRequest = async (payload: AnalyzePayload): Promise<AnalyzeResponse> => {
  const delay = 700 + Math.random() * 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const phishingProb = payload.value.length % 100 / 100;
  const verdict = phishingProb > 0.7 ? 'phish' : phishingProb > 0.4 ? 'suspicious' : 'safe';

  return {
    verdict,
    phishing_prob: phishingProb,
    fusion: randomFusion(),
    detected_brands: ['Microsoft 365', 'Okta'].slice(0, payload.mode === 'url' ? 2 : 1),
    visual_reasons: [
      'Links to mismatched login domains',
      'Form collects credentials over http'
    ],
    extracted_urls: ['https://secure.ms-login.help', 'https://cdn-ms-assets.com/js/app.js'],
    model_version: 'analyze_url_v2',
    request_id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
};
