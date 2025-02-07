import { Module } from '@nestjs/common';
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


@Module({
  imports: [
    ConfigModule.forRoot(), // This loads your .env file
    JwtModule.registerAsync({
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
        entities: [User,PasswordToken,Products],
        synchronize: true,
      }),
    }),
    UsersModule,
    PasswordTokenModule,
    EmailServiceModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}