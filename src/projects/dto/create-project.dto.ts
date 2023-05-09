import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CreateSkillDto } from '../../skills/dto/create-skill.dto';


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

  @Type(() => CreateSkillDto)
  @ValidateNested({ each: true })
  skills: CreateSkillDto[];
}
