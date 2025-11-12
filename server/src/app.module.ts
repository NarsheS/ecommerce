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


dotenv.config();


const dataSourceOptions: DataSourceOptions = {
    type: 'sqlite',
    database: process.env.SQLITE_DB || 'data/sqlite.db',
    entities: [User, Address, Products],
    synchronize: true, // em produção, usar migrations
};


@Module({
imports: [
    TypeOrmModule.forRoot(dataSourceOptions), 
    UserModule, 
    AuthModule,
    AddressModule,
    ProductsModule,
],
})
export class AppModule {}