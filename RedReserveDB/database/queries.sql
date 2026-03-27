-- 1. Donors with Last Donation Date & Next Eligible Date 
SELECT  
d.Donor_id, 
u.First_Name, 
u.Last_Name, 
d.Last_Donation_Date, 
DATE_ADD(d.Last_Donation_Date, INTERVAL 56 DAY) AS Next_Eligible_Date 
FROM Donor d 
JOIN UserTable u ON d.Donor_id = u.User_id; 

-- 2. Most frequently requested blood group 
SELECT Blood_Group, COUNT(*) AS Frequency 
FROM Request 
GROUP BY Blood_Group 
ORDER BY Frequency DESC 
LIMIT 1; 

-- 3. Donors who have not donated recently 
SELECT Donor_id, Last_Donation_Date 
FROM Donor 
WHERE Last_Donation_Date < '2025-03-01'; 

-- 4. Total units per blood group 
SELECT Blood_Group, COUNT(Unit_Number) AS Total_Units 
FROM Blood_Unit 
GROUP BY Blood_Group; 

-- 5. Blood units expiring within next 30 days 
SELECT Unit_Number, Expiry_Date 
FROM Blood_Unit 
WHERE Expiry_Date < DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY); 

-- 6. Donation camps with number of units collected 
SELECT c.Camp_id, COUNT(ca.Unit_Number) AS Units_Collected 
FROM Donation_Camp c 
JOIN Collected_At ca ON c.Camp_id = ca.Camp_id 
GROUP BY c.Camp_id; 

-- 7. Pending requests 
SELECT * FROM Request 
WHERE Status = 'Pending'; 

-- 8. Donors 
SELECT Donor_id, Blood_Group, Last_Donation_Date 
FROM Donor; 

-- 9. Available blood units with hospital details  
SELECT  
b.Unit_Number, 
b.Status, 
b.Blood_Group, 
h.Hospital_id, 
h.Name, 
h.Address, 
h.Contact_Number 
FROM Blood_Unit b 
JOIN Hospital h ON b.Hospital_id = h.Hospital_id 
WHERE b.Status = 'Available'; 

-- 10. Average units per blood group 
SELECT Blood_Group, COUNT(Unit_Number) AS Total_Units 
FROM Blood_Unit 
GROUP BY Blood_Group 
HAVING COUNT(Unit_Number) > ( 
    SELECT AVG(Unit_Count) 
    FROM ( 
        SELECT COUNT(Unit_Number) AS Unit_Count 
        FROM Blood_Unit 
        GROUP BY Blood_Group 
    ) AS temp 
);

-- 11. Auth users
SELECT * FROM Auth_User;

-- 12. Request-Unit links
SELECT * FROM Request_Unit;
