import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { CreateTagDto } from "../../tags/dto/create-tag.dto";

export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    blockId!: string;

    @MaxLength(260)
    @MinLength(90)
    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    minsRead!: number;

    @Type(() => CreateTagDto)
    @ValidateNested({ each: true })
    tags!: CreateTagDto[];
}
