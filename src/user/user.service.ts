import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User, CreateUserInput, LoginReponse, LoginUserInput } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>

    ) { }

    async findById(_id: number): Promise<User> {
        return await this.userRepository.findOne({ _id })
    }

    async create(input: CreateUserInput): Promise<User> {
        const {username, password} = input;
        const exitedUser = await this.userRepository.findOne({username});
        if(exitedUser) {
            throw new Error("Username has already been taken");
        }

        const user = new User();
        user.username = username;
        user.password = password;
        return await this.userRepository.save(user);
    }

    async login(input: LoginUserInput): Promise<LoginReponse> {
        const {username, password} = input;
        const user = await this.userRepository.findOne({username});
        
        if(!user || !(await user.matchesPassword(password))) {
            throw new Error("Login fail")
        }
    }
}
