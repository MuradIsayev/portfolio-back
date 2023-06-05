import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { BlogsModule } from './blogs/blogs.module';
import { TagsModule } from './tags/tags.module';
import { ExperienceModule } from './experience/experience.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env.development',
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          config: configService.get('redis'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ProjectsModule,
    SkillsModule,
    ChatModule,
    TerminusModule,
    RedisHealthModule,
    BlogsModule,
    TagsModule,
    ExperienceModule,
    WorkScheduleModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
