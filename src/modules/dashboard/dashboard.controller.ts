import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { BASE_PREFIX_API } from 'src/config/constants';
import { ApiTags } from '@nestjs/swagger';

@Controller(`${BASE_PREFIX_API}/dashboard`)
export class DashboardController {
    constructor(
        private dashboardService: DashboardService,
    ) {}

    @ApiTags('dashboard')
    @Get('')
    async getRequestsForClient(
        @Query('status') status: string
    ) {
        return await this.dashboardService.getRequestsForClient(status);
    }
}
