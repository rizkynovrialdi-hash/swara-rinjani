import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-me-in-env',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role?: string;
  }) {
    // Existing admin tokens have no role; visitor tokens use "user".
    if (
      !payload.sub ||
      (payload.role !== undefined && payload.role !== 'admin')
    ) {
      throw new UnauthorizedException('Admin access required');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin account not found');
    }

    return admin;
  }
}