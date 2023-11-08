import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHashingService } from './passwordHashing.service';

describe('PasswordService', () => {
  let service: PasswordHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashingService],
    }).compile();

    service = module.get<PasswordHashingService>(PasswordHashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
