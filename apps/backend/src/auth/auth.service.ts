import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse } from '@tms/shared-types/src/generated/types.gen';
import type { StringValue } from "ms";

interface JwtPayload {
    sub: string;
}

const JWT_ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES ?? '15m') as StringValue;

@Injectable()
export class AuthService {
    private readonly accessTokenOptions: JwtSignOptions = {
        expiresIn: JWT_ACCESS_EXPIRES,
    };

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async register(email: string, password: string): Promise<AuthResponse> {
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists) {
            throw new ConflictException('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 6);

        const user = await this.prisma.user.create({
            data: { email, passwordHash },
        });

        return this.buildAuthResponse(user);
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.buildAuthResponse(user);
    }

    async refresh(userId: string | undefined) {
        if (!userId) {
            throw new UnauthorizedException('Invalid user');
        }
        return this.buildAccessToken({ sub: userId });
    }

    private buildAuthResponse(user): AuthResponse {
        const payload: JwtPayload = { sub: user.id };

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            accessToken: this.jwt.sign(payload, this.accessTokenOptions),
        };
    }

    private buildAccessToken(payload: JwtPayload) {
        return {
            accessToken: this.jwt.sign(payload, this.accessTokenOptions),
        };
    }
}
