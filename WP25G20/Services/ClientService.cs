using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using System.Security.Claims;

namespace WP25G20.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ApplicationDbContext _context;
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<ClientService> _logger;

        public ClientService(
            IClientRepository repository,
            IActivityLogRepository activityLogRepository,
            ApplicationDbContext context,
            IAuthorizationHelper authorizationHelper,
            IHttpContextAccessor httpContextAccessor,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<ClientService> logger)
        {
            _repository = repository;
            _activityLogRepository = activityLogRepository;
            _context = context;
            _authorizationHelper = authorizationHelper;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task<PagedResultDTO<ClientDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null)
        {
            // Get all users with Client role
            var clientRoleUsers = await _userManager.GetUsersInRoleAsync("Client");
            
            // Get all Client entities with their campaigns
            var allClients = await _context.Clients
                .Include(c => c.CreatedBy)
                .Include(c => c.Campaigns)
                .ToListAsync();

            // Create a dictionary of clients by email (case-insensitive)
            var clientsByEmail = allClients.ToDictionary(c => c.Email.ToLower(), c => c);

            // Build combined list of ClientDTOs from both users and Client entities
            var allClientDTOs = new List<ClientDTO>();

            foreach (var user in clientRoleUsers)
            {
                if (string.IsNullOrEmpty(user.Email)) continue;

                var emailLower = user.Email.ToLower();
                
                // Check if user has a corresponding Client entity
                if (clientsByEmail.TryGetValue(emailLower, out var clientEntity))
                {
                    // User has a Client entity - use that data
                    allClientDTOs.Add(new ClientDTO
                    {
                        Id = clientEntity.Id,
                        CompanyName = clientEntity.CompanyName,
                        ContactPerson = clientEntity.ContactPerson,
                        Email = clientEntity.Email,
                        Phone = clientEntity.Phone,
                        Address = clientEntity.Address,
                        Notes = clientEntity.Notes,
                        IsActive = clientEntity.IsActive,
                        CreatedAt = clientEntity.CreatedAt,
                        CampaignCount = clientEntity.Campaigns.Count(camp => camp.Status != CampaignStatus.Cancelled && camp.Status != CampaignStatus.Pending)
                    });
                }
                else
                {
                    // User doesn't have a Client entity - create ClientDTO from user data
                    // Use Id = 0 to indicate no Client entity exists
                    var contactPerson = string.IsNullOrEmpty(user.FirstName) && string.IsNullOrEmpty(user.LastName)
                        ? null
                        : $"{user.FirstName} {user.LastName}".Trim();

                    allClientDTOs.Add(new ClientDTO
                    {
                        Id = 0, // 0 indicates no Client entity exists
                        CompanyName = user.Email, // Use email as company name if no Client entity
                        ContactPerson = contactPerson,
                        Email = user.Email,
                        Phone = user.PhoneNumber,
                        Address = null,
                        Notes = null,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        CampaignCount = 0
                    });
                }
            }

            // Apply permission filtering (if userId provided and not admin, filter to only show user's own clients)
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                // For non-admin users, only show clients they created
                // Users without Client entities (Id = 0) don't have a CreatedById, so exclude them
                var userCreatedClientIds = allClients
                    .Where(c => c.CreatedById == userId)
                    .Select(c => c.Id)
                    .ToHashSet();
                
                allClientDTOs = allClientDTOs.Where(c => c.Id != 0 && userCreatedClientIds.Contains(c.Id)).ToList();
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var searchLower = filter.SearchTerm.ToLower();
                allClientDTOs = allClientDTOs.Where(c => 
                    c.CompanyName.ToLower().Contains(searchLower) ||
                    c.Email.ToLower().Contains(searchLower) ||
                    (c.ContactPerson != null && c.ContactPerson.ToLower().Contains(searchLower))
                ).ToList();
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("IsActive"))
                {
                    var isActive = bool.Parse(filter.Filters["IsActive"]);
                    allClientDTOs = allClientDTOs.Where(c => c.IsActive == isActive).ToList();
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                allClientDTOs = filter.SortBy.ToLower() switch
                {
                    "companyname" => filter.SortDescending 
                        ? allClientDTOs.OrderByDescending(c => c.CompanyName).ToList()
                        : allClientDTOs.OrderBy(c => c.CompanyName).ToList(),
                    "email" => filter.SortDescending
                        ? allClientDTOs.OrderByDescending(c => c.Email).ToList()
                        : allClientDTOs.OrderBy(c => c.Email).ToList(),
                    "createdat" => filter.SortDescending
                        ? allClientDTOs.OrderByDescending(c => c.CreatedAt).ToList()
                        : allClientDTOs.OrderBy(c => c.CreatedAt).ToList(),
                    _ => allClientDTOs.OrderByDescending(c => c.CreatedAt).ToList()
                };
            }
            else
            {
                allClientDTOs = allClientDTOs.OrderByDescending(c => c.CreatedAt).ToList();
            }

            // Get total count after all filtering
            var totalCount = allClientDTOs.Count;

            // Apply pagination
            var items = allClientDTOs
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return new PagedResultDTO<ClientDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ClientDTO?> GetByIdAsync(int id, string? userId = null)
        {
            Client? client = null;
            ApplicationUser? clientUser = null;

            if (id == 0)
            {
                // Id = 0 means user with Client role but no Client entity
                // This shouldn't be called with id = 0, but if it is, we can't look it up
                // The frontend should use email-based lookup instead
                return null;
            }

            client = await _repository.GetByIdWithCampaignsAsync(id);
            if (client == null) return null;

            // Verify that the client has a corresponding user with Client role
            clientUser = await _userManager.FindByEmailAsync(client.Email);
            if (clientUser == null)
            {
                return null; // Client exists but no user account - don't show it
            }

            var userRoles = await _userManager.GetRolesAsync(clientUser);
            if (!userRoles.Contains("Client"))
            {
                return null; // User exists but doesn't have Client role - don't show it
            }

            // Check permissions if userId provided
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                
                if (!isAdmin && !await _authorizationHelper.CanViewClientAsync(id, userId, isAdmin))
                {
                    throw new UnauthorizedAccessException("You do not have permission to view this client.");
                }

                // Log read activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Read",
                    EntityType = "Client",
                    EntityId = id,
                    Description = $"Viewed client: {client.CompanyName}",
                    UserId = userId
                });
            }

            return new ClientDTO
            {
                Id = client.Id,
                CompanyName = client.CompanyName,
                ContactPerson = client.ContactPerson,
                Email = client.Email,
                Phone = client.Phone,
                Address = client.Address,
                Notes = client.Notes,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
                CampaignCount = client.Campaigns.Count(c => c.Status != CampaignStatus.Cancelled && c.Status != CampaignStatus.Pending)
            };
        }

        public async Task<ClientDTO> CreateAsync(ClientCreateDTO dto, string userId)
        {
            // Check if email already exists in clients
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"A client with email '{dto.Email}' already exists.");
            }

            // Check if user with this email already exists
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            ApplicationUser clientUser;

            if (existingUser == null)
            {
                // Create new user account with password
                clientUser = new ApplicationUser
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    EmailConfirmed = true,
                    FirstName = dto.ContactPerson?.Split(' ').FirstOrDefault(),
                    LastName = dto.ContactPerson?.Split(' ').Skip(1).FirstOrDefault(),
                    IsActive = true
                };

                var createResult = await _userManager.CreateAsync(clientUser, dto.Password);
                if (!createResult.Succeeded)
                {
                    var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create user account: {errors}");
                }

                _logger.LogInformation($"Created new user account for client: {dto.Email}");
            }
            else
            {
                // User already exists - check if they already have Client role
                var userRoles = await _userManager.GetRolesAsync(existingUser);
                if (userRoles.Contains("Client"))
                {
                    // User already has Client role - check if Client entity exists
                    var existingClient = await _context.Clients.FirstOrDefaultAsync(c => c.Email.ToLower() == dto.Email.ToLower());
                    if (existingClient != null)
                    {
                        throw new InvalidOperationException($"A client with email '{dto.Email}' already exists.");
                    }
                    // Client entity doesn't exist but user has Client role - we'll create it below
                }
                clientUser = existingUser;
            }

            // Ensure Client role exists
            if (!await _roleManager.RoleExistsAsync("Client"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Client"));
                _logger.LogInformation("Client role created");
            }

            // Assign Client role if not already assigned
            if (!await _userManager.IsInRoleAsync(clientUser, "Client"))
            {
                await _userManager.AddToRoleAsync(clientUser, "Client");
                _logger.LogInformation($"Assigned Client role to user: {dto.Email}");
            }

            // Create Client entity
            var client = new Client
            {
                CompanyName = dto.CompanyName,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Notes = dto.Notes,
                IsActive = true,
                CreatedById = userId
            };

            var created = await _repository.CreateAsync(client);

            // Sync client data with user
            clientUser.FirstName = created.ContactPerson?.Split(' ').FirstOrDefault();
            clientUser.LastName = created.ContactPerson?.Split(' ').Skip(1).FirstOrDefault();
            clientUser.IsActive = created.IsActive;
            await _userManager.UpdateAsync(clientUser);
            _logger.LogInformation($"Synced user account with client data: {created.Email}");

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Create",
                EntityType = "Client",
                EntityId = created.Id,
                Description = $"Created client: {created.CompanyName}",
                UserId = userId
            });

            return new ClientDTO
            {
                Id = created.Id,
                CompanyName = created.CompanyName,
                ContactPerson = created.ContactPerson,
                Email = created.Email,
                Phone = created.Phone,
                Address = created.Address,
                Notes = created.Notes,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                CampaignCount = 0
            };
        }

        public async Task<ClientDTO?> UpdateAsync(int id, ClientUpdateDTO dto, string userId)
        {
            Client? client = null;
            ApplicationUser? clientUser = null;

            // Handle case where id = 0 (user with Client role but no Client entity)
            if (id == 0)
            {
                // Look up user by email from the DTO
                clientUser = await _userManager.FindByEmailAsync(dto.Email);
                if (clientUser == null)
                {
                    throw new InvalidOperationException($"Cannot update client: No user account exists for email '{dto.Email}'. Please create a user account with Client role first.");
                }

                var userRoles = await _userManager.GetRolesAsync(clientUser);
                if (!userRoles.Contains("Client"))
                {
                    throw new InvalidOperationException($"Cannot update client: User with email '{dto.Email}' does not have the 'Client' role. Please assign the Client role to this user first.");
                }

                // Check if a Client entity already exists for this email
                var existingClient = await _context.Clients.FirstOrDefaultAsync(c => c.Email.ToLower() == dto.Email.ToLower());
                if (existingClient != null)
                {
                    // Client entity exists - use it and update normally
                    client = existingClient;
                    id = existingClient.Id; // Update id for permission checks below
                }
                else
                {
                    // No Client entity exists - create one
                    client = new Client
                    {
                        CompanyName = dto.CompanyName,
                        ContactPerson = dto.ContactPerson,
                        Email = dto.Email,
                        Phone = dto.Phone,
                        Address = dto.Address,
                        Notes = dto.Notes,
                        IsActive = dto.IsActive,
                        CreatedById = userId
                    };
                    client = await _repository.CreateAsync(client);
                    _logger.LogInformation($"Created Client entity for user with Client role: {dto.Email}");
                    
                    // Log activity
                    await _activityLogRepository.CreateAsync(new ActivityLog
                    {
                        Action = "Create",
                        EntityType = "Client",
                        EntityId = client.Id,
                        Description = $"Created client entity from update: {client.CompanyName}",
                        UserId = userId
                    });
                }
            }
            else
            {
                // Normal case: id is not 0, get existing Client entity
                client = await _repository.GetByIdAsync(id);
                if (client == null) return null;

                // Verify that the client has a corresponding user with Client role
                clientUser = await _userManager.FindByEmailAsync(client.Email);
                if (clientUser == null)
                {
                    throw new InvalidOperationException($"Cannot update client: No user account exists for email '{client.Email}'. Please create a user account with Client role first.");
                }

                var userRoles = await _userManager.GetRolesAsync(clientUser);
                if (!userRoles.Contains("Client"))
                {
                    throw new InvalidOperationException($"Cannot update client: User with email '{client.Email}' does not have the 'Client' role. Please assign the Client role to this user first.");
                }
            }

            // Ensure clientUser is set (should be set above, but double-check)
            if (clientUser == null)
            {
                clientUser = await _userManager.FindByEmailAsync(client.Email);
                if (clientUser == null)
                {
                    throw new InvalidOperationException($"Cannot update client: No user account exists for email '{client.Email}'.");
                }
            }

            // Check permissions
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            // For id = 0 cases, we just created the client, so use the new id for permission checks
            var clientIdForPermissions = id == 0 ? client.Id : id;
            if (!isAdmin && !await _authorizationHelper.CanUpdateClientAsync(clientIdForPermissions, userId, isAdmin))
            {
                throw new UnauthorizedAccessException("You do not have permission to update this client.");
            }

            // Check if email already exists (excluding current client)
            var clientIdForEmailCheck = id == 0 ? client.Id : id;
            if (client.Email != dto.Email && await _repository.EmailExistsAsync(dto.Email, clientIdForEmailCheck))
            {
                throw new InvalidOperationException($"A client with email '{dto.Email}' already exists.");
            }

            var oldValues = $"{{\"CompanyName\":\"{client.CompanyName}\",\"Email\":\"{client.Email}\",\"IsActive\":{client.IsActive}}}";

            // Ensure Client role exists (migrated from Scripts/CreateUsersForExistingClients.cs)
            if (!await _roleManager.RoleExistsAsync("Client"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Client"));
                _logger.LogInformation("Client role created during client update");
            }

            // Sync ApplicationUser with client changes (migrated from Scripts/CreateUsersForExistingClients.cs)
            // clientUser is already verified to exist and have Client role above
            bool userUpdated = false;

            // If email is changing, verify the new email user has Client role
            if (client.Email != dto.Email)
            {
                // Check if new email is already taken by another user
                var existingUserWithNewEmail = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUserWithNewEmail != null && existingUserWithNewEmail.Id != clientUser.Id)
                {
                    // Verify the new email user has Client role
                    var newEmailUserRoles = await _userManager.GetRolesAsync(existingUserWithNewEmail);
                    if (!newEmailUserRoles.Contains("Client"))
                    {
                        throw new InvalidOperationException($"A user with email '{dto.Email}' already exists but does not have the 'Client' role. Please assign the Client role to this user first.");
                    }
                    // If we're changing to a different user's email, we should update the client to point to that user
                    // But this is complex - for now, we'll just update the current user's email
                    throw new InvalidOperationException($"A user with email '{dto.Email}' already exists. Cannot change client email to an existing user's email.");
                }

                clientUser.Email = dto.Email;
                clientUser.UserName = dto.Email;
                clientUser.EmailConfirmed = true;
                userUpdated = true;
            }

                // Update ContactPerson (FirstName/LastName) if changed
                var newFirstName = dto.ContactPerson?.Split(' ').FirstOrDefault();
                var newLastName = dto.ContactPerson?.Split(' ').Skip(1).FirstOrDefault();
                if (clientUser.FirstName != newFirstName || clientUser.LastName != newLastName)
                {
                    clientUser.FirstName = newFirstName;
                    clientUser.LastName = newLastName;
                    userUpdated = true;
                }

                // Update IsActive status
                if (clientUser.IsActive != dto.IsActive)
                {
                    clientUser.IsActive = dto.IsActive;
                    userUpdated = true;
                }

                // Ensure user has Client role (migrated from Scripts/CreateUsersForExistingClients.cs)
                if (!await _userManager.IsInRoleAsync(clientUser, "Client"))
                {
                    await _userManager.AddToRoleAsync(clientUser, "Client");
                    _logger.LogInformation($"Added Client role to existing user: {dto.Email}");
                }

            if (userUpdated)
            {
                await _userManager.UpdateAsync(clientUser);
                _logger.LogInformation($"Updated user account for client: {dto.Email}");
            }

            client.CompanyName = dto.CompanyName;
            client.ContactPerson = dto.ContactPerson;
            client.Email = dto.Email;
            client.Phone = dto.Phone;
            client.Address = dto.Address;
            client.Notes = dto.Notes;
            client.IsActive = dto.IsActive;

            var updated = await _repository.UpdateAsync(client);
            
            // Reload with campaigns included for count
            var clientWithCampaigns = await _repository.GetByIdWithCampaignsAsync(updated.Id);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Update",
                EntityType = "Client",
                EntityId = updated.Id,
                Description = $"Updated client: {updated.CompanyName}",
                Changes = oldValues,
                UserId = userId
            });

            return new ClientDTO
            {
                Id = updated.Id,
                CompanyName = updated.CompanyName,
                ContactPerson = updated.ContactPerson,
                Email = updated.Email,
                Phone = updated.Phone,
                Address = updated.Address,
                Notes = updated.Notes,
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                CampaignCount = clientWithCampaigns?.Campaigns.Count(c => c.Status != CampaignStatus.Cancelled && c.Status != CampaignStatus.Pending) ?? 0
            };
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var client = await _repository.GetByIdWithCampaignsAsync(id);
            if (client == null) return false;

            // Check permissions (only admins can delete)
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can delete clients.");
            }

            // Check if client has any campaigns (database constraint prevents deletion if any exist)
            var allCampaigns = client.Campaigns.ToList();
            if (allCampaigns.Any())
            {
                var activeCampaigns = allCampaigns.Where(c => c.Status != CampaignStatus.Cancelled && c.Status != CampaignStatus.Pending).ToList();
                if (activeCampaigns.Any())
                {
                    throw new InvalidOperationException($"Cannot delete client '{client.CompanyName}' because it has {activeCampaigns.Count} active campaign(s). Please cancel or delete the campaigns first.");
                }
                else
                {
                    // Only pending/cancelled campaigns exist - delete related entities first, then campaigns
                    var campaignIds = allCampaigns.Select(c => c.Id).ToList();
                    
                    // Delete CampaignUsers (cascade should handle this, but being explicit)
                    var campaignUsers = await _context.CampaignUsers
                        .Where(cu => campaignIds.Contains(cu.CampaignId))
                        .ToListAsync();
                    if (campaignUsers.Any())
                    {
                        _context.CampaignUsers.RemoveRange(campaignUsers);
                    }
                    
                    // Delete Invoices related to these campaigns (they have SetNull, but let's be safe)
                    var campaignInvoices = await _context.Invoices
                        .Where(i => i.CampaignId.HasValue && campaignIds.Contains(i.CampaignId.Value))
                        .ToListAsync();
                    if (campaignInvoices.Any())
                    {
                        // Set CampaignId to null instead of deleting invoices
                        foreach (var invoice in campaignInvoices)
                        {
                            invoice.CampaignId = null;
                        }
                        _context.Invoices.UpdateRange(campaignInvoices);
                    }
                    
                    // Tasks will cascade delete automatically, so we don't need to handle them
                    
                    // Now delete the campaigns
                    _context.Campaigns.RemoveRange(allCampaigns);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Deleted {allCampaigns.Count} pending/cancelled campaign(s) and related entities for client '{client.CompanyName}' before client deletion");
                }
            }

            // Check if client has invoices (these block deletion due to Restrict constraint)
            var clientInvoices = await _context.Invoices.Where(i => i.ClientId == id).ToListAsync();
            if (clientInvoices.Any())
            {
                // Check if invoices have payments (Payments have Restrict on InvoiceId)
                var invoiceIds = clientInvoices.Select(i => i.Id).ToList();
                var payments = await _context.Payments.Where(p => invoiceIds.Contains(p.InvoiceId)).ToListAsync();
                
                if (payments.Any())
                {
                    throw new InvalidOperationException($"Cannot delete client '{client.CompanyName}' because it has {clientInvoices.Count} invoice(s) with {payments.Count} payment(s). Please delete the payments and invoices first.");
                }
                
                // No payments - we can delete the invoices
                _context.Invoices.RemoveRange(clientInvoices);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Deleted {clientInvoices.Count} invoice(s) for client '{client.CompanyName}' before client deletion");
            }

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                // Log activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Delete",
                    EntityType = "Client",
                    EntityId = id,
                    Description = $"Deleted client: {client.CompanyName}",
                    UserId = userId
                });
            }

            return deleted;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }
    }
}
