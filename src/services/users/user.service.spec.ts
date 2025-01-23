import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userModelMock = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let model: jest.Mocked<Model<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
    model = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should insert a user', async () => {
      const mockedUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@yopmail.com',
        password: 'P@ssw0rd',
        username: 'johndoe',
      };

      const mockedData = {
        data: true,
        message: 'Success',
        success: true,
      };

      model.create.mockResolvedValueOnce(mockedUser as any);

      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@yopmail.com',
        password: 'P@ssw0rd',
        username: 'johndoe',
      };
      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockedData);
      expect(model.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all user', async () => {
      const mockedUsers: User[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@yopmail.com',
          password: 'P@ssw0rd',
          username: 'johndoe',
          phoneNumber: '12345678',
        },
        {
          firstName: 'Test',
          lastName: 'Name',
          email: 'test.name@yopmail.com',
          password: 'P@ssw0rd',
          username: 'testName',
          phoneNumber: '12345678',
        },
      ];

      const mockedData = {
        data: mockedUsers,
        message: 'Success',
        success: true,
      };

      model.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedUsers),
      } as any);

      const result = await service.getUsers();

      expect(result).toEqual(mockedData);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const mockedUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@yopmail.com',
        password: 'P@ssw0rd',
        username: 'johndoe',
        phoneNumber: '12345678',
      };

      const mockedData = {
        data: mockedUser,
        message: 'Success',
        success: true,
      };

      model.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedUser),
      } as any);

      const id = new Types.ObjectId().toString();
      const result = await service.getUserById(id);

      expect(result).toEqual(mockedData);
      expect(model.findOne).toHaveBeenCalledWith({ _id: id });
    });
  });

  describe('update', () => {
    it('should update a single user', async () => {
      const id = new Types.ObjectId();

      const mockedUser = {
        _id: id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@yopmail.com',
        password: 'P@ssw0rd',
        username: 'johndoe',
        phoneNumber: '12345678',
      };

      const mockedData = {
        data: true,
        message: 'User profile updated successfully',
        success: true,
      };

      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedUser),
      } as any);

      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = await service.updateUser(id.toString(), updateUserDto);

      expect(result).toEqual(mockedData);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: id.toString() },
        updateUserDto,
        { new: true },
      );
    });
  });
});
