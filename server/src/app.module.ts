import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user/user.entity';


dotenv.config();


const dataSourceOptions: DataSourceOptions = {
type: 'sqlite',
database: process.env.SQLITE_DB || 'data/sqlite.db',
entities: [User],
synchronize: true, // em produção, usar migrations
};


@Module({
imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule, AuthModule],
})
export class AppModule {}