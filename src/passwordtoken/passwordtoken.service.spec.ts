import { Test, TestingModule } from '@nestjs/testing';
import { PasswordtokenService } from './passwordtoken.service';

describe('PasswordtokenService', () => {
  let service: PasswordtokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordtokenService],
    }).compile();

    service = module.get<PasswordtokenService>(PasswordtokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
