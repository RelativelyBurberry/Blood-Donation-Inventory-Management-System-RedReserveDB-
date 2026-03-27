USE RedReserveDB;

-- Insert Blood Banks
INSERT INTO Blood_Bank (Bank_id, Name, Location) VALUES 
('BB01', 'City Central Blood Bank', 'Downtown'),
('BB02', 'Red Cross Metro', 'Northside'),
('BB03', 'LifeSave Blood Center', 'West End');

-- Insert Blood Bank Contacts
INSERT INTO Blood_Bank_Contact (Bank_id, Contact) VALUES 
('BB01', '9876543210'),
('BB01', '9876543211'),
('BB02', '8765432109');

-- Insert Hospitals
INSERT INTO Hospital (Hospital_id, Name, Address, Contact_Number) VALUES 
('H01', 'General Hospital', '123 Health Ave', '1112223333'),
('H02', 'St. Judes Medical Center', '456 Care Blvd', '4445556666'),
('H03', 'City Care Clinic', '789 Wellness St', '7778889999');

-- Insert Users (Donors and Staff mixed)
INSERT INTO UserTable (User_id, First_Name, Last_Name, Email, Phone_Number, Gender) VALUES 
('U01', 'John', 'Doe', 'john@email.com', '1231231234', 'Male'),
('U02', 'Jane', 'Smith', 'jane@email.com', '2342342345', 'Female'),
('U03', 'Mike', 'Johnson', 'mike@email.com', '3453453456', 'Male'),
('U04', 'Emily', 'Davis', 'emily@email.com', '4564564567', 'Female'),
('U05', 'Chris', 'Brown', 'chris@email.com', '5675675678', 'Male'),
('S01', 'Sarah', 'Connor', 'sarah.c@email.com', '9998887777', 'Female'),
('S02', 'Alan', 'Grant', 'alan.g@email.com', '8887776666', 'Male');

-- Insert Donors (Matches User IDs U01 to U05)
-- Note: U03 and U04 have dates older than '2025-03-01' to trigger Query 3!
INSERT INTO Donor (Donor_id, DOB, Blood_Group, Last_Donation_Date) VALUES 
('U01', '1990-05-15', 'O+', '2026-02-10'),
('U02', '1992-08-20', 'A+', '2026-01-05'),
('U03', '1985-11-10', 'B-', '2024-11-20'), 
('U04', '1995-03-25', 'O-', '2024-05-15'), 
('U05', '1988-07-30', 'AB+', '2025-12-12');

-- Insert Staff (Matches User IDs S01 to S02)
INSERT INTO Staff (Staff_id, Certification, Job_Title) VALUES 
('S01', 'Phlebotomy Technician', 'Head Nurse'),
('S02', 'Clinical Lab Scientist', 'Lab Technician');

-- Insert Blood Units
-- Note: Expiry dates use DATE_ADD to ensure Query 5 (expiring in 30 days) always works for your demo!
INSERT INTO Blood_Unit (Unit_Number, Blood_Group, Expiry_Date, Status, Hospital_id, Donor_id, Bank_id, Collected_Date) VALUES 
('BU101', 'O+', DATE_ADD(CURRENT_DATE, INTERVAL 15 DAY), 'Available', NULL, 'U01', 'BB01', DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY)),
('BU102', 'A+', DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY), 'Available', NULL, 'U02', 'BB01', DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY)),
('BU103', 'B-', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'Available', NULL, 'U03', 'BB02', DATE_SUB(CURRENT_DATE, INTERVAL 25 DAY)),
('BU104', 'O-', '2026-10-15', 'Used', 'H02', 'U04', 'BB02', DATE_SUB(CURRENT_DATE, INTERVAL 40 DAY)),
('BU105', 'AB+', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'Available', NULL, 'U05', 'BB03', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY)),
('BU106', 'O+', DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY), 'Available', NULL, 'U01', 'BB01', DATE_SUB(CURRENT_DATE, INTERVAL 12 DAY));

-- Insert Requests
-- Note: O+ is requested most to trigger Query 2! Statuses are mixed for Query 7.
INSERT INTO Request (Request_id, Blood_Group, Quantity, Request_Date, Status, Urgency, Bank_id, Hospital_id, Patient_id, Requested_By, Approved_By, Approved_At, Rejected_At, Fulfilled_At) VALUES 
('R001', 'O+', 2, '2026-03-20', 'Pending', 'High', 'BB01', 'H01', 'P991', NULL, NULL, NULL, NULL, NULL),
('R002', 'A+', 1, '2026-03-21', 'Approved', 'Medium', 'BB02', 'H02', 'P992', NULL, NULL, NULL, NULL, NULL),
('R003', 'O+', 3, '2026-03-25', 'Pending', 'Low', 'BB01', 'H03', 'P993', NULL, NULL, NULL, NULL, NULL),
('R004', 'B-', 1, '2026-03-26', 'Rejected', 'High', 'BB03', 'H01', 'P994', NULL, NULL, NULL, NOW(), NULL);

-- Insert Donation Camps
INSERT INTO Donation_Camp (Camp_id, Location, Date_of_Camp, Organizer) VALUES 
('C01', 'City Square Mall', '2026-01-10', 'Rotary Club'),
('C02', 'University Campus', '2026-02-15', 'Student Union');

-- Insert Collected At (Linking Units to Camps)
INSERT INTO Collected_At (Unit_Number, Camp_id) VALUES 
('BU101', 'C01'),
('BU102', 'C01'),
('BU103', 'C02'),
('BU105', 'C02');

-- Optional: request-unit link data for demo charts
INSERT INTO Request_Unit (Request_id, Unit_Number) VALUES
('R002', 'BU102');
