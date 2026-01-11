import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Task, TaskStatus, TaskPriority } from './tasks/entities/task.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await dataSource.query('DELETE FROM tasks');
  await dataSource.query('DELETE FROM categories');
  await dataSource.query('DELETE FROM users');

  // Create users
  console.log('👤 Creating users...');
  const userRepo = dataSource.getRepository(User);
  
  const user1 = await userRepo.save({
    email: 'john@example.com',
    password: await bcrypt.hash('password123', 10),
  });

  const user2 = await userRepo.save({
    email: 'jane@example.com',
    password: await bcrypt.hash('password123', 10),
  });

  console.log(`✅ Created ${2} users`);

  // Create categories
  console.log('📁 Creating categories...');
  const categoryRepo = dataSource.getRepository(Category);

  const workCategory = await categoryRepo.save({
    name: 'Work',
    color: '#FF5733',
    userId: user1.id,
  });

  const personalCategory = await categoryRepo.save({
    name: 'Personal',
    color: '#33FF57',
    userId: user1.id,
  });

  const studyCategory = await categoryRepo.save({
    name: 'Study',
    color: '#3357FF',
    userId: user1.id,
  });

  const fitnessCategory = await categoryRepo.save({
    name: 'Fitness',
    color: '#FF33F5',
    userId: user2.id,
  });

  console.log(`✅ Created ${4} categories`);

  // Create tasks
  console.log('📝 Creating tasks...');
  const taskRepo = dataSource.getRepository(Task);

  const tasks = [
    // User 1 tasks
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive API documentation for the Task Manager',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-15'),
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Fix bug in authentication',
      description: 'Users cannot login with special characters in password',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-10'),
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Team meeting',
      description: 'Quarterly review and planning session',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-01-12'),
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, fruits',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-01-09'),
      userId: user1.id,
      categoryId: personalCategory.id,
    },
    {
      title: 'Call dentist',
      description: 'Schedule appointment for teeth cleaning',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      userId: user1.id,
      categoryId: personalCategory.id,
    },
    {
      title: 'Read "Clean Code"',
      description: 'Finish chapters 5-8',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      userId: user1.id,
      categoryId: studyCategory.id,
    },
    {
      title: 'Practice TypeScript',
      description: 'Complete advanced exercises on type system',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      completedAt: new Date('2026-01-05'),
      userId: user1.id,
      categoryId: studyCategory.id,
    },
    // User 2 tasks
    {
      title: 'Morning run',
      description: '5km run in the park',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      completedAt: new Date('2026-01-08'),
      userId: user2.id,
      categoryId: fitnessCategory.id,
    },
    {
      title: 'Gym workout',
      description: 'Leg day - squats, lunges, deadlifts',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-09'),
      userId: user2.id,
      categoryId: fitnessCategory.id,
    },
    {
      title: 'Meal prep',
      description: 'Prepare healthy meals for the week',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      userId: user2.id,
      categoryId: fitnessCategory.id,
    },
  ];

  for (const task of tasks) {
    await taskRepo.save(task);
  }

  console.log(`✅ Created ${tasks.length} tasks`);

  console.log('\\n🎉 Seeding completed successfully!');
  console.log('\\n📊 Summary:');
  console.log(`   Users: ${2}`);
  console.log(`   Categories: ${4}`);
  console.log(`   Tasks: ${tasks.length}`);
  console.log('\\n🔑 Test credentials:');
  console.log('   Email: john@example.com');
  console.log('   Password: password123');
  console.log('   User ID: ' + user1.id);
  console.log('\\n   Email: jane@example.com');
  console.log('   Password: password123');
  console.log('   User ID: ' + user2.id);

  await app.close();
}

seed()
  .then(() => {
    console.log('\\n✅ Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
