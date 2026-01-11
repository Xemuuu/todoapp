import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('auth')
@ApiSecurity('api-key')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User registered successfully',
        user: {
          id: 1,
          email: 'john@example.com',
          created_at: '2026-01-08T06:57:23.000Z',
          updated_at: '2026-01-08T06:57:23.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful, returns user data',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 1,
          email: 'john@example.com',
          created_at: '2026-01-08T06:57:23.000Z',
          updated_at: '2026-01-08T06:57:23.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
