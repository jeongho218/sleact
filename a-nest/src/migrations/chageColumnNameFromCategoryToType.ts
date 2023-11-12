import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699769430697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // up에는 수행할 내용이 들어간다
    // 예시
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // down에는 수행하기 전, 혹은 수행된 내용을 롤백할 내용이 들어간다
    // 예시
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
