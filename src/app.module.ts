import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
	imports: [
		ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => config.get('database'),
			inject: [ConfigService],
		}),
		TasksModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
