import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { categoryIds, ...taskData } = createTaskDto;
    
    const task = this.taskRepository.create(taskData);
    
    // Jeśli są kategorie, załaduj je
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      task.categories = categories;
    }
    
    return await this.taskRepository.save(task);
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: TaskStatus,
    categoryId?: number,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .leftJoinAndSelect('task.categories', 'category')
      .orderBy('task.startDateTime', 'ASC');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
      relations: ['categories', 'user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);
    const { categoryIds, ...taskData } = updateTaskDto;

    Object.assign(task, taskData);
    
    // Jeśli są nowe kategorie, zaktualizuj je
    if (categoryIds !== undefined) {
      if (categoryIds && categoryIds.length > 0) {
        const categories = await this.categoryRepository.findBy({
          id: In(categoryIds),
        });
        task.categories = categories;
      } else {
        task.categories = [];
      }
    }
    
    return await this.taskRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}
