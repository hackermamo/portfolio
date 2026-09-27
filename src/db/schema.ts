import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  availabilityStatus: text("availability_status").notNull(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  profilePhoto: text("profile_photo"),
  cvUrl: text("cv_url"),
  floatingBadges: jsonb("floating_badges").notNull(),
  decorativeText: text("decorative_text"),
  isPublished: boolean("is_published").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true).notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => skillCategories.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
  order: integer("order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  technologies: jsonb("technologies").notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  responsibilities: jsonb("responsibilities").notNull(),
  companyLogo: text("company_logo"),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true).notNull(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  qualification: text("qualification").notNull(),
  institution: text("institution").notNull(),
  location: text("location"),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  description: text("description"),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true).notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  issueDate: text("issue_date"),
  image: text("image"),
  credentialUrl: text("credential_url"),
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(true).notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  isEnabled: boolean("is_enabled").default(true).notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: jsonb("value").notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));
