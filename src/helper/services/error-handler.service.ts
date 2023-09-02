import {
  BadRequestException,
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

  public handleNotFoundException(entity: any, entityName: string) {
    if (!entity) {
      throw new NotFoundException({
        code: 'ER_NOT_FOUND',
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
}
