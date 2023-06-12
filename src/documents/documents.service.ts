import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { basename, join } from 'path';

@Injectable()
export class DocumentsService {
  constructor() {}

  async uploadCV(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found!');
    } else {
      return true;
    }
  }

  fileExists(filePath: string): boolean {
    try {
      return existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  async downloadCV(fileName: string) {
    {
      const sanitizedFilename = basename(fileName);
      const filePath = join(process.cwd(), 'uploads', sanitizedFilename);

      if (!this.fileExists(filePath)) {
        throw new NotFoundException('File not found!');
      }

      const file = createReadStream(filePath);
      return new StreamableFile(file);
    }
  }
}
