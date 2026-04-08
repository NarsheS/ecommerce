import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreSettings } from "./store-settings.entity";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { Address } from "../address/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StoreSettings, Address])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}