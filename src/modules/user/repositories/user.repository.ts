// Nest js
import { Injectable } from '@nestjs/common';

// Lub
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Entities
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createOne(data: Partial<User>): Promise<UserDocument> {
    return await this.userModel.create(data);
  }

  async getOne(filter: object): Promise<UserDocument | null> {
    return await this.userModel.findOne(filter).exec();
  }

  async getMany(filter: object = {}): Promise<UserDocument[]> {
    return await this.userModel.find(filter).exec();
  }
}
