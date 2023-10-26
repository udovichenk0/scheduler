import { UserDto } from './../../user/dto/user.dto';
export declare class JWTService {
    signToken(userData: UserDto): Promise<string>;
    verifyToken(token: string): Promise<any>;
}
