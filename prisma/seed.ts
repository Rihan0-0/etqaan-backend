import {
  PrismaClient,
  Role,
  Gender,
  AttendanceStatus,
  Grade,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // ========================================
  // 1. CREATE USERS (All Roles)
  // ========================================
  console.log('👤 Creating users...');

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@rihaan.com' },
    update: { plain_password: password },
    create: {
      email: 'superadmin@rihaan.com',
      name: 'المدير العام',
      password: hashedPassword,
      plain_password: password,
      role: Role.super_admin,
    },
  });
  console.log(`  ✅ Super Admin: ${superAdmin.email}`);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rihaan.com' },
    update: { plain_password: password },
    create: {
      email: 'admin@rihaan.com',
      name: 'أحمد المدير',
      password: hashedPassword,
      plain_password: password,
      role: Role.admin,
    },
  });
  console.log(`  ✅ Admin: ${admin.email}`);

  // Sheikh 1
  const sheikh1 = await prisma.user.upsert({
    where: { email: 'sheikh1@rihaan.com' },
    update: { plain_password: password },
    create: {
      email: 'sheikh1@rihaan.com',
      name: 'الشيخ محمد عبدالله',
      password: hashedPassword,
      plain_password: password,
      role: Role.sheikh,
    },
  });
  console.log(`  ✅ Sheikh 1: ${sheikh1.email}`);

  // Sheikh 2
  const sheikh2 = await prisma.user.upsert({
    where: { email: 'sheikh2@rihaan.com' },
    update: { plain_password: password },
    create: {
      email: 'sheikh2@rihaan.com',
      name: 'الشيخ أحمد سالم',
      password: hashedPassword,
      plain_password: password,
      role: Role.sheikh,
    },
  });
  console.log(`  ✅ Sheikh 2: ${sheikh2.email}`);

  // Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@rihaan.com' },
    update: { plain_password: password },
    create: {
      email: 'student@rihaan.com',
      name: 'عبدالرحمن أحمد',
      password: hashedPassword,
      plain_password: password,
      role: Role.student,
    },
  });
  console.log(`  ✅ Student: ${studentUser.email}`);

  // ========================================
  // 2. CREATE TERM
  // ========================================
  console.log('\n📅 Creating term...');

  const term = await prisma.term.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'الفصل الدراسي الأول 2026',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-06-30'),
      is_active: true,
    },
  });
  console.log(`  ✅ Term: ${term.name}`);

  // ========================================
  // 3. CREATE BATCHES
  // ========================================
  console.log('\n📚 Creating batches...');

  const batch1 = await prisma.batch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      term_id: term.id,
      name: 'حلقة الأسود 🦁',
      schedule_description: 'السبت والاثنين والأربعاء - 5:00 م',
    },
  });
  console.log(`  ✅ Batch: ${batch1.name}`);

  const batch2 = await prisma.batch.upsert({
    where: { id: 2 },
    update: {},
    create: {
      term_id: term.id,
      name: 'حلقة النجوم ⭐',
      schedule_description: 'الأحد والثلاثاء والخميس - 4:00 م',
    },
  });
  console.log(`  ✅ Batch: ${batch2.name}`);

  const batch3 = await prisma.batch.upsert({
    where: { id: 3 },
    update: {},
    create: {
      term_id: term.id,
      name: 'حلقة الأبطال 🏆',
      schedule_description: 'السبت والاثنين - 6:00 م',
    },
  });
  console.log(`  ✅ Batch: ${batch3.name}`);

  // ========================================
  // 4. ASSIGN SHEIKHS TO BATCHES
  // ========================================
  console.log('\n👨‍🏫 Assigning sheikhs to batches...');

  // Clear existing assignments first
  await prisma.batchSheikh.deleteMany({
    where: { batch_id: { in: [batch1.id, batch2.id, batch3.id] } },
  });

  await prisma.batchSheikh.createMany({
    data: [
      { batch_id: batch1.id, sheikh_id: sheikh1.id, is_head_sheikh: true },
      { batch_id: batch2.id, sheikh_id: sheikh1.id, is_head_sheikh: true },
      { batch_id: batch3.id, sheikh_id: sheikh2.id, is_head_sheikh: true },
    ],
  });
  console.log('  ✅ Sheikhs assigned to batches');

  // ========================================
  // 5. CREATE STUDENTS
  // ========================================
  console.log('\n👨‍🎓 Creating students...');

  const studentNames = [
    'عبدالرحمن أحمد',
    'محمد علي',
    'يوسف خالد',
    'عمر سعيد',
    'أحمد حسن',
    'خالد محمود',
    'سعد عبدالله',
    'فهد ناصر',
    'عبدالله سالم',
    'طارق فيصل',
    'حمزة زياد',
    'ياسر عادل',
  ];

  const students: { id: number; full_name: string }[] = [];

  for (let i = 0; i < studentNames.length; i++) {
    const student = await prisma.student.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        full_name: studentNames[i],
        gender: Gender.male,
        guardian_name: `ولي أمر ${studentNames[i]}`,
        guardian_phone: `010${String(i).padStart(8, '0')}`,
        user_id: i === 0 ? studentUser.id : null, // Link first student to student user
      },
    });
    students.push(student);
  }
  console.log(`  ✅ Created ${students.length} students`);

  // ========================================
  // 6. ENROLL STUDENTS IN BATCHES
  // ========================================
  console.log('\n📝 Enrolling students in batches...');

  // Clear existing enrollments
  await prisma.batchStudent.deleteMany({
    where: { batch_id: { in: [batch1.id, batch2.id, batch3.id] } },
  });

  const batchStudents: { id: number; batch_id: number; student_id: number }[] =
    [];

  // Batch 1: Students 0-4
  for (let i = 0; i < 5; i++) {
    const bs = await prisma.batchStudent.create({
      data: {
        batch_id: batch1.id,
        student_id: students[i].id,
        league_points: 150 - i * 15, // Decreasing points for ranking
      },
    });
    batchStudents.push(bs);
  }

  // Batch 2: Students 5-8
  for (let i = 5; i < 9; i++) {
    const bs = await prisma.batchStudent.create({
      data: {
        batch_id: batch2.id,
        student_id: students[i].id,
        league_points: 140 - (i - 5) * 20,
      },
    });
    batchStudents.push(bs);
  }

  // Batch 3: Students 9-11
  for (let i = 9; i < 12; i++) {
    const bs = await prisma.batchStudent.create({
      data: {
        batch_id: batch3.id,
        student_id: students[i].id,
        league_points: 130 - (i - 9) * 25,
      },
    });
    batchStudents.push(bs);
  }

  console.log(`  ✅ Enrolled students in batches`);

  // ========================================
  // 7. CREATE DAILY RECORDS
  // ========================================
  console.log('\n📅 Creating daily records...');

  const today = new Date();
  const dates = [
    new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  ];

  const grades = [
    Grade.excellent,
    Grade.very_good,
    Grade.good,
    Grade.acceptable,
  ];
  const attendanceStatuses = [
    AttendanceStatus.present,
    AttendanceStatus.present,
    AttendanceStatus.present,
    AttendanceStatus.late,
  ];

  for (const bs of batchStudents.slice(0, 5)) {
    for (let d = 0; d < dates.length; d++) {
      await prisma.dailyRecord.create({
        data: {
          batch_student_id: bs.id,
          record_date: dates[d],
          attendance_status: attendanceStatuses[d % attendanceStatuses.length],
          jadeed_range: `البقرة ${(d + 1) * 5 + 1}-${(d + 2) * 5}`,
          jadeed_grade: grades[d % grades.length],
          muraja_range: 'الفاتحة',
          muraja_grade: grades[(d + 1) % grades.length],
          bonus_points: d === 0 ? 5 : 0,
        },
      });
    }
  }
  console.log('  ✅ Created daily records');

  // ========================================
  // 8. CREATE EXAMS
  // ========================================
  console.log('\n📝 Creating exams...');

  const exam1 = await prisma.exam.create({
    data: {
      batch_id: batch1.id,
      title: 'امتحان سورة البقرة (1-50)',
      max_score: 100,
      exam_date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      batch_id: batch1.id,
      title: 'امتحان أحكام التجويد',
      max_score: 100,
      exam_date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('  ✅ Created exams');

  // ========================================
  // 9. CREATE EXAM RESULTS
  // ========================================
  console.log('\n📊 Creating exam results...');

  const scores = [95, 88, 92, 78, 85];

  for (let i = 0; i < 5; i++) {
    await prisma.examResult.create({
      data: {
        exam_id: exam1.id,
        batch_student_id: batchStudents[i].id,
        score: scores[i],
      },
    });

    await prisma.examResult.create({
      data: {
        exam_id: exam2.id,
        batch_student_id: batchStudents[i].id,
        score: scores[(i + 2) % 5],
      },
    });
  }

  console.log('  ✅ Created exam results');

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Database seeded successfully!\n');
  console.log('📋 TEST ACCOUNTS:');
  console.log('='.repeat(50));
  console.log('');
  console.log('🔴 SUPER ADMIN:');
  console.log('   Email: superadmin@rihaan.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🟣 ADMIN:');
  console.log('   Email: admin@rihaan.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🟢 SHEIKH 1:');
  console.log('   Email: sheikh1@rihaan.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🟢 SHEIKH 2:');
  console.log('   Email: sheikh2@rihaan.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🔵 STUDENT:');
  console.log('   Email: student@rihaan.com');
  console.log('   Password: password123');
  console.log('');
  console.log('='.repeat(50));
  console.log('📚 CREATED DATA:');
  console.log(`   - 1 Term`);
  console.log(`   - 3 Batches`);
  console.log(`   - ${students.length} Students`);
  console.log(`   - 2 Exams with results`);
  console.log(`   - Daily attendance records`);
  console.log('='.repeat(50));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
