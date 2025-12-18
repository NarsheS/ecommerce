import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { AddressModule } from './address/address.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/roles/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PaymentModule } from './payment/payment.module';
import { DiscountModule } from './products/sales/discount.module';


dotenv.config(); // Setar dotenv primeiro

// Limitador de tentativas
const throttlerSetup = {
    ttl: 60, // 1 minuto
    limit: 10, // 10 requisições por minuto por ip
}


@Module({
    imports: [
        ThrottlerModule.forRoot([throttlerSetup]),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: false, // em produção, usar migrations
            ssl: {
                rejectUnauthorized: false
            },
            logging: process.env.NODE_ENV !== 'production',
            // cache: true, // migrar para redis dps
        }), 
        UserModule, 
        AuthModule,
        AddressModule,
        ProductsModule,
        CategoryModule,
        CartModule,
        OrderModule,
        PaymentModule,
        DiscountModule,
    ],
    providers: [ // Coloca GUARDS globalmente no app/server
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
})
export class AppModule {}