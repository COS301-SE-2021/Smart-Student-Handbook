import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test registerUser
  describe('registerUser' , ()=>{
    describe('The user will enter their details' , ()=>{
      it('If all user details are entered correctly the user will be registered' , async()=>{

      })
    })
  })

});
