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

-- 7. Request
CREATE TABLE Request ( 
    Request_id VARCHAR(10) PRIMARY KEY, 
    Blood_Group VARCHAR(5), 
    Quantity INT, 
    Request_Date DATE, 
    Status VARCHAR(20), 
    Bank_id VARCHAR(10), 
    Hospital_id VARCHAR(10), 
    Patient_id VARCHAR(10), 
    FOREIGN KEY (Bank_id) REFERENCES Blood_Bank(Bank_id), 
    FOREIGN KEY (Hospital_id) REFERENCES Hospital(Hospital_id) 
); 

-- 8. Blood_Unit
CREATE TABLE Blood_Unit ( 
    Unit_Number VARCHAR(10) PRIMARY KEY, 
    Blood_Group VARCHAR(5), 
    Expiry_Date DATE, 
    Status VARCHAR(20), 
    Hospital_id VARCHAR(10), 
    FOREIGN KEY (Hospital_id) REFERENCES Hospital(Hospital_id) 
); 

-- 9. Donation_Camp
CREATE TABLE Donation_Camp ( 
    Camp_id VARCHAR(10) PRIMARY KEY, 
    Location VARCHAR(100), 
    Date_of_Camp DATE, 
    Organizer VARCHAR(100) 
); 

-- 10. Collected_At
CREATE TABLE Collected_At ( 
    Unit_Number VARCHAR(10), 
    Camp_id VARCHAR(10), 
    PRIMARY KEY (Unit_Number, Camp_id), 
    FOREIGN KEY (Unit_Number) REFERENCES Blood_Unit(Unit_Number), 
    FOREIGN KEY (Camp_id) REFERENCES Donation_Camp(Camp_id) 
);