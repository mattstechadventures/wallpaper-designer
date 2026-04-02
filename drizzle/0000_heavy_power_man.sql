CREATE TABLE `rendered_wallpapers` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`file_path` text NOT NULL,
	`rendered_at` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`data` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
