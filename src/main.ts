import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import redis from './common/redis';
import * as expressSession from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { expressSessionOptions } from './config/config';
import * as passport from 'passport';


const redisStore = require('connect-redis')(expressSession);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('vending Machine API')
    .setDescription("The Vending Machine API documentation")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-documentation', app, document);

  app.use(
    expressSession({
      ...expressSessionOptions,
      store: new redisStore({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        client: redis
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  await app.listen(3000);
}
bootstrap();
