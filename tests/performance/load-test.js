// Performance test scenarios using k6
// Run with: k6 run tests/performance/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const latencyTrend = new Trend('latency');
const apiLatency = new Trend('api_latency');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '2m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],     // 95% of requests under 500ms
    http_req_failed: ['rate<0.05'],       // Less than 5% failure rate
    errors: ['rate<0.1'],                 // Less than 10% error rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://linkup.app/api';

// Test data
const testUsers = ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'];
const testCategories = ['social', 'tech', 'business', 'sports', 'music'];

// Get auth token
function getAuthToken(userId) {
  const res = http.post(`${BASE_URL}/auth/telegram`, {
    initData: `test_init_data_${userId}`,
  });
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    return body.session?.access_token;
  }
  return null;
}

export default function () {
  const userId = testUsers[Math.floor(Math.random() * testUsers.length)];
  const token = getAuthToken(userId);
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // ==========================================
  // Health Check
  // ==========================================
  const healthStart = new Date();
  const healthRes = http.get(`${BASE_URL}/health`);
  latencyTrend.add(healthRes.timings.duration);
  
  check(healthRes, {
    'health check status 200': (r) => r.status === 200,
    'health check has all checks': (r) => {
      const body = JSON.parse(r.body);
      return body.checks && Object.keys(body.checks).length > 0;
    },
  });

  // ==========================================
  // Event Discovery
  // ==========================================
  const eventsStart = new Date();
  const eventsRes = http.get(`${BASE_URL}/events`, {
    params: { page: 1, limit: 20 },
    headers,
  });
  apiLatency.add(eventsRes.timings.duration);
  
  check(eventsRes, {
    'events list status 200': (r) => r.status === 200,
    'events list has data': (r) => {
      const body = JSON.parse(r.body);
      return body.events && body.events.length > 0;
    },
  });
  
  if (eventsRes.status !== 200) {
    errorRate.add(1);
  }

  sleep(1);

  // ==========================================
  // Category Filter
  // ==========================================
  const category = testCategories[Math.floor(Math.random() * testCategories.length)];
  const categoryRes = http.get(`${BASE_URL}/events`, {
    params: { category },
    headers,
  });
  
  check(categoryRes, {
    'category filter status 200': (r) => r.status === 200,
  });

  sleep(1);

  // ==========================================
  // Nearby Events
  // ==========================================
  const nearbyRes = http.get(`${BASE_URL}/events/nearby`, {
    params: { lat: 48.8566, lng: 2.3522, radius: 10 },
    headers,
  });
  
  check(nearbyRes, {
    'nearby events status 200': (r) => r.status === 200,
  });

  sleep(1);

  // ==========================================
  // Search
  // ==========================================
  const searchRes = http.get(`${BASE_URL}/events/search`, {
    params: { q: 'tech meetup', page: 1 },
    headers,
  });
  
  check(searchRes, {
    'search status 200': (r) => r.status === 200,
  });

  sleep(2);

  // ==========================================
  // Authenticated Requests (if token available)
  // ==========================================
  if (token) {
    // Get recommendations
    const recsRes = http.get(`${BASE_URL}/recommendations`, { headers });
    check(recsRes, {
      'recommendations status 200': (r) => r.status === 200,
    });

    // Get user profile
    const profileRes = http.get(`${BASE_URL}/profile`, { headers });
    check(profileRes, {
      'profile status 200': (r) => r.status === 200,
    });

    sleep(1);
  }

  // Random delay between requests
  sleep(Math.random() * 3 + 1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'performance-results.json': JSON.stringify(data, null, 2),
  };
}

function textSummary(data, options) {
  const { metrics } = data;
  
  let summary = '\n\n';
  summary += '═══════════════════════════════════════════════════════════════\n';
  summary += '                      PERFORMANCE TEST RESULTS                 \n';
  summary += '═══════════════════════════════════════════════════════════════\n\n';
  
  summary += `Total Requests:      ${metrics.http_reqs.values.count}\n`;
  summary += `Request Duration:   ${metrics.http_req_duration.values.mean.toFixed(2)}ms (avg)\n`;
  summary += `95th Percentile:    ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += `Success Rate:       ${((1 - metrics.http_req_failed.values.rate) * 100).toFixed(2)}%\n`;
  summary += `Error Rate:         ${(metrics.http_req_failed.values.rate * 100).toFixed(2)}%\n\n`;
  
  summary += 'API Latency:\n';
  summary += `  Mean:             ${metrics.api_latency.values.mean.toFixed(2)}ms\n`;
  summary += `  95th Percentile:  ${metrics.api_latency.values['p(95)'].toFixed(2)}ms\n`;
  summary += `  Max:             ${metrics.api_latency.values.max.toFixed(2)}ms\n\n`;
  
  summary += '═══════════════════════════════════════════════════════════════\n';
  
  return summary;
}
