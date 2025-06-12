import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = jest.fn();
    mockUserModel.findOne = jest.fn();
    mockUserModel.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a normal user with mentor false', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.prototype.save.mockResolvedValue(undefined);

    const userObj: any = { username: 'testuser', password: 'testpass', mentor: false, save: jest.fn().mockResolvedValue(undefined) };
    mockUserModel.mockImplementation(() => userObj);

    const user = await service.register('testuser', 'testpass');
    expect(user).toEqual({ username: 'testuser', mentor: false });
    expect(userObj.save).toHaveBeenCalled();
  });

  it('should register a mentor user with mentor true', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.prototype.save.mockResolvedValue(undefined);

    const userObj: any = { username: 'mentoruser', password: 'mentorpass', mentor: true, save: jest.fn().mockResolvedValue(undefined) };
    mockUserModel.mockImplementation(() => userObj);

    const user = await service.register('mentoruser', 'mentorpass', true);
    expect(user).toEqual({ username: 'mentoruser', mentor: true });
    expect(userObj.save).toHaveBeenCalled();
  });

  it('should login and get mentor status', async () => {
    mockUserModel.findOne.mockResolvedValue({
      username: 'mentoruser',
      password: 'mentorpass',
      mentor: true,
    });
    const user = await service.login('mentoruser', 'mentorpass');
    expect(user).toEqual({ username: 'mentoruser', mentor: true });
  });

  it('should throw error for invalid login', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    await expect(service.login('nouser', 'nopass')).rejects.toThrow('Invalid username or password');
  });
});