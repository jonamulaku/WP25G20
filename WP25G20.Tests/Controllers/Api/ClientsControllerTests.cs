using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using WP25G20.Controllers.Api;
using WP25G20.DTOs;
using WP25G20.Services;
using Xunit;

namespace WP25G20.Tests.Controllers.Api
{
    public class ClientsControllerTests
    {
        [Fact]
        public async Task GetById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var mockService = new Mock<IClientService>();
            var controller = new ClientsController(mockService.Object);

            var clientDto = new ClientDTO
            {
                Id = 1,
                CompanyName = "Test Company",
                Email = "test@example.com"
            };

            mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync(clientDto);

            // Act
            var result = await controller.GetById(1);

            // Assert
            var okResult = Assert.IsType<ActionResult<ClientDTO>>(result);
            var actionResult = Assert.IsType<OkObjectResult>(okResult.Result);
            var returnedClient = Assert.IsType<ClientDTO>(actionResult.Value);
            Assert.Equal(1, returnedClient.Id);
        }

        [Fact]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var mockService = new Mock<IClientService>();
            var controller = new ClientsController(mockService.Object);

            mockService.Setup(s => s.GetByIdAsync(999))
                .ReturnsAsync((ClientDTO?)null);

            // Act
            var result = await controller.GetById(999);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ClientDTO>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }
    }
}
