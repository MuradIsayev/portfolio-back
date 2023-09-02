import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), HelperModule],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
