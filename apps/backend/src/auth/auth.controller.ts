import {
    Controller,
    Post,
    Body,
    Res,
    Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.auth.register(dto.email, dto.password);
        if (!result?.id) return null;
        this.setRefreshCookie(res, result.id);
        return result;
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.auth.login(dto.email, dto.password);
        if (!result?.id) return null;
        this.setRefreshCookie(res, result.id);
        return result;
    }

    @Post('refresh')
    async refresh(@Req() req: Request) {
        const userId = req.cookies?.['refreshToken'] as string | undefined;
        return this.auth.refresh(userId);
    }

    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
    ) {
        res.clearCookie('refreshToken');
    }

    private setRefreshCookie(res: Response, userId: string) {
        res.cookie('refreshToken', userId, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        });
    }
}
