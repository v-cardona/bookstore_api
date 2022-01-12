import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoggedInDto, SigninDto, SignupDto } from './dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {

    constructor(private readonly _authService: AuthService) {}

    @Post('signup')
    @UsePipes(ValidationPipe)
    @ApiConflictResponse({ description: 'Username or email already exists' })
    @ApiCreatedResponse({ description: 'User created',})
    async signup(@Body() signupDto: SignupDto): Promise<void> {
        return this._authService.signup(signupDto);
    }
    
    @Post('signin')
    @UsePipes(ValidationPipe)
    @ApiNotFoundResponse(({ description: 'User not found',}))
    @ApiUnauthorizedResponse({ description: 'Invalid credentials',})
    @ApiCreatedResponse({ description: 'User logged', type: LoggedInDto})
    async signin(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
        return this._authService.signin(signinDto);
    }
}
