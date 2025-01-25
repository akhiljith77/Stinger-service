import { Test, TestingModule } from '@nestjs/testing';
import { EmailServiceService } from './email-service.service';

describe('EmailServiceService', () => {
  let service: EmailServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailServiceService],
    }).compile();

    service = module.get<EmailServiceService>(EmailServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
