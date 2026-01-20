using Moq;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using WP25G20.Services;
using Xunit;

namespace WP25G20.Tests.Services
{
    public class ClientServiceTests
    {
        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidClient_ReturnsClientDTO()
        {
            // Arrange
            var mockRepository = new Mock<IClientRepository>();
            var mockActivityLog = new Mock<IActivityLogRepository>();
            var mockContext = new Mock<ApplicationDbContext>();

            var service = new ClientService(mockRepository.Object, mockActivityLog.Object, mockContext.Object);
            var dto = new ClientCreateDTO
            {
                CompanyName = "Test Company",
                Email = "test@example.com"
            };

            var createdClient = new Client
            {
                Id = 1,
                CompanyName = dto.CompanyName,
                Email = dto.Email,
                IsActive = true
            };

            mockRepository.Setup(r => r.CreateAsync(It.IsAny<Client>()))
                .ReturnsAsync(createdClient);

            // Act
            var result = await service.CreateAsync(dto, "user-id");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.CompanyName, result.CompanyName);
            Assert.Equal(dto.Email, result.Email);
        }
    }
}
