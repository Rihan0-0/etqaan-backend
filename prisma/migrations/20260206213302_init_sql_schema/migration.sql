-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'sheikh', 'student_user');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'excused');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('excellent', 'very_good', 'good', 'acceptable', 'weak', 'redo');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "dob" DATE,
    "gender" "Gender" NOT NULL,
    "guardian_name" VARCHAR(255),
    "guardian_phone" VARCHAR(50),
    "user_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" SERIAL NOT NULL,
    "term_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "schedule_description" TEXT,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_sheikhs" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "sheikh_id" INTEGER NOT NULL,
    "is_head_sheikh" BOOLEAN DEFAULT false,

    CONSTRAINT "batch_sheikhs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_students" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "league_points" INTEGER DEFAULT 0,
    "joined_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batch_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_records" (
    "id" SERIAL NOT NULL,
    "batch_student_id" INTEGER NOT NULL,
    "record_date" DATE NOT NULL,
    "attendance_status" "AttendanceStatus" DEFAULT 'absent',
    "jadeed_range" VARCHAR(255),
    "jadeed_grade" "Grade",
    "muraja_range" VARCHAR(255),
    "muraja_grade" "Grade",
    "behavior_note" TEXT,
    "bonus_points" INTEGER DEFAULT 0,

    CONSTRAINT "daily_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "max_score" INTEGER DEFAULT 100,
    "exam_date" DATE NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "batch_student_id" INTEGER NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_sheikhs" ADD CONSTRAINT "batch_sheikhs_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_sheikhs" ADD CONSTRAINT "batch_sheikhs_sheikh_id_fkey" FOREIGN KEY ("sheikh_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_students" ADD CONSTRAINT "batch_students_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_students" ADD CONSTRAINT "batch_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_batch_student_id_fkey" FOREIGN KEY ("batch_student_id") REFERENCES "batch_students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_batch_student_id_fkey" FOREIGN KEY ("batch_student_id") REFERENCES "batch_students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
