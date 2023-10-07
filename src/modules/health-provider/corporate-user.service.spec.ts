import { Test, TestingModule } from '@nestjs/testing';
import { CorporateUserService } from './corporate-user.service';

describe('CorporateUserService', () => {
  let service: CorporateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorporateUserService],
    }).compile();

    service = module.get<CorporateUserService>(CorporateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
