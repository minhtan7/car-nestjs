import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUserService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>


  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => Promise.resolve({ id, email: "tan@gmail.com", password: "abc" } as User),
      find: (email: string) => Promise.resolve([{ id: 1, email: "tan@gmail.com", password: "abc" } as User]),
      // remove: (id: number) => Promise.resolve({ id, email: "tan@gmail.com", password: "abc" } as User),
      // update: (id: number, attrs: Partial<User>) => Promise.resolve({ id, email: "tan@gmail.com", password: "abc" } as User),
    }

    fakeAuthService = {
      // signup: (email: string, password: string) => Promise.resolve({ id: 1, email: "tan@gmail.com", password: "abc" } as User),
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with given emails', async () => {
    const users = await controller.findAllUsers("tan@gmail.com")
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual("tan@gmail.com")
  })

  it('findUser return a single user with given id', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })

  it('finduser throw error if user not found', async () => {
    fakeUserService.findOne = () => null
    await expect(controller.findUser('1')).
      rejects.toThrow(NotFoundException)
  })

  it('signin update session and return user', async () => {
    const session = { userId: -1 }
    const user = await controller.signin({ email: "tan@gmail.com", password: "abc" }, session)

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
