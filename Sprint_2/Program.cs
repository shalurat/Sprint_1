using EmployeeCollaborationConsole.Models;
using Sprint2.Repositories;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;

namespace EmployeeCollaborationApp
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "Server=Chandu;Database=EmployeeCollaboration;Trusted_Connection=True;";
            using var connection = new SqlConnection(connectionString);

            var userRepo = new UserRepository(connectionString);
            var requestRepo = new RequestRepository(connectionString);
            var announcementRepo = new AnnouncementRepository(connectionString);
            var taskRepo = new TaskRepository(connectionString);

            Console.WriteLine("Choose: 1) Register  2) Login");
            var initialChoice = Console.ReadLine();
            User? currentUser = null;

            if (initialChoice == "1")
            {
                string fullName;
                do
                {
                    fullName = Ask("Full Name").Trim();
                    if (string.IsNullOrWhiteSpace(fullName))
                        Console.WriteLine("Your name is required.");
                } while (string.IsNullOrWhiteSpace(fullName));

                string email;
                do
                {
                    email = Ask("Email");
                    if (!IsValidEmail(email))
                        Console.WriteLine("Invalid email format. Try again.");
                } while (!IsValidEmail(email));

                string password;
                do
                {
                    password = Ask("Password (min 6 chars, must include uppercase, lowercase, digit)");
                    if (!IsValidPassword(password))
                        Console.WriteLine("Password does not meet complexity requirements. Try again.");
                } while (!IsValidPassword(password));

                string confirmPassword = Ask("Confirm Password");
                if (password != confirmPassword)
                {
                    Console.WriteLine("Passwords do not match. Registration failed.");
                    return;
                }

                var department = Ask("Department (IT/HR/Finance)");
                var role = Ask("Role (Employee/Manager/Admin)");

                var newUser = new User
                {
                    FullName = fullName,
                    Email = email,
                    Department = department,
                    Role = role,
                    CreatedAt = DateTime.Now,
                    Password = password
                };

                userRepo.AddUser(newUser);
                Console.WriteLine("Registered successfully! Please log in.\n");
            }

            while (currentUser == null)
            {
                string loginName;
                do
                {
                    loginName = Ask("Enter your Full Name").Trim();
                    if (string.IsNullOrWhiteSpace(loginName))
                        Console.WriteLine("Your name is required.");
                } while (string.IsNullOrWhiteSpace(loginName));

                var passwordInput = Ask("Enter your Password");

                var user = userRepo.GetUserByFullName(loginName);

                if (user != null && user.Password == passwordInput)
                {
                    currentUser = user;
                }
                else
                {
                    Console.WriteLine("Invalid name or password. Please try again.\n");
                }
            }

            bool running = true;
            while (running)
            {
                Console.WriteLine("\n--- Employee Portal ---");
                Console.WriteLine("1. Submit Request");
                Console.WriteLine("2. View My Department Requests");
                Console.WriteLine("3. View Announcements");
                Console.WriteLine("4. Update My Request");
                Console.WriteLine("5. Delete My Request");
                Console.WriteLine("6. Update My Profile");
                Console.WriteLine("7. Delete My Profile");
                Console.WriteLine("8. Add Task");
                Console.WriteLine("9. View My Tasks");

                if (IsManagerOrAdmin(currentUser))
                {
                    Console.WriteLine("10. Add Announcement");
                    Console.WriteLine("11. Delete Announcement");
                }

                Console.WriteLine("0. Exit");
                Console.Write("Choose an option: ");
                var choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        var req = new Request
                        {
                            UserId = currentUser.UserId,
                            Title = Ask("Title"),
                            Description = Ask("Description"),
                            Priority = Ask("Priority"),
                            CreatedAt = DateTime.Now,
                            Status = "Open"
                        };
                        requestRepo.AddRequest(req);
                        Console.WriteLine("Request submitted.");
                        break;

                    case "2":
                        if (IsAdmin(currentUser))
                        {
                            var requests = requestRepo.GetAllRequests();
                            if (!requests.Any())
                            {
                                Console.WriteLine("No requests found.");
                                break;
                            }

                            foreach (var r in requests)
                                Console.WriteLine($"[{r.RequestId}] {r.Title} - {r.Description} | Priority: {r.Priority} | Status: {r.Status}");

                            if (Ask("Do you want to resolve any request? (yes/no)").Trim().Equals("yes", StringComparison.OrdinalIgnoreCase))
                            {
                                Console.Write("Enter Request ID to resolve: ");
                                if (int.TryParse(Console.ReadLine(), out int reqId))
                                {
                                    var reqToClose = requests.FirstOrDefault(r => r.RequestId == reqId);
                                    if (reqToClose != null && !reqToClose.Status.Equals("Resolved", StringComparison.OrdinalIgnoreCase))
                                    {
                                        reqToClose.Status = "Resolved";
                                        requestRepo.UpdateRequest(reqToClose);
                                        Console.WriteLine("Request marked as Resolved.");
                                    }
                                    else
                                    {
                                        Console.WriteLine("Invalid or already resolved request.");
                                    }
                                }
                            }
                        }
                        else
                        {
                            var myRequests = requestRepo.GetRequestsByUser(currentUser.UserId);
                            if (!myRequests.Any())
                            {
                                Console.WriteLine("You have no requests.");
                                break;
                            }

                            foreach (var r in myRequests)
                                Console.WriteLine($"[{r.RequestId}] {r.Title} - {r.Description} | Priority: {r.Priority} | Status: {r.Status}");
                        }
                        break;

                    case "3":
                        var announcements = announcementRepo.GetAllAnnouncements();
                        foreach (var a in announcements)
                            Console.WriteLine($"{a.Title} - {a.Message}");
                        break;

                    case "4":
                        var updatable = requestRepo.GetAllRequests().Where(r => r.UserId == currentUser.UserId).ToList();
                        if (!updatable.Any())
                        {
                            Console.WriteLine("No requests to update.");
                            break;
                        }

                        for (int i = 0; i < updatable.Count; i++)
                            Console.WriteLine($"{i + 1}. {updatable[i].Title} (Status: {updatable[i].Status})");

                        if (int.TryParse(Console.ReadLine(), out int updateIndex) && updateIndex > 0 && updateIndex <= updatable.Count)
                        {
                            var reqToUpdate = updatable[updateIndex - 1];

                            string? val = Ask($"New Title (blank to keep '{reqToUpdate.Title}')");
                            if (!string.IsNullOrWhiteSpace(val)) reqToUpdate.Title = val;

                            val = Ask("New Description (blank to keep current)");
                            if (!string.IsNullOrWhiteSpace(val)) reqToUpdate.Description = val;

                            val = Ask($"New Priority (blank to keep '{reqToUpdate.Priority}')");
                            if (!string.IsNullOrWhiteSpace(val)) reqToUpdate.Priority = val;

                            val = Ask($"New Status (blank to keep '{reqToUpdate.Status}')");
                            if (!string.IsNullOrWhiteSpace(val)) reqToUpdate.Status = val;

                            requestRepo.UpdateRequest(reqToUpdate);
                            Console.WriteLine("Request updated.");
                        }
                        break;

                    case "5":
                        var deletables = requestRepo
                            .GetAllRequests()
                            .Where(r => r.UserId == currentUser.UserId && r.Status.Equals("Resolved", StringComparison.OrdinalIgnoreCase))
                            .ToList();

                        if (!deletables.Any())
                        {
                            Console.WriteLine("You have no resolved requests to delete.");
                            break;
                        }

                        for (int i = 0; i < deletables.Count; i++)
                            Console.WriteLine($"{i + 1}. {deletables[i].Title} (Status: {deletables[i].Status})");

                        if (int.TryParse(Console.ReadLine(), out int delIndex) && delIndex > 0 && delIndex <= deletables.Count)
                        {
                            requestRepo.DeleteRequest(deletables[delIndex - 1].RequestId, currentUser.UserId);
                            Console.WriteLine("Request deleted.");
                        }
                        break;

                    case "6":
                        var updated = false;
                        string? newName = Ask("New Full Name (blank to keep)");
                        if (!string.IsNullOrWhiteSpace(newName))
                        {
                            currentUser.FullName = newName;
                            updated = true;
                        }

                        string? newDept = Ask("New Department (blank to keep)");
                        if (!string.IsNullOrWhiteSpace(newDept))
                        {
                            currentUser.Department = newDept;
                            updated = true;
                        }

                        string? newRole = Ask("New Role (blank to keep)");
                        if (!string.IsNullOrWhiteSpace(newRole))
                        {
                            currentUser.Role = newRole;
                            updated = true;
                        }

                        if (updated)
                        {
                            userRepo.UpdateUser(currentUser);
                            Console.WriteLine("Profile updated.");
                        }
                        break;

                    case "7":
                        if (Ask("Are you sure you want to delete your profile? (yes/no)").Trim().Equals("yes", StringComparison.OrdinalIgnoreCase))
                        {
                            userRepo.DeleteUser(currentUser.Email);
                            Console.WriteLine("Profile deleted. Goodbye!");
                            running = false;
                        }
                        break;

                    case "8":
                        var task = new EmployeeCollaborationConsole.Models.UserTask
                        {
                            UserId = currentUser.UserId,
                            Title = Ask("Task Title"),
                            Description = Ask("Task Description")
                        };

                        if (DateTime.TryParse(Ask("Due Date (yyyy-MM-dd)"), out DateTime due))
                        {
                            task.DueDate = due;
                            taskRepo.AddTask(task);
                            Console.WriteLine("Task added.");
                        }
                        else
                        {
                            Console.WriteLine("Invalid date.");
                        }
                        break;

                    case "9":
                        var myTasks = taskRepo.GetAllTasks().Where(t => t.UserId == currentUser.UserId);
                        foreach (var t in myTasks)
                            Console.WriteLine($"{t.Title} - Due: {t.DueDate.ToShortDateString()}");
                        break;

                    case "10":
                        if (!IsManagerOrAdmin(currentUser))
                        {
                            Console.WriteLine("Not authorized.");
                            break;
                        }

                        var ann = new Announcement
                        {
                            Title = Ask("Announcement Title"),
                            Message = Ask("Message"),
                            CreatedAt = DateTime.Now
                        };
                        announcementRepo.AddAnnouncement(ann);
                        Console.WriteLine("Announcement added.");
                        break;

                    case "11":
                        if (!IsManagerOrAdmin(currentUser))
                        {
                            Console.WriteLine("Not authorized.");
                            break;
                        }

                        var allAnns = announcementRepo.GetAllAnnouncements();
                        if (!allAnns.Any())
                        {
                            Console.WriteLine("No announcements to delete.");
                            break;
                        }

                        for (int i = 0; i < allAnns.Count; i++)
                            Console.WriteLine($"{i + 1}. {allAnns[i].Title}");

                        if (int.TryParse(Console.ReadLine(), out int annIdx) && annIdx > 0 && annIdx <= allAnns.Count)
                        {
                            announcementRepo.DeleteAnnouncement(allAnns[annIdx - 1].AnnouncementId);
                            Console.WriteLine("Announcement deleted.");
                        }
                        break;

                    case "0":
                        Console.WriteLine("Goodbye!");
                        running = false;
                        break;

                    default:
                        Console.WriteLine("Invalid option.");
                        break;
                }
            }
        }

        static string Ask(string prompt)
        {
            Console.Write($"{prompt}: ");
            return Console.ReadLine() ?? "";
        }

        static bool IsManagerOrAdmin(User user) =>
            user.Role.Equals("admin", StringComparison.OrdinalIgnoreCase)
            || user.Role.Equals("manager", StringComparison.OrdinalIgnoreCase);

        static bool IsAdmin(User user) =>
            user.Role.Equals("admin", StringComparison.OrdinalIgnoreCase);

        static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        static bool IsValidPassword(string password)
        {
            // At least one upper, one lower, one digit, minimum 6 characters
            return Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$");
        }
    }
}