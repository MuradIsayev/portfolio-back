import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    blockId: string;
}
