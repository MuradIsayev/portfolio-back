import { Seeder } from 'nestjs-seeder';
import { DataSource, Repository } from 'typeorm';

export abstract class BasicSeeder<T> implements Seeder {
  protected constructor(
    protected readonly dataSource: DataSource,
    protected readonly repository: Repository<T>,
    private readonly name: string,
  ) {}

  abstract create_data(): Promise<T[]> | T[];

  async seed() {
    const data: T[] = await this.create_data();
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      await runner.manager.save(data);
      await runner.commitTransaction();
    } catch (err) {
      console.error(`Error at ${this.name} seeder`);
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
  }

  async drop(): Promise<any> {
    return this.repository.createQueryBuilder('table').delete().execute();
  }
}
