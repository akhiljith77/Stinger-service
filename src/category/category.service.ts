import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryConnection: Repository<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryConnection.save(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const categories: Category[] = await this.categoryConnection.find();
      if (!categories) {
        throw new NotFoundException('Categories not found');
      }

      return {
        count: categories?.length,
        categories,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const category: Category = await this.categoryConnection.findOne({
        where: { id: id },
      });
      if (!category) {
        throw new NotFoundException('Categories not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category: Category = await this.categoryConnection.findOne({
        where: { id: id },
      });
      if (!category) {
        return new NotFoundException('Category not found');
      }
      Object.assign(category, updateCategoryDto);
      this.categoryConnection.save(category);
      return 'Category update Successful';
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const category: Category = await this.categoryConnection.findOne({
        where: { id: id },
      });
      if (!category) {
        return new NotFoundException('Category not found');
      }
      this.categoryConnection.delete(id);
      return 'Category Deleted Successfully';
    } catch (error) {
      throw error;
    }
  }
}
