import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Use this (not JwtAuthGuard) on endpoints that should work for both logged-in
// and anonymous visitors, but need to know *who* is asking when a token is present.
// Example: a "favorite" button that shows differently if the user already favorited it.
//
// Unlike JwtAuthGuard, this NEVER throws 401 — it just leaves req.user undefined
// when there's no valid token, instead of blocking the request.
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt-user') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // Swallow errors/missing user instead of throwing — this is what makes it "optional".
    return user || null;
  }
}
