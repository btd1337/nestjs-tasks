import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	username: string;

	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			// tslint:disable-next-line: max-line-length
			'The password must contain at least 8 characters: including at least one uppercase letter, one lowercase letter, and one special character.',
	})
	password: string;
}
