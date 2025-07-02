-- Create the database
CREATE DATABASE EmployeeCollaboration;
GO
USE EmployeeCollaboration;
GO
DROP TABLE IF EXISTS Users;


-- Users table with manually controlled UserId
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100),
    Email NVARCHAR(100),
    Department NVARCHAR(100),
    Role NVARCHAR(100),
    Password NVARCHAR(100), -- Added column
    CreatedAt DATETIME
);


-- Requests table with FK to Users
CREATE TABLE Requests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    Title NVARCHAR(200),
    Description NVARCHAR(MAX),
    Priority NVARCHAR(20),
    Status NVARCHAR(50),
    SubmissionDate DATETIME DEFAULT GETDATE()
);

-- Tasks table with FK to Users
CREATE TABLE Tasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    Title NVARCHAR(200),
    Description NVARCHAR(MAX),
    DueDate DATETIME
);

-- Announcements table
CREATE TABLE Announcements (
    AnnouncementId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);


-- Insert Sample data

INSERT INTO Users (FullName, Email, Department, Role, Password, CreatedAt) VALUES
('Sai Chandra', 'sai@gmail.com', 'IT', 'Manager', 'Sai123', GETDATE()),
('Vinay Reddy', 'vinay.reddy@gmail.com', 'HR', 'Employee', 'Vinay123', GETDATE()),
('Veera Kumar', 'veera.kumar@gmail.com', 'Finance', 'Admin', 'Veera123', GETDATE()),
('Sonal Jain', 'sonal.jain@gmail.com', 'IT', 'Employee', 'Sonal123', GETDATE()),
('Vanashree M', 'vanashree.m@gmail.com', 'HR', 'Manager', 'Vana123', GETDATE()),
('Raj Shetty', 'raj.shetty@gmail.com', 'Finance', 'Employee', 'Raj123', GETDATE()),
('Ravi Rao', 'ravi.rao@gmail.com', 'IT', 'Admin', 'Ravi123', GETDATE()),
('Neha Verma', 'neha.verma@gmail.com', 'Finance', 'Manager', 'Neha123', GETDATE());



INSERT INTO Requests (UserId, Title, Description, Priority, Status) VALUES
(1, 'Laptop not working', 'My system is not booting up since morning.', 'High', 'Open'),
(3, 'New Joinee Access', 'Need to set up access for new HR intern.', 'Medium', 'In Progress'),
(6, 'Budget Approval', 'Requesting approval for Q2 expense report.', 'High', 'Pending Approval'),
(3, 'Website Banner Update', 'Update homepage banner for July campaign.', 'Low', 'Completed'),
(2, 'Printer not responding', 'Admin printer not working in Block B.', 'Medium', 'Open'),
(5, 'Software Installation', 'Need Adobe XD installed on my system.', 'Low', 'Completed'),
(3, 'Leave Management Issue', 'Employee leave balance not reflecting.', 'Medium', 'In Progress'),
(1, 'Report Automation', 'Want to automate monthly report generation.', 'High', 'Open'),
(4, 'Blog Review Request', 'Need review on SEO-optimized blog draft.', 'Low', 'Completed'),
(1, 'Database Access', 'Require read-only access to prod DB.', 'High', 'Open');


INSERT INTO Tasks (UserId, Title, Description, DueDate) VALUES
(1, 'Fix Login Bug', 'Resolve session timeout issue on login.', DATEADD(DAY, 2, GETDATE())),
(2, 'Conduct Orientation', 'Welcome new hires and explain policies.', DATEADD(DAY, 1, GETDATE())),
(3, 'Prepare Tax Docs', 'Compile and verify tax deduction details.', DATEADD(DAY, 5, GETDATE())),
(4, 'Write July Newsletter', 'Prepare draft for internal email blast.', DATEADD(DAY, 3, GETDATE())),
(5, 'Inventory Check', 'Verify all office supplies and restock.', DATEADD(DAY, 7, GETDATE())),
(6, 'Test Feature X', 'Perform regression testing on release v2.1.', DATEADD(DAY, 2, GETDATE())),
(7, 'Candidate Follow-up', 'Schedule call with selected candidate.', DATEADD(DAY, 1, GETDATE())),
(3, 'Budget Summary PPT', 'Prepare summary for Q1 spend analysis.', DATEADD(DAY, 4, GETDATE())),
(2, 'Social Post Calendar', 'Plan social posts for next 4 weeks.', DATEADD(DAY, 3, GETDATE())),
(4, 'API Integration', 'Integrate external payment gateway.', DATEADD(DAY, 6, GETDATE()));


INSERT INTO Announcements (Title, Message) VALUES
('Maintenance Downtime', 'Server maintenance scheduled on Saturday from 10 PM to 2 AM.'),
('New HR Policies Updated', 'Please review the updated HR policies on the portal.'),
('Employee of the Month', 'Congratulations to Veera for being the Employee of the Month!'),
('Team Outing Planned', 'Marketing and IT teams will have a joint team outing on 15th July.'),
('COVID Guidelines Reminder', 'Mask is mandatory inside premises. Maintain hygiene and social distancing.');


select * from Users;
select * from Requests;
select * from Tasks;
select * from Announcements;



--delete from Users;
--delete from Requests;
--delete from Tasks;
--delete from Announcements;

DBCC CHECKIDENT ('Requests', RESEED, 0);
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Tasks', RESEED, 0);
DBCC CHECKIDENT ('Announcements', RESEED, 0);



-- Drop tables if they exist (to reset everything cleanly)
IF OBJECT_ID('dbo.Requests', 'U') IS NOT NULL DROP TABLE dbo.Requests;
IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL DROP TABLE dbo.Tasks;
IF OBJECT_ID('dbo.Announcements', 'U') IS NOT NULL DROP TABLE dbo.Announcements;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

-- Drop foreign keys referencing Users
ALTER TABLE Requests DROP CONSTRAINT FK_Requests_UserId;
ALTER TABLE Tasks DROP CONSTRAINT FK_Tasks_UserId;
