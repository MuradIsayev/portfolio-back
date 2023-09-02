import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

const maxFileSize = 1024 * 1024 * 5; // 5MB
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-cv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${fileName}-${newFileName}.${fileExtension}`);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(pdf)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only pdf files are allowed!'), false);
        }
      },

      limits: {
        fileSize: maxFileSize,
      },

      preservePath: true,
    }),
  )
  async uploadCV(@UploadedFile() file: Express.Multer.File) {
    return await this.documentsService.uploadCV(file);
  }

  @Get('my-cv/:filename')
  async downloadCV(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.documentsService.downloadCV(filename);
  }
}
