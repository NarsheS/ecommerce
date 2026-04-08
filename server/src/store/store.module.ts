import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreSettings } from "./store-settings.entity";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { Address } from "../address/address.entity";
import { ShippingService } from "./shipping.service";
import { ShippingController } from "./shipping.controller";

@Module({
  imports: [TypeOrmModule.forFeature([StoreSettings, Address])],
  controllers: [StoreController, ShippingController],
  providers: [StoreService, ShippingService],
  exports: [ShippingService],
})
export class StoreModule {}