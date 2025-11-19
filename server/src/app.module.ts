import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { AddressModule } from './address/address.module';
import { Address } from './address/address.entity';
import { Products } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/roles/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';


dotenv.config();


const dataSourceOptions: DataSourceOptions = {
    type: 'sqlite',
    database: process.env.SQLITE_DB || 'data/sqlite.db',
    entities: [User, Address, Products, Category, Cart, CartItem, Order, OrderItem],
    synchronize: true, // em produção, usar migrations
};

const throttlerSetup = {
    ttl: 60, // 1 minuto
    limit: 10, // 10 requisições por minuto por ip
}


@Module({
    imports: [
        ThrottlerModule.forRoot([throttlerSetup]),
        TypeOrmModule.forRoot(dataSourceOptions), 
        UserModule, 
        AuthModule,
        AddressModule,
        ProductsModule,
        CategoryModule,
        CartModule,
        OrderModule,
    ],
    providers: [
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