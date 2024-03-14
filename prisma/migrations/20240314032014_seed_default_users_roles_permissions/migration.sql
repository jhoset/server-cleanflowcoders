-- RESET NECESSARY TABLES
DELETE FROM role_permission_details;
DELETE FROM user_role_details;
DELETE FROM roles;
DELETE FROM permissions;
DELETE FROM users;

-- Insert Default Permissions
INSERT INTO permissions (code, name, is_deleted, created_at, updated_at, changed_by) VALUES
  ('P001', 'Manage User', false, NOW(), NOW(), 'system'),
  ('P002', 'Manage Raffle', false, NOW(), NOW(), 'system');

-- Insert Default Roles
INSERT INTO roles (name, is_deleted, created_at, updated_at, changed_by) VALUES
  ('Admin', false, NOW(), NOW(), 'system'),
  ('Moderator', false, NOW(), NOW(), 'system');

-- Insert Default Users
INSERT INTO users (first_name, last_name, user_name, email, email_verified, password, is_deleted, created_at, updated_at, changed_by)
VALUES 
  ('Sys', 'Admin', 'sys_admin', 'admin@cfc.com', false, '$2a$10$Cf763B7so5FJOeTrHDllAO1rhPs/Ruc9Iwh2zMMni3Qq6RuoIUrGG', false, NOW(), NOW(), 'system'),
  ('Sys', 'Moderator', 'sys_mod', 'moderator@cfc.com', true, '$2a$10$dVN4O/3N1p1fk358ilKdLurH9M2geexGHsKLutukUmSeRGr9J6OCC', false, NOW(), NOW(), 'system');

-- Insert User Amin - Roles
INSERT INTO user_role_details (user_id, role_id, created_at, changed_by) VALUES 
  ((SELECT id FROM users WHERE email = 'admin@cfc.com'), (SELECT id FROM roles WHERE name = 'Admin'), NOW(), 'system');

-- Insert User Mod - Roles
INSERT INTO user_role_details (user_id, role_id, created_at, changed_by) VALUES 
  ((SELECT id FROM users WHERE email = 'moderator@cfc.com'), (SELECT id FROM roles WHERE name = 'Moderator'), NOW(), 'system');


-- Insert Admin Role - Permissions
INSERT INTO role_permission_details (role_id, permission_id, created_at, changed_by) VALUES
  ((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM permissions WHERE code = 'P001'), NOW(), 'system'),
  ((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM permissions WHERE code = 'P002'), NOW(), 'system');

-- Insert Mod Role - Permissions
INSERT INTO role_permission_details (role_id, permission_id, created_at, changed_by) VALUES
  ((SELECT id FROM roles WHERE name = 'Moderator'), (SELECT id FROM permissions WHERE code = 'P002'), NOW(), 'system');
