import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity("banners")
export class Banner {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Column()
  publicId: string

  @Column({ nullable: true })
  title?: string

  @Column({ type: 'text', nullable: true })
  link: string | null

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  order: number

  @CreateDateColumn()
  createdAt: Date
}