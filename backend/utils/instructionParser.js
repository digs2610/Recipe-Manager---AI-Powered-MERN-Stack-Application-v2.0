export const parseInstructions = (instructionText) => {
    if (!instructionText) return [];
    
    const lines = instructionText.split('\n').filter(line => line.trim());
    const steps = [];
    
    lines.forEach((line, index) => {
        const cleaned = line.replace(/^(Step\s*\d+[:\.]?|[\d]+\.)\s*/i, '').trim();
        if (cleaned) {
            steps.push({
                order: index + 1,
                instruction: cleaned,
                duration: extractDuration(cleaned),
                tips: extractTips(cleaned)
            });
        }
    });
    
    return steps;
};

const extractDuration = (text) => {
    const durationMatch = text.match(/(\d+\s*(minutes?|mins?|hours?|hrs?|seconds?|secs?))/i);
    return durationMatch ? durationMatch[0] : null;
};

const extractTips = (text) => {
    const tipKeywords = ['tip', 'note', 'important', 'remember', 'make sure', 'avoid'];
    const lowerText = text.toLowerCase();
    return tipKeywords.some(keyword => lowerText.includes(keyword)) ? text : null;
};

export const formatInstructions = (steps) => {
    if (!steps || !Array.isArray(steps)) return '';
    return steps.map(step => `${step.order}. ${step.instruction}`).join('\n');
};