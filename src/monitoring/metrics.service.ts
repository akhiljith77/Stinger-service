// src/prometheus/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestCounter: Counter,
  ) {}

  incrementRequestCount(method: string, path: string, status: number) {
    this.requestCounter.inc({ method, path, status });
  }
}