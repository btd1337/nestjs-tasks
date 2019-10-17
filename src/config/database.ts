export default {
	type: process.env.TYPEORM_TYPE || 'postgres',
	host: process.env.TYPEORM_HOST,
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	port: Number(process.env.TYPEORM_PORT),
	entities: [process.env.TYPEORM_ENTITIES || 'src/**/*.entity.ts'],
	synchronize: process.env.TYPEORM_SYNCHRONIZE,
	migrations: [process.env.TYPEORM_MIGRATIONS || 'src/migrations/*.ts'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};
