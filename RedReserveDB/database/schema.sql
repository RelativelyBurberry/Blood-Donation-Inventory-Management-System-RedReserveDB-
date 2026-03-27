-- Create Database
CREATE DATABASE IF NOT EXISTS RedReserveDB;
USE RedReserveDB;

-- 1. Blood_Bank
CREATE TABLE Blood_Bank ( 
    Bank_id VARCHAR(10) PRIMARY KEY, 
    Name VARCHAR(100), 
    Location VARCHAR(100) 
); 

-- 2. Blood_Bank_Contact
CREATE TABLE Blood_Bank_Contact ( 
    Bank_id VARCHAR(10), 
    Contact VARCHAR(15), 
    PRIMARY KEY (Bank_id, Contact), 
    FOREIGN KEY (Bank_id) REFERENCES Blood_Bank(Bank_id) 
); 

-- 3. Hospital
CREATE TABLE Hospital ( 
    Hospital_id VARCHAR(10) PRIMARY KEY, 
    Name VARCHAR(100), 
    Address VARCHAR(200), 
    Contact_Number VARCHAR(15) 
); 

-- 4. UserTable (Superclass for Donors and Staff)
CREATE TABLE UserTable ( 
    User_id VARCHAR(10) PRIMARY KEY, 
    First_Name VARCHAR(50), 
    Last_Name VARCHAR(50), 
    Email VARCHAR(100), 
    Phone_Number VARCHAR(15), 
    Gender VARCHAR(10) 
); 

-- 5. Donor (Subclass)
CREATE TABLE Donor ( 
    Donor_id VARCHAR(10) PRIMARY KEY, 
    DOB DATE, 
    Blood_Group VARCHAR(5), 
    Last_Donation_Date DATE, 
    FOREIGN KEY (Donor_id) REFERENCES UserTable(User_id) 
); 

-- 6. Staff (Subclass)
CREATE TABLE Staff ( 
    Staff_id VARCHAR(10) PRIMARY KEY, 
    Certification VARCHAR(100), 
    Job_Title VARCHAR(50), 
    FOREIGN KEY (Staff_id) REFERENCES UserTable(User_id) 
); 

-- 7. Auth Users (Login + Roles)
CREATE TABLE Auth_User ( 
    Auth_id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Donor', 'Hospital') NOT NULL,
    Linked_Id VARCHAR(10),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Request
CREATE TABLE Request ( 
    Request_id VARCHAR(10) PRIMARY KEY, 
    Blood_Group VARCHAR(5), 
    Quantity INT, 
    Request_Date DATE, 
    Status VARCHAR(20), 
    Urgency VARCHAR(20),
    Bank_id VARCHAR(10), 
    Hospital_id VARCHAR(10), 
    Patient_id VARCHAR(10), 
    Requested_By INT,
    Approved_By INT,
    Approved_At DATETIME,
    Rejected_At DATETIME,
    Fulfilled_At DATETIME,
    FOREIGN KEY (Bank_id) REFERENCES Blood_Bank(Bank_id), 
    FOREIGN KEY (Hospital_id) REFERENCES Hospital(Hospital_id),
    FOREIGN KEY (Requested_By) REFERENCES Auth_User(Auth_id),
    FOREIGN KEY (Approved_By) REFERENCES Auth_User(Auth_id)
); 

-- 9. Blood_Unit
CREATE TABLE Blood_Unit ( 
    Unit_Number VARCHAR(10) PRIMARY KEY, 
    Blood_Group VARCHAR(5), 
    Expiry_Date DATE, 
    Status VARCHAR(20), 
    Hospital_id VARCHAR(10), 
    Donor_id VARCHAR(10),
    Bank_id VARCHAR(10),
    Collected_Date DATE,
    FOREIGN KEY (Hospital_id) REFERENCES Hospital(Hospital_id),
    FOREIGN KEY (Donor_id) REFERENCES Donor(Donor_id),
    FOREIGN KEY (Bank_id) REFERENCES Blood_Bank(Bank_id)
); 

-- 10. Donation_Camp
CREATE TABLE Donation_Camp ( 
    Camp_id VARCHAR(10) PRIMARY KEY, 
    Location VARCHAR(100), 
    Date_of_Camp DATE, 
    Organizer VARCHAR(100) 
); 

-- 11. Collected_At
CREATE TABLE Collected_At ( 
    Unit_Number VARCHAR(10), 
    Camp_id VARCHAR(10), 
    PRIMARY KEY (Unit_Number, Camp_id), 
    FOREIGN KEY (Unit_Number) REFERENCES Blood_Unit(Unit_Number), 
    FOREIGN KEY (Camp_id) REFERENCES Donation_Camp(Camp_id) 
);

-- 12. Request_Unit (tracks which units were reserved/used for a request)
CREATE TABLE Request_Unit (
    Request_id VARCHAR(10),
    Unit_Number VARCHAR(10),
    PRIMARY KEY (Request_id, Unit_Number),
    FOREIGN KEY (Request_id) REFERENCES Request(Request_id),
    FOREIGN KEY (Unit_Number) REFERENCES Blood_Unit(Unit_Number)
);
