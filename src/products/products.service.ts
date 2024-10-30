import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger =  new Logger('ProductsService');


  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to database');
  }



  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({where: {available: true}});
    const lastPage = Math.ceil(totalPages / limit);

    if (page > lastPage) {
      return 'Page number is out of range';
    }


    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {available: true},
      }),
      meta: {
        total: totalPages,
        currentPage: page,
        lastPage: lastPage,
      },
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      }
    });

    if (!product) {
      throw new RpcException( {
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  //todo: implement try-catch for id not found
  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id: __, ...data} = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: {id},
      data: data,
    });
  }

  async remove(id: number) {

    await this.findOne(id)

    // return this.product.delete({
    //   where: {id}
    // });

    return this.product.update({
      where: {id},
      data: {
        available: false,
      },
    })
  }

  async validateProducts(ids: number[]) {

    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
        //available: true,
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException( {
        message: 'Some of the products are not available',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}