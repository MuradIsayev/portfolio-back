import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { WorkScheduleService } from './work-schedule.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';

@Controller('work-schedule')
export class WorkScheduleController {
  constructor(private readonly workScheduleService: WorkScheduleService) {}

  @Post()
  create(@Body() createWorkScheduleDto: CreateWorkScheduleDto) {
    return this.workScheduleService.create(createWorkScheduleDto);
  }

  @Get()
  findAll() {
    return this.workScheduleService.findAll();
  }
}
