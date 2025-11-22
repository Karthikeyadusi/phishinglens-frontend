const verdictPalette = ['phish', 'safe', 'suspicious'];
const randomFusion = () => {
    const keys = ['DistilBERT', 'pipeline', 'graph', 'otx'];
    return keys.reduce((acc, key) => {
        const score = Math.random();
        const label = score > 0.66 ? 'phish' : score > 0.33 ? 'suspicious' : 'safe';
        acc[key] = {
            label,
            score: Math.round(score * 1000) / 1000
        };
        return acc;
    }, {});
};
export const analyzeMockRequest = async (payload) => {
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
