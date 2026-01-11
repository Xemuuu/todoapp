import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
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
      .leftJoinAndSelect('task.category', 'category')
      .orderBy('task.createdAt', 'DESC');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (categoryId) {
      query.andWhere('task.categoryId = :categoryId', { categoryId });
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
      relations: ['category', 'user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);

    // If status changed to DONE, set completedAt
    if (updateTaskDto.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      updateTaskDto['completedAt'] = new Date();
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}
