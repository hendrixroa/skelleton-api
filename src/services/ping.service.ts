import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AuthContext, AuthService } from '@/services/auth.service';

export class Status {
  @ApiProperty({ example: 'OK', description: 'Status Response' })
  status: string;
}

@Injectable()
export class PingService {
  constructor(
    private readonly authContext: AuthContext,
    private readonly authService: AuthService,
  ) {}

  getPingStatus(user?: AuthContext): Status {
    return { status: 'OK' };
  }
}
