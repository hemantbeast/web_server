import { Types } from 'mongoose';

export const mockedUser = (id: string) => ({
  _id: id,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  phoneNumber: '12345678',
});

export const mockedUsers = [
  {
    _id: new Types.ObjectId().toString(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    phoneNumber: '12345678',
  },
  {
    _id: new Types.ObjectId().toString(),
    firstName: 'Test',
    lastName: 'Name',
    email: 'test.name@example.com',
    username: 'testName',
    phoneNumber: '12345678',
  },
];
