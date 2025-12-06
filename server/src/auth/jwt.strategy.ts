import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

// .env deve ser chamado no ínicio
dotenv.config(); 

// Essa paradinha aqui vai passar 3 coisas importantes junto com Bearer Token
// Essas coisas são o Id, Username e sua Role (user ou admin)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'changeme',
        });
    }


    async validate(payload: any) {
        // Renomeei sub para id, então fica req.user.id ao invés de req.user.sub
        return { id: payload.sub, username: payload.username, role: payload.role };
    }
}