import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, FilterProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productConnection: Repository<Products>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  create(createProductDto: CreateProductDto) {
    try {
      return this.productConnection.save(createProductDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(filterDto?: FilterProductsDto) {
    try {
      const {
        search,
        category,
        maxPrice,
        minPrice,
        limit = 5,
        page = 1,
      } = filterDto;

      const productCacheKey = `product-key:search=${search || ''}&category=${category || ''}&minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&page=${page}&limit=${limit}`;

      const cachedProducts: any = await this.cacheManager.get(productCacheKey);

      if (cachedProducts) {
        return cachedProducts;
      }

      const queryBuilder =
        this.productConnection.createQueryBuilder('products');
      queryBuilder.leftJoinAndSelect('products.category', 'category');

      if (search) {
        queryBuilder.andWhere(
          '(LOWER(products.name) LIKE LOWER(:search) OR LOWER(products.description) LIKE LOWER(:search))',
          {
            search: `%${search}%`,
          },
        );
      }

      if (minPrice !== undefined) {
        queryBuilder.andWhere('products.price >= :minPrice', { minPrice });
      }
      if (maxPrice !== undefined) {
        queryBuilder.andWhere('products.price <= :maxPrice', { maxPrice });
      }

      if (category) {
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            category,
          );

        if (isUUID) {
          queryBuilder.andWhere('products.categoryId = :categoryId', {
            categoryId: category,
          });
        } else {
          queryBuilder.andWhere('LOWER(category.name) = LOWER(:categoryName)', {
            categoryName: category,
          });
        }
      }

      const total: number = await queryBuilder.getCount();

      const products: Products[] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      if (products.length < 1) {
        throw new NotFoundException('Products not found');
      }

      const responseData = {
        total,
        count: products.length,
        page,
        totalPages: Math.ceil(total / limit),
        products,
      };

      await this.cacheManager.set(productCacheKey, responseData); // Cache for 5 minutes
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const product: Products = await this.productConnection.findOne({
        where: { id: id },
      });
      if (!product) {
        return new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product: Products = await this.productConnection.findOne({
        where: { id: id },
      });
      if (!product) {
        return new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(product, updateProductDto);
      this.productConnection.save(product);
      return 'Product update Successful';
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const product: Products = await this.productConnection.findOne({
        where: { id: id },
      });
      if (!product) {
        return new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
      this.productConnection.delete(id);
      return 'Product Deleted Successfully';
    } catch (error) {
      throw error;
    }
  }

  private generateCacheKey(filterDto: FilterProductsDto): string {
    const {
      search = '',
      category = '',
      maxPrice = '',
      minPrice = '',
      limit = '',
      page = '',
    } = filterDto || {};

    return `products:${search}:${category}:${maxPrice}:${minPrice}:${limit}:${page}`;
  }
}
