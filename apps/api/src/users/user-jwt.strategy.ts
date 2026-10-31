import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Registered under the name 'jwt-user' so it doesn't collide with the admin
// JWT strategy (which uses the default 'jwt' name in auth/jwt.strategy.ts).
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-me-in-env',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    if (payload.role !== 'user') return null; // reject admin tokens on visitor routes
    return { id: payload.sub, email: payload.email };
  }
}
