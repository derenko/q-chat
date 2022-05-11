import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { GetCurrentUser } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('/local/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-tokens')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUser() user) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser() user) {
    return this.authService.getMe(user.id);
  }
}
