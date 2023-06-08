import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkScheduleSeeder } from './database/seeders/work-schedule.seeder';
import { WorkSchedule } from './work-schedule/entities/work-schedule.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { seeder } from 'nestjs-seeder';
import { config } from './config/config';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([WorkSchedule]),
  ],
}).run([WorkScheduleSeeder]);
