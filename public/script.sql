-- =============================================================
-- LLBJ School Platform - Database Schema (PostgreSQL Version)
-- =============================================================

-- Criação de Tipos ENUM (Postgres exige definição prévia)
DO $$
 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
   CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
   CREATE TYPE status_enum AS ENUM ('Ativo', 'Inativo');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'material_type') THEN
   CREATE TYPE material_type AS ENUM ('PDF', 'VIDEO', 'LINK');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'observation_type') THEN
   CREATE TYPE observation_type AS ENUM ('1', '2', '3');
  END IF;
 END $$;

-- =============================================
-- TABELA: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'STUDENT',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: teachers
-- =============================================
CREATE TABLE IF NOT EXISTS teachers (
    registration    VARCHAR(20) PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    subject         VARCHAR(100),
    url_image       VARCHAR(500),
    status          status_enum NOT NULL DEFAULT 'Ativo',
    user_id         INT NULL,
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABELA: school_classes
-- =============================================
CREATE TABLE IF NOT EXISTS school_classes (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    subject         VARCHAR(100),
    level           VARCHAR(100),
    students_count  INT DEFAULT 0,
    shift           VARCHAR(20),
    active          BOOLEAN DEFAULT TRUE
);

-- =============================================
-- TABELA: students
-- =============================================
CREATE TABLE IF NOT EXISTS students (
    id              VARCHAR(20) PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    registration    VARCHAR(20) NOT NULL UNIQUE,
    class_id        INT NOT NULL,
    url_image       VARCHAR(500),
    status          status_enum NOT NULL DEFAULT 'Ativo',
    user_id         INT NULL,
    CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABELA: subjects
-- =============================================
CREATE TABLE IF NOT EXISTS subjects (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(100) NOT NULL,
    class_id                INT NOT NULL,
    teacher_registration    VARCHAR(20) NOT NULL,
    weekly_target_hours     INT DEFAULT 4,
    category                VARCHAR(100),
    topic                   VARCHAR(255),
    CONSTRAINT fk_subject_class FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_subject_teacher FOREIGN KEY (teacher_registration) REFERENCES teachers(registration) ON DELETE RESTRICT
);

-- =============================================
-- TABELA: timetable_slots
-- =============================================
CREATE TABLE IF NOT EXISTS timetable_slots (
    slot_key        VARCHAR(30) PRIMARY KEY,
    day_of_week     VARCHAR(15) NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_break        BOOLEAN DEFAULT FALSE
);

-- =============================================
-- TABELA: timetable_items
-- =============================================
CREATE TABLE IF NOT EXISTS timetable_items (
    id              SERIAL PRIMARY KEY,
    class_id        INT NOT NULL,
    period          VARCHAR(20) NOT NULL,
    day_of_week     VARCHAR(15) NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    subject_id      INT NOT NULL,
    active          BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_timetable_class FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_timetable_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: weekly_agendas
-- =============================================
CREATE TABLE IF NOT EXISTS weekly_agendas (
    id              SERIAL PRIMARY KEY,
    week_name       VARCHAR(150) NOT NULL,
    start_date      TIMESTAMP NOT NULL,
    end_date        TIMESTAMP NOT NULL,
    subject_id      INT NOT NULL,
    CONSTRAINT fk_agenda_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: class_materials
-- =============================================
CREATE TABLE IF NOT EXISTS class_materials (
    id              SERIAL PRIMARY KEY,
    week_id         INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    type            material_type NOT NULL DEFAULT 'PDF',
    CONSTRAINT fk_material_week FOREIGN KEY (week_id) REFERENCES weekly_agendas(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: quizzes
-- =============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id              UUID PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    score           DECIMAL(5,2) DEFAULT 10.00,
    release_date    TIMESTAMP,
    deadline        TIMESTAMP,
    subject_id      INT,
    week_id         INT,
    material_id     INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_week FOREIGN KEY (week_id) REFERENCES weekly_agendas(id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_material FOREIGN KEY (material_id) REFERENCES class_materials(id) ON DELETE SET NULL
);

-- =============================================
-- TABELA: quiz_questions
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id              UUID PRIMARY KEY,
    quiz_id         UUID NOT NULL,
    title           TEXT NOT NULL,
    display_order   INT DEFAULT 0,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: quiz_options
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_options (
    id              UUID PRIMARY KEY,
    question_id     UUID NOT NULL,
    text            TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: observations
-- =============================================
CREATE TABLE IF NOT EXISTS observations (
    id                      SERIAL PRIMARY KEY,
    class_id                INT NOT NULL,
    teacher_registration    VARCHAR(20) NOT NULL,
    message                 TEXT NOT NULL,
    type                    observation_type NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_obs_class FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_obs_teacher FOREIGN KEY (teacher_registration) REFERENCES teachers(registration) ON DELETE RESTRICT
);

-- =============================================
-- TABELA: observation_students
-- =============================================
CREATE TABLE IF NOT EXISTS observation_students (
    observation_id  INT NOT NULL,
    student_id      VARCHAR(20) NOT NULL,
    PRIMARY KEY (observation_id, student_id),
    CONSTRAINT fk_obs_stud_obs FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
    CONSTRAINT fk_obs_stud_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA: grades
-- =============================================
CREATE TABLE IF NOT EXISTS grades (
    id              SERIAL PRIMARY KEY,
    student_id      VARCHAR(20) NOT NULL,
    subject_id      INT NOT NULL,
    n1              DECIMAL(4,1),
    n2              DECIMAL(4,1),
    n3              DECIMAL(4,1),
    average         DECIMAL(4,1) GENERATED ALWAYS AS (
        CASE
            WHEN n1 IS NOT NULL AND n2 IS NOT NULL AND n3 IS NOT NULL
            THEN ROUND((n1 + n2 + n3) / 3, 1)
            ELSE NULL
        END
    ) STORED,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_subject UNIQUE (student_id, subject_id),
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);


-- =============================================================
-- 1. USUÁRIOS (Senha de todos: 123456)
-- =============================================================
INSERT INTO users (id, username, password_hash, role) VALUES
-- Admin
(1, 'admin_user', '123456', 'ADMIN'),

-- Professores
(2, 'ana.souza@escola.com', '123456', 'TEACHER'),
(3, 'carlos.mendes@escola.com', '123456', 'TEACHER'),
(4, 'fernanda.lima.prof@escola.com', '123456', 'TEACHER'),
(5, 'ricardo.alves@escola.com', '123456', 'TEACHER'),
(6, 'juliana.rocha@escola.com', '123456', 'TEACHER'),
(7, 'bruno.martins@escola.com', '123456', 'TEACHER'),
(8, 'patricia.gomes@escola.com', '123456', 'TEACHER'),
(9, 'eduardo.silva@escola.com', '123456', 'TEACHER'),
(10, 'mariana.costa@escola.com', '123456', 'TEACHER'),
(11, 'felipe.andrade@escola.com', '123456', 'TEACHER'),
(12, 'camila.freitas@escola.com', '123456', 'TEACHER'),
(13, 'gustavo.ribeiro@escola.com', '123456', 'TEACHER'),
(14, 'larissa.mendes@escola.com', '123456', 'TEACHER'),
(15, 'thiago.barros@escola.com', '123456', 'TEACHER'),
(16, 'renata.oliveira@escola.com', '123456', 'TEACHER'),

-- Alunos
(17, 'ana.silva@escola.com', '123456', 'STUDENT'),
(18, 'carlos.oliveira@escola.com', '123456', 'STUDENT'),
(19, 'fernanda.lima@escola.com', '123456', 'STUDENT'),
(20, 'joao.santos@escola.com', '123456', 'STUDENT'),
(21, 'beatriz.santos@escola.com', '123456', 'STUDENT'),
(22, 'ricardo.m@escola.com', '123456', 'STUDENT'),
(23, 'gustavo.lima@escola.com', '123456', 'STUDENT'),
(24, 'lucas.ferreira@escola.com', '123456', 'STUDENT'),
(25, 'maria.costa@escola.com', '123456', 'STUDENT'),
(26, 'gabriel.rocha@escola.com', '123456', 'STUDENT');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- =============================================================
-- 2. PROFESSORES
-- =============================================================
INSERT INTO teachers (registration, name, email, subject, status, user_id) VALUES
('T001', 'Ana Souza',       'ana.souza@escola.com',       'Matemática',       'Ativo',   2),
('T002', 'Carlos Mendes',   'carlos.mendes@escola.com',   'História',         'Ativo',   3),
('T003', 'Fernanda Lima',   'fernanda.lima.prof@escola.com','Português',      'Inativo', 4),
('T004', 'Ricardo Alves',   'ricardo.alves@escola.com',   'Geografia',        'Ativo',   5),
('T005', 'Juliana Rocha',   'juliana.rocha@escola.com',   'Biologia',         'Ativo',   6),
('T006', 'Bruno Martins',   'bruno.martins@escola.com',   'Física',           'Inativo', 7),
('T007', 'Patrícia Gomes',  'patricia.gomes@escola.com',  'Química',          'Ativo',   8),
('T008', 'Eduardo Silva',   'eduardo.silva@escola.com',   'Educação Física',  'Ativo',   9),
('T009', 'Mariana Costa',   'mariana.costa@escola.com',   'Inglês',           'Inativo', 10),
('T010', 'Felipe Andrade',  'felipe.andrade@escola.com',  'Artes',            'Ativo',   11),
('T011', 'Camila Freitas',  'camila.freitas@escola.com',  'Filosofia',        'Ativo',   12),
('T012', 'Gustavo Ribeiro', 'gustavo.ribeiro@escola.com', 'Sociologia',       'Ativo',   13),
('T013', 'Larissa Mendes',  'larissa.mendes@escola.com',  'Literatura',       'Inativo', 14),
('T014', 'Thiago Barros',   'thiago.barros@escola.com',   'Informática',      'Ativo',   15),
('T015', 'Renata Oliveira', 'renata.oliveira@escola.com', 'Ensino Religioso', 'Ativo',   16);

-- =============================================================
-- 3. TURMAS
-- =============================================================
INSERT INTO school_classes (id, name, subject, level, students_count, shift, active) VALUES
(1, '9º Ano A',    'Matemática',    'Avançada',       32, 'Matutino', TRUE),
(2, '1º Ano EM B', 'Física',        'Termodinâmica',  32, 'Matutino', TRUE),
(3, '8º Ano C',    'Geometria',     'Espacial',       32, 'Matutino', TRUE),
(4, '3º Ano EM A', 'Física Nuclear', NULL,             32, 'Matutino', TRUE),
(5, '2º Ano EM C', 'Mecânica',      'Clássica',       0,  NULL,       FALSE);

SELECT setval('school_classes_id_seq', (SELECT MAX(id) FROM school_classes));

-- =============================================================
-- 4. ALUNOS
-- =============================================================
INSERT INTO students (id, name, email, registration, class_id, status, user_id) VALUES
('121001', 'Ana Beatriz Silva',      'ana.silva@escola.com',      'MAT-202301', 1, 'Ativo',   17),
('121002', 'Carlos Eduardo Oliveira','carlos.oliveira@escola.com', 'MAT-202302', 1, 'Inativo', 18),
('121003', 'Fernanda Souza Lima',    'fernanda.lima@escola.com',   'MAT-202303', 1, 'Ativo',   19),
('121004', 'João Pedro Santos',      'joao.santos@escola.com',     'MAT-202304', 1, 'Ativo',   20),
('121005', 'Beatriz Santos',         'beatriz.santos@escola.com',  'MAT-202305', 1, 'Ativo',   21),
('121006', 'Ricardo Mendonça',       'ricardo.m@escola.com',       'MAT-202306', 1, 'Ativo',   22),
('121007', 'Gustavo Lima',           'gustavo.lima@escola.com',    'MAT-202307', 1, 'Ativo',   23),
('221001', 'Lucas Ferreira',         'lucas.ferreira@escola.com',  'MAT-202308', 2, 'Ativo',   24),
('221002', 'Maria Eduarda Costa',    'maria.costa@escola.com',     'MAT-202309', 2, 'Ativo',   25),
('321001', 'Gabriel Rocha',          'gabriel.rocha@escola.com',   'MAT-202310', 3, 'Ativo',   26);

-- =============================================================
-- 5. DISCIPLINAS (SUBJECTS)
-- =============================================================
INSERT INTO subjects (id, name, class_id, teacher_registration, weekly_target_hours, category, topic) VALUES
(101, 'Matemática',  1, 'T001', 6, 'CIÊNCIAS EXATAS', 'Equações'),
(102, 'Física',      1, 'T006', 4, 'CIÊNCIAS EXATAS', NULL),
(103, 'Português',   1, 'T003', 6, 'HUMANAS',          'Redação'),
(104, 'História',    1, 'T002', 4, 'HUMANAS',          NULL),
(105, 'Geografia',   1, 'T004', 4, 'HUMANAS',          NULL),
(106, 'Artes',       1, 'T010', 2, 'ARTES & ESPORTES', NULL),
(107, 'Ed. Física',  1, 'T008', 3, 'ARTES & ESPORTES', NULL),
(108, 'Química',     1, 'T007', 4, 'CIÊNCIAS EXATAS', NULL),
(109, 'Biologia',    1, 'T005', 4, 'NATUREZA',         NULL);

SELECT setval('subjects_id_seq', (SELECT MAX(id) FROM subjects));

-- =============================================================
-- 6. AGENDAS E MATERIAIS
-- =============================================================
INSERT INTO weekly_agendas (id, week_name, start_date, end_date, subject_id) VALUES
(1, 'Semana 1 - Introdução às Células', '2023-10-01 00:00:00', '2023-10-07 23:59:59', 109),
(2, 'Semana 2 - Mitose e Meiose',        '2023-10-08 00:00:00', '2023-10-14 23:59:59', 109),
(3, 'Semana 1 - Cinemática',             '2023-10-01 00:00:00', '2023-10-07 23:59:59', 102);

SELECT setval('weekly_agendas_id_seq', (SELECT MAX(id) FROM weekly_agendas));

INSERT INTO class_materials (id, week_id, title, url, type) VALUES
(1, 1, 'Apostila de Biologia Celular', '#', 'PDF'),
(2, 1, 'Videoaula: O que é uma Célula?', '#', 'VIDEO'),
(3, 2, 'Resumo Mitose (PDF)', '#', 'PDF'),
(4, 3, 'Exercícios de Fixação - Cinemática', '#', 'PDF');

SELECT setval('class_materials_id_seq', (SELECT MAX(id) FROM class_materials));

-- =============================================================
-- 7. QUIZZES (UUIDs Reais)
-- =============================================================
INSERT INTO quizzes (id, title, description, score, release_date, deadline, subject_id, week_id, material_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Quiz de Fixação: Células', 'Teste seus conhecimentos sobre o conteúdo da Semana 1.', 10.00, '2023-10-05 08:00:00', '2023-10-10 23:59:00', 109, 1, 1);

INSERT INTO quiz_questions (id, quiz_id, title, display_order) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '550e8400-e29b-41d4-a716-446655440000', 'Qual das organelas abaixo é responsável pela respiração celular?', 1);

INSERT INTO quiz_options (id, question_id, text, is_correct) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ribossomo', FALSE),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mitocôndria', TRUE),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Complexo de Golgi', FALSE),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Lisossomo', FALSE);

-- =============================================================
-- 8. OBSERVAÇÕES E NOTAS
-- =============================================================
INSERT INTO observations (class_id, teacher_registration, message, type) VALUES
(1, 'T001', 'Atraso reincidente após o intervalo.', '3'),
(1, 'T001', 'Ótimo desempenho no projeto bimestral.', '2');

INSERT INTO observation_students (observation_id, student_id) VALUES
(1, '121004'),
(1, '121002'),
(2, '121004');

INSERT INTO grades (student_id, subject_id, n1, n2, n3) VALUES
('121001', 101, 8.5, 9.0, NULL),
('121002', 101, 7.0, 6.5, 8.0),
('121003', 101, 9.5, 10.0, 9.0),
('121004', 101, 6.0, NULL, NULL);