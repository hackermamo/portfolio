-- ========================================================
-- Supabase Schema & Initial Data Setup for Portfolio CMS
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ========================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization" text NOT NULL,
	"issue_date" text,
	"image" text,
	"credential_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"qualification" text NOT NULL,
	"institution" text NOT NULL,
	"location" text,
	"start_year" text NOT NULL,
	"end_year" text,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"start_date" text NOT NULL,
	"end_date" text,
	"is_current" boolean DEFAULT false NOT NULL,
	"responsibilities" jsonb NOT NULL,
	"company_logo" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "hero_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"availability_status" text NOT NULL,
	"name" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"profile_photo" text,
	"cv_url" text,
	"floating_badges" jsonb NOT NULL,
	"decorative_text" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"technologies" jsonb NOT NULL,
	"live_url" text,
	"github_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);

CREATE TABLE IF NOT EXISTS "skill_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

DO $$ 
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'skills_category_id_skill_categories_id_fk'
	) THEN
		ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_skill_categories_id_fk" 
		FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;

-- 2. Initial Seed Data

-- Admin User (Email: maman.cse.tcea.2026@gmail.com / Password: Admin134)
INSERT INTO users (email, password, name, role)
VALUES (
	'maman.cse.tcea.2026@gmail.com',
	'$2b$10$Y.LT0g06AbWnGGCsOh6h/Oj.sj9Lcx812ByLRdBCc7EMJG/9WItEO',
	'Maman Das',
	'admin'
) ON CONFLICT (email) DO NOTHING;

-- Hero Content
INSERT INTO hero_content (availability_status, name, subtitle, description, profile_photo, cv_url, floating_badges, decorative_text, is_published)
VALUES (
	'Open to Software & AI Opportunities',
	'Maman Das',
	'Computer Science Graduate • M.Tech (Pursuing)',
	'Full-stack developer with experience in Generative AI, Machine Learning, and real-world web applications. I build scalable solutions that solve real problems.',
	'',
	'',
	'[{"icon": "Code", "text": "Full-Stack Developer"}, {"icon": "Brain", "text": "GenAI / ML Enthusiast"}, {"icon": "Zap", "text": "Problem Solver"}]'::jsonb,
	'Build, Learn, Improve, Repeat',
	true
);

-- Clear dummy images from existing rows (run if you already seeded before)
UPDATE hero_content SET profile_photo = '', cv_url = '' WHERE profile_photo = '/images/profile.jpg';

-- Skill Categories & Skills
INSERT INTO skill_categories (id, name, "order", is_published)
VALUES 
	(1, 'Languages', 0, true),
	(2, 'Web Technologies', 1, true),
	(3, 'Databases', 2, true),
	(4, 'Developer Tools', 3, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (category_id, name, "order") VALUES
	(1, 'Python', 0), (1, 'JavaScript', 1), (1, 'SQL', 2),
	(2, 'HTML & CSS', 0), (2, 'React', 1), (2, 'Node.js', 2), (2, 'Streamlit', 3),
	(3, 'MongoDB', 0), (3, 'MySQL', 1), (3, 'PostgreSQL', 2), (3, 'SQLite', 3),
	(4, 'VS Code', 0), (4, 'PyCharm', 1), (4, 'IntelliJ IDEA', 2), (4, 'Git & GitHub', 3), (4, 'Canva', 4);

-- Projects
INSERT INTO projects (title, description, technologies, is_featured, is_published, "order") VALUES
	('ApnaHome – Rental Platform', 'A full-stack home rental platform with property search, listings, and user management.', '["React", "Node.js", "MongoDB"]'::jsonb, true, true, 0),
	('Stock Price Forecasting', 'Python/Streamlit app to forecast next-month stock prices using multiple models and fuzzy logic.', '["Python", "Streamlit", "Machine Learning"]'::jsonb, true, true, 1),
	('AI Price Comparison', 'Smart price-comparison tool covering Amazon, Flipkart, Meesho, and IndiaMART using Python.', '["Python", "HTML", "CSS", "JavaScript"]'::jsonb, true, true, 2);

-- Experience
INSERT INTO experiences (role, company, location, start_date, end_date, is_current, responsibilities, "order", is_published) VALUES
	('GenAI Full-Stack Developer Intern', 'Yupcha Software Pvt. Ltd.', 'Remote', 'Jun 2025', 'Jul 2025', false, '["Worked with Python, HTML, CSS, and JavaScript.", "Implemented authentication and search functionality.", "Managed database layer and built responsive front end."]'::jsonb, 0, true),
	('IT Teacher', 'Sudhayana Debbarma Memorial HS School', 'Tripura', '2026', '2026', false, '["Taught foundational IT concepts to high school students.", "Prepared lesson plans and practical exercises.", "Guided students through hands-on computer lab sessions."]'::jsonb, 1, true),
	('Machine Learning Trainee', 'NIELIT', 'Tripura', 'Jul 2023', 'Aug 2023', false, '["Completed hands-on training in machine learning using Python.", "Applied core ML methodologies to practical exercises."]'::jsonb, 2, true);

-- Education
INSERT INTO education (qualification, institution, location, start_year, end_year, "order", is_published) VALUES
	('B.Tech in Computer Science and Engineering', 'Techno College of Engineering, Agartala', 'Agartala', '2022', '2026', 0, true),
	('Higher Secondary (+2 Stage)', 'Jalefa HS School, Sabroom', 'Sabroom', '2020', '2022', 1, true),
	('Madhyamik (Secondary)', 'Jalefa HS School, Sabroom', 'Sabroom', '2018', '2020', 2, true);

-- Certifications
INSERT INTO certifications (name, organization, issue_date, "order", is_published) VALUES
	('GenAI Full-Stack Developer Internship', 'Yupcha Software Pvt. Ltd.', '2025', 0, true),
	('Training Certificate', 'CTTC Bhubaneswar', '2024', 1, true),
	('Machine Learning Training', 'NIELIT', '2023', 2, true);

-- Social Links
INSERT INTO social_links (platform, url, icon, "order", is_enabled) VALUES
	('LinkedIn', 'https://linkedin.com', 'Linkedin', 0, true),
	('GitHub', 'https://github.com', 'Github', 1, true),
	('YouTube', 'https://youtube.com', 'Youtube', 2, true),
	('Email', 'mailto:maman.cse.tcea.2026@gmail.com', 'Mail', 3, true);
