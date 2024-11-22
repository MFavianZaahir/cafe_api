import { Test, TestingModule } from '@nestjs/testing';
import { MejaService } from './meja.service';

describe('MejaService', () => {
  let service: MejaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MejaService],
    }).compile();

    service = module.get<MejaService>(MejaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
