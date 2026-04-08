import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreSettings } from "./store-settings.entity";
import { Address } from "../address/address.entity";
import { UpdateStoreAddressDto } from "./dto/update-store-address.dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreSettings)
    private storeRepo: Repository<StoreSettings>,

    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) {}

  async getSettings(): Promise<StoreSettings> {
    let settings = await this.storeRepo.findOne({ where: {} });

    if (!settings) {
      settings = this.storeRepo.create();
      await this.storeRepo.save(settings);
    }

    return settings;
  }

  async updateAddress(dto: UpdateStoreAddressDto): Promise<StoreSettings> {
    let settings = await this.getSettings();

    let address = settings.shippingOrigin;

    if (!address) {
      address = this.addressRepo.create(dto);
    } else {
      Object.assign(address, dto);
    }

    await this.addressRepo.save(address);

    settings.shippingOrigin = address;

    return this.storeRepo.save(settings);
  }
}