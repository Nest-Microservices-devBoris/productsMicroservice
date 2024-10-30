import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';              

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({ cmd: 'createProduct' })
  create(@Payload() createProductDto: CreateProductDto) {
    
    
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'findAll' })
  findAll(@Payload() paginationDto: PaginationDto) {
    
    return this.productsService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'findOne' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'updateProduct' })
  update(
    // @Param('id') id: string, 
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) 
  {
    
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'removeProduct' })
  remove(@Payload('id') id: number) {
    return this.productsService.remove(+id);
  }

  @MessagePattern({ cmd: 'validate_products'})
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
}
