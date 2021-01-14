import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategory(title: string): Promise<Category> {
    const category = await this.findOne({ title });
    if (category) {
      return category;
    }
    const newCategory = this.create({ title });
    await this.save(newCategory);

    return newCategory;
  }
}

export default CategoriesRepository;
