using Moq;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using WP25G20.Services;
using Xunit;

namespace WP25G20.Tests.Services
{
    public class CampaignServiceTests
    {
        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidCampaign_ReturnsCampaignDTO()
        {
            // Arrange
            var mockRepository = new Mock<ICampaignRepository>();
            var mockClientRepository = new Mock<IClientRepository>();
            var mockServiceRepository = new Mock<IServiceRepository>();
            var mockActivityLog = new Mock<IActivityLogRepository>();
            var mockContext = new Mock<ApplicationDbContext>();
            var mockUserManager = new Mock<Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>>(
                Mock.Of<Microsoft.AspNetCore.Identity.IUserStore<ApplicationUser>>(),
                null, null, null, null, null, null, null, null);

            var service = new CampaignService(
                mockRepository.Object,
                mockClientRepository.Object,
                mockServiceRepository.Object,
                mockActivityLog.Object,
                mockContext.Object,
                mockUserManager.Object);

            var dto = new CampaignCreateDTO
            {
                Name = "Test Campaign",
                ClientId = 1,
                ServiceId = 1,
                StartDate = DateTime.UtcNow,
                Budget = 10000
            };

            var createdCampaign = new Campaign
            {
                Id = 1,
                Name = dto.Name,
                ClientId = dto.ClientId,
                ServiceId = dto.ServiceId,
                StartDate = dto.StartDate,
                Budget = dto.Budget,
                Status = CampaignStatus.Pending
            };

            mockRepository.Setup(r => r.CreateAsync(It.IsAny<Campaign>()))
                .ReturnsAsync(createdCampaign);

            // Act
            var result = await service.CreateAsync(dto, "user-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
        }
    }
}
