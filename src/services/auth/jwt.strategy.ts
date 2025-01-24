import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGE } from '../../utils/constants.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY') as string,
    });
  }

  async validate(payload: JSON): Promise<any> {
    const id: string = payload['id'] as string;
    const user: User | null = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException({ message: MESSAGE.ACCESS_DENIED });
    }
    return user;
  }
}
