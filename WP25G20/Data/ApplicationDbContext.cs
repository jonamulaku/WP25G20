using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WP25G20.Models;
using TaskModel = WP25G20.Models.Task;

namespace WP25G20.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<Client> Clients { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<CampaignUser> CampaignUsers { get; set; }
        public DbSet<TaskFile> TaskFiles { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ApprovalRequest> ApprovalRequests { get; set; }
        public DbSet<ApprovalComment> ApprovalComments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships and constraints
            builder.Entity<Client>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<Campaign>(entity =>
            {
                entity.HasOne(e => e.Client)
                    .WithMany(c => c.Campaigns)
                    .HasForeignKey(e => e.ClientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Service)
                    .WithMany(s => s.Campaigns)
                    .HasForeignKey(e => e.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<TeamMember>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });

            builder.Entity<TaskModel>(entity =>
            {
                entity.HasOne(e => e.Campaign)
                    .WithMany(c => c.Tasks)
                    .HasForeignKey(e => e.CampaignId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.AssignedToTeamMember)
                    .WithMany(tm => tm.AssignedTasks)
                    .HasForeignKey(e => e.AssignedToTeamMemberId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.AssignedTo)
                    .WithMany(u => u.AssignedTasks)
                    .HasForeignKey(e => e.AssignedToId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<Invoice>(entity =>
            {
                entity.HasIndex(e => e.InvoiceNumber).IsUnique();
                entity.HasOne(e => e.Client)
                    .WithMany(c => c.Invoices)
                    .HasForeignKey(e => e.ClientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Campaign)
                    .WithMany(c => c.Invoices)
                    .HasForeignKey(e => e.CampaignId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<Payment>(entity =>
            {
                entity.HasIndex(e => e.PaymentNumber).IsUnique();
                entity.HasOne(e => e.Invoice)
                    .WithMany(i => i.Payments)
                    .HasForeignKey(e => e.InvoiceId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ProcessedBy)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<CampaignUser>(entity =>
            {
                entity.HasIndex(e => new { e.CampaignId, e.UserId }).IsUnique();
                entity.HasOne(e => e.Campaign)
                    .WithMany(c => c.CampaignUsers)
                    .HasForeignKey(e => e.CampaignId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<TaskFile>(entity =>
            {
                entity.HasOne(e => e.Task)
                    .WithMany(t => t.TaskFiles)
                    .HasForeignKey(e => e.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.UploadedBy)
                    .WithMany()
                    .HasForeignKey(e => e.UploadedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<TaskComment>(entity =>
            {
                entity.HasOne(e => e.Task)
                    .WithMany(t => t.TaskComments)
                    .HasForeignKey(e => e.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<ActivityLog>(entity =>
            {
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<Message>(entity =>
            {
                entity.HasOne(e => e.SenderUser)
                    .WithMany()
                    .HasForeignKey(e => e.SenderUserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.RecipientUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecipientUserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.Client)
                    .WithMany()
                    .HasForeignKey(e => e.ClientId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.TeamMember)
                    .WithMany()
                    .HasForeignKey(e => e.TeamMemberId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.ParentMessage)
                    .WithMany(m => m.Replies)
                    .HasForeignKey(e => e.ParentMessageId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => new { e.Type, e.Status });
            });

            builder.Entity<ApprovalRequest>(entity =>
            {
                entity.HasOne(e => e.Campaign)
                    .WithMany()
                    .HasForeignKey(e => e.CampaignId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Task)
                    .WithMany()
                    .HasForeignKey(e => e.TaskId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.ApprovedBy)
                    .WithMany()
                    .HasForeignKey(e => e.ApprovedById)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => new { e.CampaignId, e.Status });
                entity.HasIndex(e => e.CreatedAt);
            });

            builder.Entity<ApprovalComment>(entity =>
            {
                entity.HasOne(e => e.ApprovalRequest)
                    .WithMany(ar => ar.Comments)
                    .HasForeignKey(e => e.ApprovalRequestId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => e.CreatedAt);
            });
        }
    }
}
