import { Test, TestingModule } from '@nestjs/testing';
import { PasswordtokenController } from './passwordtoken.controller';
import { PasswordtokenService } from './passwordtoken.service';

describe('PasswordtokenController', () => {
  let controller: PasswordtokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordtokenController],
      providers: [PasswordtokenService],
    }).compile();

    controller = module.get<PasswordtokenController>(PasswordtokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
