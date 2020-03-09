INSERT INTO `roles` (`name`, `slug`,  `description`, `createdAt`, `updatedAt`, `deletedAt`, `is_active`, `is_admin`, `is_super_admin`) VALUES
('Administrator', 'administrator','Administrator', now(), now(), NULL, '1', '1', '1'),
('Event Organizer', 'event-oraganizer', 'Event Oraganizer', now(), now(), NULL, '1', '0', '0'),
('Audience', 'audience', 'Audience', now(), now(), NULL, '1', '0', '0');
INSERT INTO `users` (`first_name`, `last_name`, `user_name`, `password`, `gender`, `dob`, `email`, `area_code`, `mobile_no`, `address_1`, `address_2`, `role_id`, `city`, `state`, `pincode`, `country`, `createdAt`, `updatedAt`, `deletedAt`, `is_active`)
VALUES('admin', 'a', 'admin', '$2b$04$a5xX4zSNe7/nB7WDuyQHS.HiWJ/tD5Q7JrhZuJaVn/71wWgE73BKm', '1', '1994-12-22', 'admin@event.com', '+91', '9791447542', 'address 1', 'address 2', '1', 'chennai', 'TN', '600004', 'India', now(), now(), NULL, '1');
