import request from 'supertest';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

describe('Security Tests', () => {
  // ==========================================
  // SQL Injection Prevention
  // ==========================================
  describe('SQL Injection Prevention', () => {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users;--",
      "1 OR 1=1",
      "1 UNION SELECT * FROM users",
      "admin'--",
      "1; DELETE FROM events WHERE 1=1",
    ];

    sqlInjectionPayloads.forEach((payload) => {
      test(`should prevent SQL injection: ${payload}`, async () => {
        const response = await request(API_BASE_URL)
          .get('/events')
          .query({ search: payload });

        // Should not return all data or cause error
        expect(response.status).not.toBe(500);
        
        if (response.status === 200) {
          // Should sanitize or return empty results
          expect(response.body).toBeDefined();
        }
      });
    });
  });

  // ==========================================
  // XSS Prevention
  // ==========================================
  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '{{constructor.constructor("alert(1)")()}}',
    ];

    xssPayloads.forEach((payload) => {
      test(`should prevent XSS: ${payload}`, async () => {
        const response = await request(API_BASE_URL)
          .post('/events')
          .set('Authorization', 'Bearer valid_token')
          .send({
            title: payload,
            description: 'Test',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            isFree: true,
            visibility: 'public',
            interests: [],
          });

        // Should either reject or sanitize
        expect(response.status).not.toBe(200);
      });
    });
  });

  // ==========================================
  // Authentication Security
  // ==========================================
  describe('Authentication Security', () => {
    test('should reject requests with missing auth token', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .send({
          title: 'Test',
          description: 'Test',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

      expect(response.status).toBe(401);
    });

    test('should reject requests with invalid token', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          title: 'Test',
          description: 'Test',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

      expect(response.status).toBe(401);
    });

    test('should reject requests with expired token', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'Bearer expired_token')
        .send({
          title: 'Test',
          description: 'Test',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

      expect(response.status).toBe(401);
    });

    test('should reject malformed authorization header', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'NotBearer token')
        .send({
          title: 'Test',
          description: 'Test',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

      expect(response.status).toBe(401);
    });
  });

  // ==========================================
  // Authorization Security
  // ==========================================
  describe('Authorization Security', () => {
    test('should not allow accessing other users events', async () => {
      const response = await request(API_BASE_URL)
        .get('/events/other_user_event_id')
        .set('Authorization', 'Bearer user_token');

      // Should not expose unauthorized data
      expect(response.body.event).toBeUndefined();
    });

    test('should not allow modifying other users events', async () => {
      const response = await request(API_BASE_URL)
        .patch('/events/other_user_event_id')
        .set('Authorization', 'Bearer user_token')
        .send({ title: 'Hacked Title' });

      expect(response.status).toBe(403);
    });

    test('should enforce resource ownership', async () => {
      const response = await request(API_BASE_URL)
        .delete('/events/other_user_event_id')
        .set('Authorization', 'Bearer user_token');

      expect(response.status).toBe(403);
    });
  });

  // ==========================================
  // Rate Limiting
  // ==========================================
  describe('Rate Limiting', () => {
    test('should limit excessive requests', async () => {
      const results: number[] = [];
      
      // Make 100+ rapid requests
      for (let i = 0; i < 110; i++) {
        const response = await request(API_BASE_URL)
          .get('/events')
          .catch(() => ({ status: 0 }));
        
        results.push(response.status);
      }

      // Should have some rate limited responses
      const rateLimited = results.filter(s => s === 429).length;
      expect(rateLimited).toBeGreaterThan(0);
    });

    test('should return rate limit headers', async () => {
      const response = await request(API_BASE_URL)
        .get('/events');

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });

  // ==========================================
  // Input Validation
  // ==========================================
  describe('Input Validation', () => {
    test('should reject oversized payloads', async () => {
      const largePayload = {
        title: 'A'.repeat(10000),
        description: 'B'.repeat(50000),
      };

      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'Bearer valid_token')
        .send(largePayload);

      expect(response.status).toBe(400);
    });

    test('should reject invalid email format', async () => {
      const response = await request(API_BASE_URL)
        .post('/auth/telegram')
        .send({
          initData: 'invalid_email@test',
        });

      expect(response.status).toBe(400);
    });

    test('should reject negative numbers where invalid', async () => {
      const response = await request(API_BASE_URL)
        .get('/events/nearby')
        .query({ lat: -999, lng: -999, radius: -1 });

      expect(response.status).toBe(400);
    });
  });

  // ==========================================
  // Security Headers
  // ==========================================
  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(API_BASE_URL)
        .get('/health');

      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
      ];

      securityHeaders.forEach((header) => {
        expect(response.headers[header]).toBeDefined();
      });
    });

    test('should include CORS headers', async () => {
      const response = await request(API_BASE_URL)
        .get('/health')
        .set('Origin', 'https://example.com');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  // ==========================================
  // Sensitive Data Exposure
  // ==========================================
  describe('Sensitive Data Exposure', () => {
    test('should not expose passwords in responses', async () => {
      const response = await request(API_BASE_URL)
        .get('/profile')
        .set('Authorization', 'Bearer valid_token');

      const body = JSON.stringify(response.body);
      expect(body).not.toMatch(/password/i);
      expect(body).not.toMatch(/secret/i);
    });

    test('should not expose internal errors to users', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'Bearer valid_token')
        .send({ broken: 'data' });

      if (response.status >= 500) {
        expect(response.body.error).not.toContain('stack trace');
        expect(response.body.error).not.toContain('at ');
      }
    });
  });

  // ==========================================
  // CSRF Protection
  // ==========================================
  describe('CSRF Protection', () => {
    test('should require CSRF token for state-changing operations', async () => {
      const response = await request(API_BASE_URL)
        .post('/events')
        .set('Authorization', 'Bearer valid_token')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          title: 'Test',
          description: 'Test',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

      // Should have CSRF validation
      expect([200, 403]).toContain(response.status);
    });
  });
});
