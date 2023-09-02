import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  public checkEntity(entity: any, entityName: string) {
    if (!entity) {
      throw new BadRequestException({
        code: 'ER_NO_ENTITY',
        message: `${entityName} not found`,
      });
    }
  }

  public checkEntityIsEmpty(entities: any, entityName: string) {
    if (!entities || !entities.length) {
      throw new BadRequestException({
        code: 'ER_NO_ENTITY',
        message: `${entityName} not found`,
      });
    }
  }

  public async checkDuplication(error: any, entityName: string) {
    //ToDo: Remove async
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ConflictException(`${entityName} already exists`);
    }

    throw new BadRequestException('Something went wrong');
  }

  public checkError(error: any, entityName: string) {
    const code = error?.code || error?.response?.code;

    switch (code) {
      case 'ER_DUP_ENTRY':
        throw new ConflictException(`${entityName} already exists`);
      case 'ER_NO_REFERENCED_ROW_2':
        throw new ConflictException(`${entityName} can't be a foreign key`);
      case 'ER_NO_ENTITY':
        throw new BadRequestException(
          error?.response?.message || `${entityName} not found`,
        );
      case 'ER_HAS_CHILDREN':
        throw new BadRequestException(
          error?.response?.message || `${entityName} has children entities`,
        );
      case 'ER_NOT_FOUND':
        throw new NotFoundException(
          error?.response?.message || `${entityName} not found`,
        );
      default:
        console.log(error);
        throw new BadRequestException('Something went wrong');
    }
  }
}
