// src/prometheus/metrics.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Store original end function
    const originalEnd = res.end;
    
    // Override end function
    res.end = function(this: Response, ...args) {
      // Call the metrics service to increment counter
      this.req['metrics'].metricsService.incrementRequestCount(
        req.method,
        req.path,
        res.statusCode,
      );
      
      // Call original end function
      return originalEnd.apply(this, args);
    };
    
    // Store metrics service in request
    req['metrics'] = { metricsService: this.metricsService };
    
    next();
  }
}