import {
  DataSource,
  EntityManager,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

export function EntityManagerMockFactory() {
  return createMock<EntityManager>();
}

export let ManagerMock: DeepMocked<EntityManager> = EntityManagerMockFactory();

function transactionCallback(cb) {
  return cb(ManagerMock);
}

export function QueryRunnerMockFactory() {
  ManagerMock = EntityManagerMockFactory();
  return createMock<QueryRunner>({
    manager: ManagerMock,
  });
}

export let QueryRunnerMock: DeepMocked<QueryRunner> = QueryRunnerMockFactory();

export function DataSourceMockFactory(): DeepMocked<DataSource> {
  QueryRunnerMock = QueryRunnerMockFactory();
  return createMock<DataSource>({
    createQueryRunner: jest.fn().mockImplementation(() => QueryRunnerMock),
    transaction: jest.fn().mockImplementation(transactionCallback),
  });
}

export function universalMocker(token: unknown): any {
  if (typeof token === 'function') {
    if (token === DataSource) {
      return DataSourceMockFactory();
    }
    return createMock(token);
  }
  return createMock<Repository<any>>({}, { name: `${token}` });
}

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<ObjectLiteral>;
};

export function RepositoryMockFactory<T>(): MockType<Repository<T>> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  } as MockType<Repository<T>>;
}

export function ServiceMockFactory<T>(): MockType<T> {
  return {} as MockType<T>;
}
