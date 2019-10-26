import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
	let user: User;

	beforeEach(() => {
		user = new User();
		user.salt = 'testSalt';
		user.password = 'testPassword';
	});

	afterEach(() => {
		// not.toHaveBeenCalled() not be influenced by the previous test
		jest.spyOn(bcrypt, 'hash').mockClear();
	});

	describe('Validate Password', () => {
		it('should returns true as password is valid', async () => {
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('testPassword');
			expect(bcrypt.hash).not.toHaveBeenCalled();
			const result = await user.validatePassword('123456');
			expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
			expect(result).toEqual(true);
		});

		it('should returns false as password is invalid', async () => {
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('wrongPassword');
			expect(bcrypt.hash).not.toHaveBeenCalled();
			const result = await user.validatePassword('123456');
			expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
			expect(result).toEqual(false);
		});
	});
});
