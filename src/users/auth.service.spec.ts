import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";


describe('AuthService', () => {
  let service: AuthService
  let fakeUserService: Partial<UsersService>

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = []
    fakeUserService = {
      find: (email: string) => {
        const filterUsers = users.filter(user => user.email === email)
        return Promise.resolve(filterUsers)
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }


    const module = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService
        }
      ],
    }).compile()
    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })
  it('create a new user with slated and hashed password', async () => {
    const user = await service.signup("tan@gmail.com", "123")

    expect(user.password).not.toEqual("123")
    const [salt, hash] = user.password.split(".")
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throw an error if user signs up with exist email', async () => {
    // fakeUserService.find = () => Promise.resolve([{ id: 1, email: "tan@gmail.com", password: "123" } as User])
    await service.signup('tan@gmail.com', "abc")
    await expect(service.signup('tan@gmail.com', "abc")).
      rejects.toThrow(BadRequestException)
  })

  it('throw error if user not found', async () => {

    await expect(service.signin('tan111@gmail.com', '123')).
      rejects.toThrow(NotFoundException)
  })

  it('throw error if password not match', async () => {
    // fakeUserService.find = () => Promise.resolve([{ email: "tan@gmail.com", password: "123" } as User])
    await service.signup('tan@gmail.com', 'aba')
    await expect(service.signin('tan@gmail.com', 'abad')).
      rejects.toThrow(BadRequestException)
  })

  it('return user if password is correct', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: "tan@gmail.com",
    //       password: '7efdbdcba0f8076d.854750991dba3f26641fdad7fd5bf4cee585200fc530075458ca2c7b8db56a7b'
    //     } as User
    //   ])
    await service.signup("tan@gmail.com", "123")
    const user = await service.signin("tan@gmail.com", "123")
    expect(user).toBeDefined()
  })


})
