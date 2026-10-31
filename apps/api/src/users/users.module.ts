import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserJwtStrategy } from './user-jwt.strategy';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-me-in-env',
      signOptions: { expiresIn: '30d' }, // visitors get a longer-lived token than admins
    }),
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UserJwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
