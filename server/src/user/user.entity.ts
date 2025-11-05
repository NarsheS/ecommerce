import { Address } from 'src/address/address.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


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

    @OneToMany(() => Address, address => address.user, { cascade: true })
    adresses: Address[];
}