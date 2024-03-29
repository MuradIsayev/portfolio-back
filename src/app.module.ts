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
import { BlogsModule } from './blogs/blogs.module';
import { ExperienceModule } from './experience/experience.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { DocumentsModule } from './documents/documents.module';
import { HelperModule } from './helper/helper.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env.development',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 1 minute
        limit: 20, // limit each IP to 20 requests per ttl
      },
    ]),
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
    HelperModule,
    ProjectsModule,
    SkillsModule,
    ChatModule,
    BlogsModule,
    ExperienceModule,
    WorkScheduleModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
