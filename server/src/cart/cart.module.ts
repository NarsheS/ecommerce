import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartItem } from "./cart-item.entity";
import { Products } from "src/products/products.entity";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, Products])],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
})

export class CartModule {}