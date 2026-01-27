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

  console.log('🗑️  Clearing existing data...');
  await dataSource.query('DELETE FROM tasks');
  await dataSource.query('DELETE FROM categories');
  await dataSource.query('DELETE FROM users');

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

  console.log('📝 Creating tasks...');
  const taskRepo = dataSource.getRepository(Task);

  const today = new Date();
  const currentDay = today.getDay();
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Monday as start
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const getDate = (dayOffset: number, hour: number, minute: number = 0) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const tasks = [
    {
      title: 'Team meeting - Sprint Planning',
      description: 'Quarterly review and planning session with the development team. Discuss Q1 goals, resource allocation, and upcoming features.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDateTime: getDate(0, 10, 0), // Monday 10:00
      endDateTime: getDate(0, 11, 30),   // Monday 11:30
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Code review session',
      description: 'Review pull requests from the backend team. Focus on authentication module and API endpoints.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      startDateTime: getDate(1, 14, 0), // Tuesday 14:00
      endDateTime: getDate(1, 15, 30),   // Tuesday 15:30
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Dentist appointment',
      description: 'Regular checkup and teeth cleaning at Dr. Smith\'s clinic. Remember to bring insurance card.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      startDateTime: getDate(2, 16, 0), // Wednesday 16:00
      endDateTime: getDate(2, 17, 0),   // Wednesday 17:00
      userId: user1.id,
      categoryId: personalCategory.id,
    },
    {
      title: 'Online TypeScript course',
      description: 'Advanced TypeScript patterns - generics and utility types. Complete modules 4-6 on Udemy.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      startDateTime: getDate(3, 18, 0), // Thursday 18:00
      endDateTime: getDate(3, 20, 0),   // Thursday 20:00
      userId: user1.id,
      categoryId: studyCategory.id,
    },
    {
      title: 'Client presentation',
      description: 'Present final project demo to stakeholders. Prepare slides and live demo environment.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDateTime: getDate(4, 11, 0), // Friday 11:00
      endDateTime: getDate(4, 12, 30),  // Friday 12:30
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Weekend study session',
      description: 'Deep dive into NestJS documentation - focus on guards, interceptors, and middleware patterns.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      startDateTime: getDate(5, 10, 0), // Saturday 10:00
      endDateTime: getDate(5, 13, 0),   // Saturday 13:00
      userId: user1.id,
      categoryId: studyCategory.id,
    },
    {
      title: 'Family brunch',
      description: 'Sunday brunch with family at Green Garden restaurant. Reservation at 12:00.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      startDateTime: getDate(6, 12, 0), // Sunday 12:00
      endDateTime: getDate(6, 14, 0),   // Sunday 14:00
      userId: user1.id,
      categoryId: personalCategory.id,
    },

    // User 1 tasks - WITHOUT TIME (Kanban view)
    {
      title: 'Fix bug in authentication',
      description: 'Users cannot login with special characters in password. Investigate bcrypt hashing issue.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      userId: user1.id,
      categoryId: workCategory.id,
    },
    {
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, fruits, vegetables, chicken breast',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      userId: user1.id,
      categoryId: personalCategory.id,
    },
    {
      title: 'Call dentist',
      description: 'Schedule appointment for teeth cleaning',
      status: TaskStatus.DONE,
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

    // User 2 tasks
    {
      title: 'Morning run',
      description: '5km run in the park',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      userId: user2.id,
      categoryId: fitnessCategory.id,
    },
    {
      title: 'Gym workout',
      description: 'Leg day - squats, lunges, deadlifts',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
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
