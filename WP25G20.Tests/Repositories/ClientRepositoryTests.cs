using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;
using WP25G20.Repositories;
using Xunit;

namespace WP25G20.Tests.Repositories
{
    public class ClientRepositoryTests
    {
        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidClient_ReturnsClient()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            var repository = new ClientRepository(context);

            var client = new Client
            {
                CompanyName = "Test Company",
                Email = "test@example.com",
                IsActive = true
            };

            // Act
            var result = await repository.CreateAsync(client);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(client.CompanyName, result.CompanyName);
            Assert.True(result.Id > 0);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_ExistingId_ReturnsClient()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            var repository = new ClientRepository(context);

            var client = new Client
            {
                CompanyName = "Test Company",
                Email = "test@example.com",
                IsActive = true
            };

            var created = await repository.CreateAsync(client);

            // Act
            var result = await repository.GetByIdAsync(created.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(created.Id, result.Id);
            Assert.Equal(created.CompanyName, result.CompanyName);
        }
    }
}
