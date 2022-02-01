import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/role.enum';
import { User } from '../user/user.entity';
import { status } from '../../shared/entity-status.enum';
import { AuthRepository } from './auth.repository';
import { LoggedInDto, SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';
import { CredentialsInUse } from './exception/credentialsInUse.exception';
import { UserNotFoundException } from '../user/exception/userNotFound.exception';
import { WrongCredentials } from './exception/wrongCredentials.exception ';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private readonly _authRepository: AuthRepository,
        private readonly _jwtService: JwtService,
        ) {
        
    }

    async signup(signupDto: SignupDto): Promise<void> {
        const {username, email} = signupDto;
        const userExists = await this._authRepository.findOne({where: [{username}, {email}]});

        if (userExists) {
            throw new CredentialsInUse();
        }

        return this._authRepository.signup(signupDto);
    }

    async signin(signinDto: SigninDto): Promise<LoggedInDto> {
        const {username, password} = signinDto;
        const user: User = await this._authRepository.findOne({where: {username, status: status.ACTIVE}});

        if (!user) {
            throw new WrongCredentials();
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new WrongCredentials();
        }

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(role => role.name as RoleType)
        }

        const token = this._jwtService.sign(payload);
        return plainToClass(LoggedInDto, {token, user});
    }
}
