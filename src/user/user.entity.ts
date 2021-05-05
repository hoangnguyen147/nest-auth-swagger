import { isNotEmpty, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt'


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    role: string;

    @BeforeInsert()
    async beforeInsert() {
        this._id = await uuid.v1();
        this.role = await 'user';
        this.password = await bcrypt.hash(this.password, 10);
    }

    async matchesPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

export class CreateUserInput {
    @IsString()
    @MinLength(6, {
        message: "Your username must be at least 6 characters"
    })
    @IsNotEmpty({ message: "Your username can not be blank" })
    username: string;

    @IsString()
    @MinLength(8, {
        message: "Your password must be at least 8 characters"
    })
    @IsNotEmpty({ message: "Your password can not be blank" })
    password: string;

    @IsString()
    @Length(6, 24)
    name: string;
}

export class LoginUserInput {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class LoginReponse {
    @IsString()
    token: string;
}

