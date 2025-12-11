import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiscountRule, DiscountType } from "./discount-rules.entity";
import { Products } from "../products.entity";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";

// Precisa disso pra aplicar os descontos
export interface ProductWithDiscount extends Products {
  finalPrice: number;
  appliedDiscount: number;
}

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(DiscountRule)
        private discountRuleRepo: Repository<DiscountRule>,
    ) {}

    // CREATE - Cria uma nova regra de desconto
    async createDiscountRule(data: CreateDiscountDto) {
        if (data.startsAt) {
            data.startsAt = new Date(data.startsAt) as any;
        }

        if (data.endsAt) {
            data.endsAt = new Date(data.endsAt) as any;
        }

        if (data.priceMin) {
            data.priceMin = Number(data.priceMin);
        }

        if (data.discountPercentage) {
            data.discountPercentage = Number(data.discountPercentage);
        }

        // Validações específicas
        switch (data.type) {
            case DiscountType.CATEGORY:
                if (!data.categoryId) {
                    throw new NotFoundException('categoryId is required when type is CATEGORY');
                }
                break;

            case DiscountType.PRODUCT:
                if (!data.productId) {
                    throw new NotFoundException('productId is required when type is PRODUCT');
                }
                break;

            case DiscountType.PRICE_MIN:
                if (!data.priceMin) {
                    throw new NotFoundException('priceMin is required when type is PRICE_MIN');
                }
                break;

            case DiscountType.GLOBAL:
                break;
        }

        const rule = this.discountRuleRepo.create(data);
        return await this.discountRuleRepo.save(rule);
    }

    // CALC - Aplica automaticamente o melhor desconto válido ao produto.
    async applyAutomaticDiscount(product: Products): Promise<ProductWithDiscount> {
        const rules = await this.discountRuleRepo.find({
            where: { active: true },
        });

        let bestDiscount = 0;
        const now = Date.now();

        for (const rule of rules) {
            if (rule.startsAt && now < rule.startsAt.getTime()) continue;
            if (rule.endsAt && now > rule.endsAt.getTime()) continue;

            switch (rule.type) {
                case DiscountType.CATEGORY:
                    if (product.category?.id === rule.categoryId) {
                        bestDiscount = Math.max(bestDiscount, Number(rule.discountPercentage));
                    }
                    break;

                case DiscountType.PRODUCT:
                    if (product.id === rule.productId) {
                        bestDiscount = Math.max(bestDiscount, Number(rule.discountPercentage));
                    }
                    break;

                case DiscountType.PRICE_MIN:
                    if (rule.priceMin && product.price >= rule.priceMin) {
                        bestDiscount = Math.max(bestDiscount, Number(rule.discountPercentage));
                    }
                    break;

                case DiscountType.GLOBAL:
                    bestDiscount = Math.max(bestDiscount, Number(rule.discountPercentage));
                    break;
            }
        }

        const originalPrice = product.price;
        const finalPrice = originalPrice - (originalPrice * bestDiscount / 100);

        // ✔ Não cria novo objeto — anexa à entidade
        (product as any).appliedDiscount = bestDiscount;
        (product as any).finalPrice = Number(finalPrice.toFixed(2));

        return product as ProductWithDiscount; // retorna ENTIDADE, NÃO novo objeto
    }

    // GET - Lista todas as regras de desconto
    async findAll() {
        return await this.discountRuleRepo.find({
            order: { id: 'ASC' },
        });
    }

    // UPDATE - Atualiza uma regra existente
    async updateDiscountRule(id: number, data: UpdateDiscountDto) {
        const rule = await this.discountRuleRepo.findOne({ where: { id } });
        if (!rule) {
            throw new NotFoundException(`Discount rule with ID ${id} not found`);
        }

        // Criar um objeto separado para conversões
        const updateData: any = { ...data };

        // Conversões manuais sem alterar o DTO
        if (data.startsAt) {
            updateData.startsAt = new Date(data.startsAt);
        }

        if (data.endsAt) {
            updateData.endsAt = new Date(data.endsAt);
        }

        if (data.priceMin !== undefined) {
            updateData.priceMin = Number(data.priceMin);
        }

        if (data.discountPercentage !== undefined) {
            updateData.discountPercentage = Number(data.discountPercentage);
        }

        // Aplicar no entity
        Object.assign(rule, updateData);

        return await this.discountRuleRepo.save(rule);
    }

    // DELETE - Remove uma regra de desconto
    async deleteDiscountRule(id: number) {
        const rule = await this.discountRuleRepo.findOne({ where: { id } });

        if (!rule) {
            throw new NotFoundException(`Discount rule with ID ${id} not found`);
        }

        await this.discountRuleRepo.remove(rule);

        return {
            message: 'Discount rule deleted successfully',
            deletedId: id,
        };
    }
}
