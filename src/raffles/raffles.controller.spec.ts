import { Test, TestingModule } from '@nestjs/testing';
import { RafflesController } from './raffles.controller';
import { RafflesService } from './raffles.service';

describe('RafflesController', () => {
  let controller: RafflesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RafflesController],
      providers: [RafflesService],
    }).compile();

    controller = module.get<RafflesController>(RafflesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
