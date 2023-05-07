import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

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
}
