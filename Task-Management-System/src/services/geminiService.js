import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// === Rate Limiting & Caching ===
const REQUEST_INTERVAL = 10000; // 10 seconds minimum between requests (very conservative)
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache
const MAX_DAILY_REQUESTS = 20; // Very low limit to stay safe

let lastRequestTime = 0;
let requestsToday = 0;
let lastResetDate = new Date().toDateString();
let requestQueue = Promise.resolve(); // Queue for sequential requests
const responseCache = new Map();

function checkDailyReset() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    requestsToday = 0;
    lastResetDate = today;
  }
}

async function processRequest(fn, cacheKey) {
  checkDailyReset();

  // 1. Check cache first
  if (cacheKey && responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cached.value;
    }
  }

  // 2. Check daily quota
  if (requestsToday >= MAX_DAILY_REQUESTS) {
    throw new Error(`Đã vượt quá giới hạn hàng ngày (${MAX_DAILY_REQUESTS}). Vui lòng thử lại vào ngày mai.`);
  }

  // 3. Queue request for sequential execution
  requestQueue = requestQueue.then(async () => {
    // Wait for rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < REQUEST_INTERVAL) {
      const waitTime = REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ Rate limit: chờ ${waitTime}ms`);
      await new Promise(r => setTimeout(r, waitTime));
    }

    lastRequestTime = Date.now();
    requestsToday++;
    console.log(`📡 Request #${requestsToday}/${MAX_DAILY_REQUESTS}: ${cacheKey}`);
    
    const result = await fn();
    
    // Cache result
    if (cacheKey) {
      responseCache.set(cacheKey, {
        value: result,
        timestamp: Date.now()
      });
    }
    
    return result;
  });

  return requestQueue;
}

// === AI Functions ===

export async function generateTaskPriority(taskContent) {
  const cacheKey = `priority:${taskContent}`;
  
  return processRequest(async () => {
    const prompt = `Phân tích task này và đề xuất độ ưu tiên dựa trên các từ khóa. Trả lời chỉ một từ: "low", "medium", hoặc "high"

Task: "${taskContent}"`;

    const result = await model.generateContent(prompt);
    const priority = result.response.text().toLowerCase().trim();
    
    if (['low', 'medium', 'high'].includes(priority)) {
      return priority;
    }
    return 'medium';
  }, cacheKey);
}

export async function generateTaskSubtasks(taskContent) {
  const cacheKey = `subtasks:${taskContent}`;
  
  return processRequest(async () => {
    const prompt = `Bạn là một chuyên gia quản lý dự án. Cho một task, hãy tạo 4-5 sub-task hợp lý. Trả lời là JSON array của strings, không gì khác.

Task: "${taskContent}"

Format: ["subtask 1", "subtask 2", ...]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      console.error('Lỗi parse subtasks:', e);
    }
    
    return [];
  }, cacheKey);
}

export async function generateDailyTips(tasks) {
  const cacheKey = 'tips:daily';
  
  return processRequest(async () => {
    const taskSummary = Object.values(tasks)
      .slice(0, 8)
      .map(t => `- ${t.content} (Priority: ${t.priority || 'medium'})`)
      .join('\n') || 'Không có task';

    const prompt = `Là một trợ lý năng suất, hãy cung cấp 2-3 lời khuyên ngắn gọn để cải thiện năng suất hôm nay.

Tasks hôm nay:
${taskSummary}

Hãy cung cấp lời khuyên trong 2-3 câu ngắn gọn.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }, cacheKey);
}

export function getUsageStatus() {
  checkDailyReset();
  return {
    used: requestsToday,
    limit: MAX_DAILY_REQUESTS,
    remaining: Math.max(0, MAX_DAILY_REQUESTS - requestsToday),
    cacheSize: responseCache.size
  };
}

export default {
  generateTaskPriority,
  generateTaskSubtasks,
  generateDailyTips,
  getUsageStatus
};
