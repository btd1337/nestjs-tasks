import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing/test';
import { User } from './user.entity';
const mockUserRepository = () => ({
	findOne: jest.fn(),
});

describe('JWTStrategy', () => {
	let jwtSTrategy: JwtStrategy;
	let userRepository: UserRepository;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepository }],
		}).compile();

		jwtSTrategy = await module.get<JwtStrategy>(JwtStrategy);
		userRepository = await module.get<UserRepository>(UserRepository);
	});

	describe('validate', () => {
		it('should validates and returns the user based on JWT payload', async () => {
			const user = new User();
			user.username = 'TestUser';

			jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
			const result = await jwtSTrategy.validate({ username: 'TestUser' });
			expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
			expect(result).toEqual(user);
		});

		it('should throws an unauthorized exception as user cannot be found', async () => {
			jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
			expect(jwtSTrategy.validate({ username: 'TestUser' })).rejects.toThrowError(
				UnauthorizedException,
			);
		});
	});
});
