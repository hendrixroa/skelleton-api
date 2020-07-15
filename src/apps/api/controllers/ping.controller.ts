import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PingService, Status } from '@/services/ping.service';

import { Roles, RolesGuard } from '@/apps/api/guards/roles.guard';
import { Authorization } from '@/apps/api/guards/authorization.guard';

@ApiTags('Ping')
@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Status response',
    type: Status,
  })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @Roles('Admin', 'User', 'Finance')
  @UseGuards(Authorization, RolesGuard)
  @ApiSecurity('api_key', ['api_key'])
  getStatus(): Status {
    return this.pingService.getPingStatus();
  }
}
