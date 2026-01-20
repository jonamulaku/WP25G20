using Moq;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using WP25G20.Services;
using Xunit;

namespace WP25G20.Tests.Services
{
    public class TaskServiceTests
    {
        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidTask_ReturnsTaskDTO()
        {
            // Arrange
            var mockRepository = new Mock<ITaskRepository>();
            var mockCampaignRepository = new Mock<ICampaignRepository>();
            var mockActivityLog = new Mock<IActivityLogRepository>();
            var mockContext = new Mock<ApplicationDbContext>();

            var service = new TaskService(
                mockRepository.Object,
                mockCampaignRepository.Object,
                mockActivityLog.Object,
                mockContext.Object);

            var dto = new TaskCreateDTO
            {
                Title = "Test Task",
                CampaignId = 1,
                Description = "Test Description"
            };

            var createdTask = new Task
            {
                Id = 1,
                Title = dto.Title,
                CampaignId = dto.CampaignId,
                Description = dto.Description,
                Status = TaskStatus.Pending,
                Priority = TaskPriority.Medium
            };

            mockRepository.Setup(r => r.CreateAsync(It.IsAny<Task>()))
                .ReturnsAsync(createdTask);

            // Act
            var result = await service.CreateAsync(dto, "user-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Title, result.Title);
        }
    }
}
