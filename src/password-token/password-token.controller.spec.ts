import { Test, TestingModule } from '@nestjs/testing';
import { PasswordTokenController } from './password-token.controller';
import { PasswordTokenService } from './password-token.service';

describe('PasswordTokenController', () => {
  let controller: PasswordTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordTokenController],
      providers: [PasswordTokenService],
    }).compile();

    controller = module.get<PasswordTokenController>(PasswordTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
