import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Use on visitor endpoints that strictly require login (e.g. saving a favorite,
// posting a comment) — unlike OptionalJwtAuthGuard, this throws 401 if no valid
// visitor token is present.
@Injectable()
export class UserAuthGuard extends AuthGuard('jwt-user') {}
