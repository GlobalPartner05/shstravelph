CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY,
	`email` text NOT NULL UNIQUE,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `booking_status_history` (
	`id` integer PRIMARY KEY,
	`booking_id` integer NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`note` text,
	`changed_by` text DEFAULT 'admin' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	CONSTRAINT `fk_booking_status_history_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY,
	`reference_code` text NOT NULL UNIQUE,
	`route_id` integer NOT NULL,
	`vehicle_category_id` integer NOT NULL,
	`trip_type` text DEFAULT 'one_way' NOT NULL,
	`pickup_date` text NOT NULL,
	`pickup_time` text NOT NULL,
	`return_date` text,
	`return_time` text,
	`is_airport_pickup` integer DEFAULT false NOT NULL,
	`airline` text,
	`flight_number` text,
	`scheduled_arrival` text,
	`passenger_count` integer NOT NULL,
	`large_bags` integer DEFAULT 0 NOT NULL,
	`small_bags` integer DEFAULT 0 NOT NULL,
	`special_requests` text,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`whatsapp` text,
	`preferred_contact` text DEFAULT 'phone' NOT NULL,
	`quoted_fare` real NOT NULL,
	`currency` text DEFAULT 'PHP' NOT NULL,
	`payment_method` text DEFAULT 'cash' NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`admin_notes` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	CONSTRAINT `fk_bookings_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`),
	CONSTRAINT `fk_bookings_vehicle_category_id_vehicle_categories_id_fk` FOREIGN KEY (`vehicle_category_id`) REFERENCES `vehicle_categories`(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing_rules` (
	`id` integer PRIMARY KEY,
	`route_id` integer NOT NULL,
	`vehicle_category_id` integer NOT NULL,
	`base_fare` real NOT NULL,
	`round_trip_fare` real,
	`currency` text DEFAULT 'PHP' NOT NULL,
	`inclusions_note` text,
	`exclusions_note` text,
	`is_active` integer DEFAULT false NOT NULL,
	`is_placeholder` integer DEFAULT true NOT NULL,
	`effective_date` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	CONSTRAINT `fk_pricing_rules_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`),
	CONSTRAINT `fk_pricing_rules_vehicle_category_id_vehicle_categories_id_fk` FOREIGN KEY (`vehicle_category_id`) REFERENCES `vehicle_categories`(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` integer PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`category_label` text NOT NULL,
	`description` text,
	`image_url` text,
	`is_airport_pickup` integer DEFAULT false NOT NULL,
	`estimated_duration_note` text,
	`is_active` integer DEFAULT false NOT NULL,
	`is_placeholder` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY,
	`value` text DEFAULT '' NOT NULL,
	`is_confirmed` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_categories` (
	`id` integer PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`tagline` text,
	`description` text,
	`max_passengers` integer NOT NULL,
	`max_large_bags` integer NOT NULL,
	`max_small_bags` integer NOT NULL,
	`amenities` text,
	`image_url` text,
	`is_active` integer DEFAULT false NOT NULL,
	`is_placeholder` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
