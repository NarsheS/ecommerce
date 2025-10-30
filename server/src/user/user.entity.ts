import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column({ unique: true })
    username: string;


    @Column({ unique: true })
    email: string;


    @Column()
    password: string; // armazenamos o hash completo (contém salt)


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;
}