import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FilterProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomAuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(CustomAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('imageURLs', 8))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[]) {


    if (typeof createProductDto.color === 'string') {
      try {
        createProductDto.color = JSON.parse(createProductDto.color);
      } catch (e) {
        console.error('Error parsing color:', e);
      }
    }

    if (typeof createProductDto.size === 'string') {
      try {
        createProductDto.size = JSON.parse(createProductDto.size);
      } catch (e) {
        console.error('Error parsing size:', e);
      }
    }
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  @UseGuards(CustomAuthGuard)
  findAll(@Query() filterDto: FilterProductsDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CustomAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(CustomAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
