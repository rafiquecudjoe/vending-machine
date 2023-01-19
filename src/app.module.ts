import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './apis/auth/auth.module';
import { BuyProductModule } from './apis/buy-products/buy-product.module';
import { ProductsModule } from './apis/products/product.module';
import { UsersModule } from './apis/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';

@Module({
  imports: [
    BuyProductModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
