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
import { NotionModule } from 'nestjs-notion';
import { BlogsModule } from './blogs/blogs.module';

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
    NotionModule.forRoot({
      auth: 'secret_Ooy09BQepK2ewbBIBTjWlC5BU2vLVa6ivuMJPaJUrx2',
    }),
    ProjectsModule,
    SkillsModule,
    ChatModule,
    TerminusModule,
    RedisHealthModule,
    BlogsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
