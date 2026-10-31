import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply this guard with @UseGuards(JwtAuthGuard) on any admin-only route
// (create/update/delete endpoints for radio stations, videos, schedule).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
