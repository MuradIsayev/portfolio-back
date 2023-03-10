import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';

class SkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl(undefined, { message: 'GitHub URL is not valid.' })
  url: string;

  @Type(() => SkillDto)
  @ValidateNested({ each: true })
  skills: SkillDto[];
}
