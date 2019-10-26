export default {
	type: process.env.TYPEORM_TYPE || 'postgres',
	host: process.env.TYPEORM_HOST,
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	port: Number(process.env.TYPEORM_PORT),
	synchronize: process.env.TYPEORM_SYNCHRONIZE,
	entities: [__dirname + '/../**/*.entity.{ts,js}'],
	migrations: [__dirname + '/migrations/*.{ts,js}'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};
