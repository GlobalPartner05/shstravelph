-- Launch seed data for the Cloudflare D1 database.
-- Mirrors the original Netlify seed: everything except ONE route/vehicle/price
-- combo is inactive and flagged is_placeholder so the public site never shows
-- fabricated figures as real. The admin must verify and activate each row from
-- /admin before go-live.

-- Vehicle categories (three tiers; capacities are placeholders to verify)
INSERT INTO vehicle_categories (slug, name, tagline, description, max_passengers, max_large_bags, max_small_bags, amenities, image_url, is_active, is_placeholder)
VALUES
  ('sedan', 'Sedan', 'Comfortable. Stylish. Reliable.', 'DEV PLACEHOLDER — confirm the real model, photo, and capacity in Admin > Vehicles before launch.', 3, 2, 2, 'Air-conditioning', NULL, 1, 1),
  ('van', 'Van', 'Spacious. Comfortable. Group friendly.', 'DEV PLACEHOLDER — confirm the real model, photo, and capacity in Admin > Vehicles before launch.', 9, 6, 4, 'Air-conditioning', NULL, 0, 1),
  ('premium-van', 'Premium Van', 'Extra comfort for small groups with more luggage.', 'DEV PLACEHOLDER — confirm the real model, photo, and capacity in Admin > Vehicles before launch.', 6, 4, 3, 'Air-conditioning', NULL, 0, 1);

-- Routes (one active demo route; the rest need pricing before they can go live)
INSERT INTO routes (slug, origin, destination, category_label, description, image_url, is_airport_pickup, estimated_duration_note, is_active, is_placeholder)
VALUES
  ('naia-to-angeles-city', 'NAIA', 'Angeles City', 'Airport Transfer', 'DEV PLACEHOLDER — confirm route coverage, description, and photo in Admin > Routes before launch.', NULL, 1, '~2-3 hrs', 1, 1),
  ('naia-to-clark', 'NAIA', 'Clark', 'Airport Transfer', 'DEV PLACEHOLDER — confirm route coverage, description, and photo in Admin > Routes before launch.', NULL, 1, '~2-3 hrs', 0, 1),
  ('clark-to-angeles-city', 'Clark', 'Angeles City', 'Airport Transfer', 'DEV PLACEHOLDER — confirm route coverage, description, and photo in Admin > Routes before launch.', NULL, 1, '~30-60 min', 0, 1),
  ('angeles-city-to-naia', 'Angeles City', 'NAIA', 'Airport Transfer', 'DEV PLACEHOLDER — confirm route coverage, description, and photo in Admin > Routes before launch.', NULL, 1, '~2-3 hrs', 0, 1);

-- Pricing (ONE active row so the booking flow is testable end-to-end)
INSERT INTO pricing_rules (route_id, vehicle_category_id, base_fare, round_trip_fare, currency, inclusions_note, exclusions_note, is_active, is_placeholder)
SELECT
  (SELECT id FROM routes WHERE slug = 'naia-to-angeles-city'),
  (SELECT id FROM vehicle_categories WHERE slug = 'sedan'),
  4800, 9000, 'PHP',
  'DEV PLACEHOLDER FARE — not a real quote. Confirm tolls/fuel inclusions and the real rate in Admin > Routes before launch.',
  'DEV PLACEHOLDER — list any real exclusions here (e.g. parking fees) before launch.',
  1, 1;

-- Site settings: unconfirmed until the admin fills them in, except the
-- WhatsApp number the owner has confirmed.
INSERT INTO site_settings (key, value, is_confirmed) VALUES
  ('whatsapp_number', '639242390446', 1),
  ('waiting_time_policy', 'To be confirmed by Sakura Hire Services.', 0),
  ('cancellation_policy', 'To be confirmed by Sakura Hire Services.', 0),
  ('dispatch_contact', 'To be confirmed by Sakura Hire Services.', 0);

-- First admin login (PBKDF2 hash generated at 60k iterations — see lib/auth.ts,
-- Workers free plan CPU limit; password is set separately — see deployment notes).
INSERT INTO admin_users (email, password_hash) VALUES
  ('globalbiz.partner@protonmail.com', 'pbkdf2$60000$1667094f4a00002ea122f246e4fcabac$2cb09991781c86dcdae6e44d3cfaab7fd3da2f838409d1bb49cd6cb934c70474')
ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash;
