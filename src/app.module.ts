import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordTokenModule } from './password-token/password-token.module';
import { PasswordToken } from './password-token/entities/password-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailServiceModule } from './email-service/email-service.module';
import { ProductsModule } from './products/products.module';
import { Products } from './products/entities/product.entity';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order.item.entity';
import { AppPrometheusModule } from './monitoring/prometheus.module';
import { MetricsService } from './monitoring/metrics.service';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { MetricsMiddleware } from './monitoring/metrics.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: configService.get('DBPORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DATABASE'),
        ssl: {
          rejectUnauthorized: false   
        },
        entities: [
          User,
          PasswordToken,
          Products,
          Category,
          Cart,
          Order,
          OrderItem,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    PasswordTokenModule,
    EmailServiceModule,
    ProductsModule,
    RedisModule,
    CategoryModule,
    CartModule,
    OrderModule,
    CacheModule.register({ isGlobal: true }),
    AppPrometheusModule
  ],
  controllers: [AppController],
  providers: [AppService, MetricsService, makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  }),],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
