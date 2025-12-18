import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { MailModule } from '../mail/mail.module';


dotenv.config();


@Module({
    imports: [
    PassportModule,
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'changeme',
    signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600,
    },
    }),
    UserModule,
    MailModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})

export class AuthModule {}