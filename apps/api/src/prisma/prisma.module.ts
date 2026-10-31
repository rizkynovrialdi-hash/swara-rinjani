import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Marked @Global so PrismaService doesn't need to be re-imported in every module.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
