import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator/types/decorator/decorators";

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
