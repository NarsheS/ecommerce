import { Controller, Get, Put, Body } from "@nestjs/common";
import { StoreService } from "./store.service";
import { UpdateStoreAddressDto } from "./dto/update-store-address.dto";
import { Roles } from "../common/roles/roles.decorator";
import { Role } from "../user/user.entity";

@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("settings")
  getSettings() {
    return this.storeService.getSettings();
  }

  @Put("address")
  @Roles(Role.ADMIN)
  updateAddress(@Body() dto: UpdateStoreAddressDto) {
    return this.storeService.updateAddress(dto);
  }
}