import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Products{
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    description: string

    @Column({ default: 0 })
    inStock: number

    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Definindo para valores, basicamente...
    price: number

    @Column()
    category: string

    @CreateDateColumn()
    createdAt: Date;
    
    
    @UpdateDateColumn()
    updatedAt: Date;
}