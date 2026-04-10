INSERT INTO Department (dept_id, dept_name, description) VALUES
  (1, 'Engineering', 'Roads, drains, and civil infrastructure'),
  (2, 'Sanitation', 'Solid waste and cleanliness operations'),
  (3, 'Electrical', 'Street lighting and electrical maintenance');

INSERT INTO Ward (ward_id, ward_name, zone_name) VALUES
  (1, 'Ward 1', 'South Zone'),
  (2, 'Ward 2', 'South Zone'),
  (3, 'Ward 3', 'North Zone'),
  (4, 'Ward 4', 'North Zone');

INSERT INTO Authority_Role (role_id, role_title, dept_id, default_sla_hours) VALUES
  (1, 'Junior Engineer - South Zone', 1, 72),
  (2, 'Sanitary Inspector - South Zone', 2, 48),
  (3, 'Electrical Officer - North Zone', 3, 36),
  (4, 'Zonal Engineering Officer', 1, 96);

INSERT INTO Issue_Category (category_id, category_name, default_role_id, sla_hours) VALUES
  (1, 'Road Damage', 1, 72),
  (2, 'Garbage Dumping', 2, 48),
  (3, 'Street Light Failure', 3, 36),
  (4, 'Drain Blockage', 4, 96);

INSERT INTO Users (user_id, aadhar_hash, full_name, mobile_number, email, user_role, created_at) VALUES
  (101, 'sha256_official_101', 'Rakesh Kumar', '9000000001', 'rakesh.official@civic.local', 'OFFICIAL', CURRENT_TIMESTAMP),
  (102, 'sha256_official_102', 'Anita Sharma', '9000000002', 'anita.official@civic.local', 'OFFICIAL', CURRENT_TIMESTAMP),
  (103, 'sha256_official_103', 'Mohit Verma', '9000000003', 'mohit.official@civic.local', 'OFFICIAL', CURRENT_TIMESTAMP),
  (104, 'sha256_official_104', 'Sneha Iyer', '9000000004', 'sneha.official@civic.local', 'OFFICIAL', CURRENT_TIMESTAMP);

INSERT INTO Officer_Assignment (assignment_id, officer_id, role_id, ward_id, assigned_from, assigned_until) VALUES
  (1001, 101, 1, 1, CURRENT_TIMESTAMP, NULL),
  (1002, 102, 2, 2, CURRENT_TIMESTAMP, NULL),
  (1003, 103, 3, 3, CURRENT_TIMESTAMP, NULL),
  (1004, 104, 4, NULL, CURRENT_TIMESTAMP, NULL);
