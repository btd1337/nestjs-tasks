import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Task } from './../tasks/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import * as bcrypt from 'bcrypt';

const mockCredentialsDto: AuthCredentialsDto = { username: 'test_user', password: 'test_password' };

const mockUser = new User();

describe('UserRepository', () => {
	let userRepository: UserRepository;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: ':memory:',
					synchronize: true,
					entities: [User, Task],
					keepConnectionAlive: true,
				}),
				TypeOrmModule.forFeature([UserRepository]),
			],
		}).compile();

		userRepository = await module.get<UserRepository>(UserRepository);
	});

	describe('signUp', () => {
		let save;

		beforeEach(() => {
			save = jest.fn();
			userRepository.create = jest.fn().mockReturnValue(mockUser);
		});

		it('successfully signs up the user', async () => {
			save.mockResolvedValue(undefined);
			await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
		});

		it('should throws a conflict exception as username already exists', async () => {
			const user: User = userRepository.create();
			user.save = jest.fn().mockRejectedValue({ code: 23505 });
			await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
				ConflictException,
			);
		});

		it('should throws a internal server error if not was able to create a user', async () => {
			const user: User = userRepository.create();
			user.save = jest.fn().mockRejectedValue({ code: 100 });
			await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});

	describe('Signin', () => {
		let user: User;

		beforeEach(() => {
			userRepository.findOne = jest.fn();

			user = new User('test_username', 'test_password');
			user.validatePassword = jest.fn();
		});
		it('should returns the username as validate is successful', async () => {
			jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(user, 'validatePassword').mockResolvedValue(true);
			const result = await userRepository.validateUserPassword(mockCredentialsDto);
			expect(result).toEqual(user.username);
		});

		it('should returns null as user cannot be found', async () => {
			jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
			const result = await userRepository.validateUserPassword(mockCredentialsDto);
			expect(user.validatePassword).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should returns null as password is invalid', async () => {
			jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(user, 'validatePassword').mockResolvedValue(false);
			const result = await userRepository.validateUserPassword(mockCredentialsDto);
			expect(user.validatePassword).toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	/* describe('hashPassword', () => {
		it('should calls bcrypt.hash to generate a hase', async () => {
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('testHash');
			// const result = await userRepository.hashPassword('testPassword', 'testSalt');
			expect(bcrypt.hash).toHaveBeenCalled();
			expect(result).toEqual('testHash');
		});
	}); */
});
