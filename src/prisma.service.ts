import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log(`Database connection established successfully`);
        } catch (error) {
            this.logger.error(`Failed to establish a database connection`);
        }
    }
}
