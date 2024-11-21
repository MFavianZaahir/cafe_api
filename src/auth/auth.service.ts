import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const { password, ...result } = user; // Exclude password from the returned user
      return result;
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  async login(loginDto: LoginUserDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);

    const payload = {
      username: user.username,
      sub: user.id_user,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(username: string, password: string, role: Role) { // Use Role type here
    const hashedPassword = await bcrypt.hash(password, 10);
  
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role, // This will now match the Prisma enum type
        name: username, // Adjust as needed
      },
    });
  }
}
