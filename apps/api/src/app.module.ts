import { Module } from '@nestjs/common';
import { AboutModule } from './about/about.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RadioStationsModule } from './radio-stations/radio-stations.module';
import { VideosModule } from './videos/videos.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { UploadsModule } from './uploads/uploads.module';
import { HeroModule } from './hero/hero.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RadioStationsModule,
    VideosModule,
    ScheduleModule,
    UsersModule,
    AboutModule,
    ArticlesModule, 
    UploadsModule,
    HeroModule,
  ],
})
export class AppModule {}
