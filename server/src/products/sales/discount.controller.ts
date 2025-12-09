import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/user/user.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // POST - Criar nova regra
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() data: CreateDiscountDto) {
    return this.discountService.createDiscountRule(data);
  }

  // GET - Listar todas as regras
  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  // PUT - Atualizar regra
  @Put(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDiscountDto,
  ) {
    return this.discountService.updateDiscountRule(id, data);
  }

  // DELETE - Remover regra
  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.deleteDiscountRule(id);
  }
}
