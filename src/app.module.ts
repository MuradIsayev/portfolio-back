import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { GithubStrategy } from './github.strategy';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath:'.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ProjectsModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GithubStrategy],
})
export class AppModule {}
