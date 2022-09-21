import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1729707355853 implements MigrationInterface {
  name = 'InitDatabase1729707355853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` bigint NOT NULL AUTO_INCREMENT,
                               \`name\` enum ('SUPER_ADMIN', 'ADMIN', 'USER') NOT NULL,
                               \`createdBy\` bigint NOT NULL,
                               \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
                               \`updatedBy\` bigint NULL, 
                               \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
                               PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`userRoles\` (\`id\` bigint NOT NULL AUTO_INCREMENT,
                                   \`userId\` bigint NOT NULL,
                                   \`roleId\` bigint NOT NULL,
                                   \`createdBy\` bigint NOT NULL, 
                                   \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
                                   \`updatedBy\` bigint NULL, 
                                   \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
                                   PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT,
                               \`username\`  varchar(255) NOT NULL,
                               \`password\`  varchar(255) NOT NULL,
                               \`name\`      varchar(255) NOT NULL,
                               \`activated\` tinyint      NOT NULL DEFAULT 1,
                               \`createdBy\` bigint NOT NULL, 
                               \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
                               \`updatedBy\` bigint NULL, 
                               \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
                               UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), 
                               PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` ADD CONSTRAINT \`FK_fdf65c16d62910b4785a18cdfce\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` ADD CONSTRAINT \`FK_5760f2a1066eb90b4c223c16a10\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` DROP FOREIGN KEY \`FK_5760f2a1066eb90b4c223c16a10\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` DROP FOREIGN KEY \`FK_fdf65c16d62910b4785a18cdfce\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`userRoles\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
