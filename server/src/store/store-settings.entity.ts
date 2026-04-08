import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Address } from "../address/address.entity";

@Entity()
export class StoreSettings {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn()
  shippingOrigin: Address;
}