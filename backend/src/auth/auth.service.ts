import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(username: string, password: string, mentor: boolean = false) {
    const exists = await this.userModel.findOne({ username });
    if (exists) throw new Error('Username already exists');
    const user = new this.userModel({ username, password, mentor });
    await user.save();
    return { username: user.username, mentor: user.mentor };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }
    return { username: user.username, mentor: user.mentor };
  }
}