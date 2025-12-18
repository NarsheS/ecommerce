import { User } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Address {
    // ID
    @PrimaryGeneratedColumn()
    id: number;

    // Rua
    @Column()
    street: string;

    // Número
    @Column()
    number: string;

    // Cidade
    @Column()
    city: string;

    // Estado
    @Column()
    state: string;

    // Código postal
    @Column()
    zipcode: string;

    // Caso o usuário seja deletado, também deleta seus endereços
    @ManyToOne(() => User, user => user.addresses, { onDelete: 'CASCADE' })
    user: User;
}