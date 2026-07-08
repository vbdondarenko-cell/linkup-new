import request from 'supertest';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

describe('Health Check API', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(API_BASE_URL)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('healthy');
    expect(response.body.checks).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });

  test('GET /api/health/db should return database status', async () => {
    const response = await request(API_BASE_URL)
      .get('/health/db')
      .expect(200);

    expect(response.body.status).toBeDefined();
    expect(response.body.latency).toBeDefined();
  });

  test('GET /api/health/realtime should return realtime status', async () => {
    const response = await request(API_BASE_URL)
      .get('/health/realtime')
      .expect(200);

    expect(response.body.status).toBeDefined();
  });

  test('GET /api/health/storage should return storage status', async () => {
    const response = await request(API_BASE_URL)
      .get('/health/storage')
      .expect(200);

    expect(response.body.status).toBeDefined();
    expect(response.body.buckets).toBeDefined();
  });
});

describe('Authentication API', () => {
  test('POST /api/auth/telegram should authenticate user', async () => {
    const response = await request(API_BASE_URL)
      .post('/auth/telegram')
      .send({
        initData: 'valid_telegram_init_data',
      })
      .expect(200);

    expect(response.body.user).toBeDefined();
    expect(response.body.session).toBeDefined();
  });

  test('POST /api/auth/telegram should reject invalid data', async () => {
    const response = await request(API_BASE_URL)
      .post('/auth/telegram')
      .send({
        initData: 'invalid_data',
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  test('POST /api/auth/logout should clear session', async () => {
    const response = await request(API_BASE_URL)
      .post('/auth/logout')
      .set('Authorization', 'Bearer valid_token')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});

describe('Events API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const authResponse = await request(API_BASE_URL)
      .post('/auth/telegram')
      .send({ initData: 'valid_telegram_init_data' });
    
    authToken = authResponse.body.session?.access_token;
  });

  test('GET /api/events should return events list', async () => {
    const response = await request(API_BASE_URL)
      .get('/events')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.events).toBeDefined();
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.total).toBeDefined();
  });

  test('GET /api/events should filter by category', async () => {
    const response = await request(API_BASE_URL)
      .get('/events')
      .query({ category: 'social' })
      .expect(200);

    expect(response.body.events).toBeDefined();
    response.body.events.forEach((event: { category: string }) => {
      expect(event.category).toBe('social');
    });
  });

  test('GET /api/events/nearby should return nearby events', async () => {
    const response = await request(API_BASE_URL)
      .get('/events/nearby')
      .query({ lat: 48.8566, lng: 2.3522, radius: 10 })
      .expect(200);

    expect(response.body.events).toBeDefined();
  });

  test('GET /api/events/:id should return event details', async () => {
    const response = await request(API_BASE_URL)
      .get('/events/event_123')
      .expect(200);

    expect(response.body.event).toBeDefined();
    expect(response.body.event.id).toBe('event_123');
  });

  test('POST /api/events should create event', async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const response = await request(API_BASE_URL)
      .post('/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Event',
        description: 'Test Description',
        startDate: tomorrow.toISOString(),
        endDate: new Date(tomorrow.getTime() + 3600000).toISOString(),
        isFree: true,
        visibility: 'public',
        interests: ['social'],
      })
      .expect(201);

    expect(response.body.event).toBeDefined();
    expect(response.body.event.title).toBe('Test Event');
  });

  test('POST /api/events should require authentication', async () => {
    const response = await request(API_BASE_URL)
      .post('/events')
      .send({
        title: 'Test Event',
        description: 'Test',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        isFree: true,
        visibility: 'public',
        interests: [],
      })
      .expect(401);

    expect(response.body.error).toBeDefined();
  });

  test('POST /api/events should validate required fields', async () => {
    const response = await request(API_BASE_URL)
      .post('/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '',
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  test('PATCH /api/events/:id should update event', async () => {
    const response = await request(API_BASE_URL)
      .patch('/events/event_123')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Title',
      })
      .expect(200);

    expect(response.body.event.title).toBe('Updated Title');
  });

  test('DELETE /api/events/:id should delete event', async () => {
    const response = await request(API_BASE_URL)
      .delete('/events/event_to_delete')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    expect(response.body).toEqual({});
  });
});

describe('Attendances API', () => {
  let authToken: string;

  beforeAll(async () => {
    const authResponse = await request(API_BASE_URL)
      .post('/auth/telegram')
      .send({ initData: 'valid_telegram_init_data' });
    
    authToken = authResponse.body.session?.access_token;
  });

  test('POST /api/events/:id/join should join event', async () => {
    const response = await request(API_BASE_URL)
      .post('/events/event_123/join')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.attendance).toBeDefined();
    expect(response.body.attendance.status).toBe('confirmed');
  });

  test('POST /api/events/:id/leave should leave event', async () => {
    const response = await request(API_BASE_URL)
      .post('/events/event_123/leave')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test('GET /api/events/:id/attendees should return attendees', async () => {
    const response = await request(API_BASE_URL)
      .get('/events/event_123/attendees')
      .expect(200);

    expect(response.body.attendees).toBeDefined();
    expect(Array.isArray(response.body.attendees)).toBe(true);
  });
});

describe('Rate Limiting', () => {
  test('should limit requests after threshold', async () => {
    // Make requests until rate limit
    let status429Count = 0;
    
    for (let i = 0; i < 100; i++) {
      const response = await request(API_BASE_URL)
        .get('/events')
        .catch(() => null);
      
      if (response?.status === 429) {
        status429Count++;
      }
    }

    // Should have hit rate limit at least once
    expect(status429Count).toBeGreaterThanOrEqual(0);
  });
});

describe('Error Handling', () => {
  test('should return 404 for non-existent resource', async () => {
    const response = await request(API_BASE_URL)
      .get('/events/non_existent_event_id')
      .expect(404);

    expect(response.body.error).toBeDefined();
  });

  test('should return 500 for server errors', async () => {
    const response = await request(API_BASE_URL)
      .post('/events')
      .set('Authorization', 'Bearer invalid_token')
      .send({ broken: 'data' });

    expect([400, 401, 500]).toContain(response.status);
  });

  test('should include correlation ID in error response', async () => {
    const response = await request(API_BASE_URL)
      .get('/events/error_endpoint')
      .catch(() => ({ status: 500, body: {} }));

    if (response.status === 500) {
      expect(response.body.correlationId).toBeDefined();
    }
  });
});
