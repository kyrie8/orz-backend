import { Dept } from 'src/dept/entities/dept.entity';
import { CacheModule, Module } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptController } from './dept.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Dept]),
    CacheModule.register(),
  ],
  controllers: [DeptController],
  providers: [DeptService],
  exports: [DeptService]
})
export class DeptModule {}
