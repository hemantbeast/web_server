import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { mockedUser, mockedUsers } from './mock/user.mock';
import { MESSAGE } from '../../utils/constants.util';

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
      const mockedData = {
        data: true,
        message: MESSAGE.USER_ADDED_SUCCESS,
        success: true,
      };

      model.create.mockResolvedValueOnce(mockedData as any);

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
      const mockedData = {
        data: mockedUsers,
        message: MESSAGE.SUCCESS,
        success: true,
      };

      model.find.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockedUsers),
      } as any);

      const result = await service.getUsers();

      expect(result).toEqual(mockedData);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const id = new Types.ObjectId().toString();

      const mockedData = {
        data: mockedUser(id),
        message: MESSAGE.SUCCESS,
        success: true,
      };

      model.findOne.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockedUser(id)),
      } as any);

      const result = await service.getUserById(id);

      expect(result).toEqual(mockedData);
      expect(model.findOne).toHaveBeenCalledWith({ _id: id });
    });
  });

  describe('update', () => {
    it('should update a single user', async () => {
      const id = new Types.ObjectId().toString();

      const mockedData = {
        data: true,
        message: MESSAGE.USER_UPDATED_SUCCESS,
        success: true,
      };

      model.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockedUser(id)),
      } as any);

      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = await service.updateUser(id, updateUserDto);

      expect(result).toEqual(mockedData);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: id },
        updateUserDto,
        { new: true },
      );
    });
  });
});
