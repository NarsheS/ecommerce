import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartItem } from "./cart-item.entity";
import { Products } from "../products/products.entity";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { User } from "../user/user.entity";
import { PricingModule } from "../products/pricing/pricing.module";

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, Products, User]), PricingModule],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
})

export class CartModule {}