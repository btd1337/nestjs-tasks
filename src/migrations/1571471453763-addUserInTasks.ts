import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserInTasks1571471453763 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(`ALTER TABLE "task" ADD "userId" integer NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`,
		);
		await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "userId"`);
	}
}
