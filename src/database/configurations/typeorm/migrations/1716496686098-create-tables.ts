import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateTables1716496686098 implements MigrationInterface {
  name = 'CreateTables1716496686098'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`books\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NOT NULL, \`isbn\` varchar(100) NOT NULL, \`published_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`authorId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_54337dc30d9bb2c3fadebc6909\` (\`isbn\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`authors\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`biography\` varchar(2000) NULL, \`birthdate\` timestamp NULL, UNIQUE INDEX \`IDX_0abaae55952d5f8f9f6bfd8737\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``,
    )
    await queryRunner.query(`DROP INDEX \`IDX_0abaae55952d5f8f9f6bfd8737\` ON \`authors\``)
    await queryRunner.query(`DROP TABLE \`authors\``)
    await queryRunner.query(`DROP INDEX \`IDX_54337dc30d9bb2c3fadebc6909\` ON \`books\``)
    await queryRunner.query(`DROP TABLE \`books\``)
  }
}
