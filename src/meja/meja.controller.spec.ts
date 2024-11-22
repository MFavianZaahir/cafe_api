import { Test, TestingModule } from '@nestjs/testing';
import { MejaController } from './meja.controller';

describe('MejaController', () => {
  let controller: MejaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MejaController],
    }).compile();

    controller = module.get<MejaController>(MejaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
