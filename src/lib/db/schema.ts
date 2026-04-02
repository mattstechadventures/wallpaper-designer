import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  data: text("data").notNull(), // JSON string of WallpaperTemplate
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const renderedWallpapers = sqliteTable("rendered_wallpapers", {
  id: text("id").primaryKey(),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id),
  filePath: text("file_path").notNull(),
  renderedAt: integer("rendered_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
