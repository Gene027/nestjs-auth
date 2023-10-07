import { Test, TestingModule } from '@nestjs/testing';
import { CorporateUserController } from './corporate-user.controller';

describe('CorporateUserController', () => {
  let controller: CorporateUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateUserController],
    }).compile();

    controller = module.get<CorporateUserController>(CorporateUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
