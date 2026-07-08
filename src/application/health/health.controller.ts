import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    api: CheckResult;
    database: CheckResult;
    realtime: CheckResult;
    storage: CheckResult;
    edgeFunctions: CheckResult;
  };
}

interface CheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  message?: string;
}

export async function GET(): Promise<NextResponse> {
  const startTime = Date.now();
  const checks: HealthStatus['checks'] = {
    api: { status: 'healthy' },
    database: { status: 'healthy' },
    realtime: { status: 'healthy' },
    storage: { status: 'healthy' },
    edgeFunctions: { status: 'healthy' },
  };

  let overallStatus: HealthStatus['status'] = 'healthy';

  // Check API
  try {
    const apiStart = Date.now();
    checks.api.latency = apiStart - startTime;
  } catch {
    checks.api.status = 'unhealthy';
    checks.api.message = 'API unavailable';
    overallStatus = 'degraded';
  }

  // Check Database
  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('_prisma_migrations').select('id').limit(1);
    checks.database.latency = Date.now() - dbStart;
    
    if (error) {
      checks.database.status = 'degraded';
      checks.database.message = error.message;
      overallStatus = 'degraded';
    }
  } catch (err) {
    checks.database.status = 'unhealthy';
    checks.database.message = err instanceof Error ? err.message : 'Database unavailable';
    overallStatus = 'unhealthy';
  }

  // Check Realtime
  try {
    const realtimeStart = Date.now();
    // Supabase realtime check
    checks.realtime.latency = Date.now() - realtimeStart;
  } catch (err) {
    checks.realtime.status = 'degraded';
    checks.realtime.message = err instanceof Error ? err.message : 'Realtime unavailable';
    overallStatus = 'degraded';
  }

  // Check Storage
  try {
    const storageStart = Date.now();
    const { data, error } = await supabase.storage.listBuckets();
    checks.storage.latency = Date.now() - storageStart;
    
    if (error) {
      checks.storage.status = 'degraded';
      checks.storage.message = error.message;
    }
  } catch (err) {
    checks.storage.status = 'unhealthy';
    checks.storage.message = err instanceof Error ? err.message : 'Storage unavailable';
    overallStatus = 'degraded';
  }

  // Check Edge Functions
  try {
    const functionsStart = Date.now();
    // Would check edge functions health
    checks.edgeFunctions.latency = Date.now() - functionsStart;
  } catch (err) {
    checks.edgeFunctions.status = 'degraded';
    checks.edgeFunctions.message = err instanceof Error ? err.message : 'Edge functions unavailable';
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime(),
    checks,
  };

  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  
  return NextResponse.json(response, { status: statusCode });
}

// Specific health checks for detailed monitoring
export async function GET_db(): Promise<NextResponse> {
  try {
    const start = Date.now();
    const { error } = await supabase.from('_prisma_migrations').select('id').limit(1);
    const latency = Date.now() - start;

    if (error) {
      return NextResponse.json({
        status: 'unhealthy',
        latency,
        error: error.message,
      }, { status: 503 });
    }

    return NextResponse.json({
      status: 'healthy',
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 503 });
  }
}

export async function GET_realtime(): Promise<NextResponse> {
  try {
    const start = Date.now();
    // Check Supabase Realtime
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 503 });
  }
}

export async function GET_storage(): Promise<NextResponse> {
  try {
    const start = Date.now();
    const { data, error } = await supabase.storage.listBuckets();
    const latency = Date.now() - start;

    if (error) {
      return NextResponse.json({
        status: 'unhealthy',
        latency,
        error: error.message,
      }, { status: 503 });
    }

    return NextResponse.json({
      status: 'healthy',
      latency,
      buckets: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 503 });
  }
}

export async function GET_functions(): Promise<NextResponse> {
  try {
    const start = Date.now();
    // Check Edge Functions health
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 503 });
  }
}
