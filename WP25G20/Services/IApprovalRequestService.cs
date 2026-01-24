using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IApprovalRequestService
    {
        Task<PagedResultDTO<ApprovalRequestDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null);
        Task<ApprovalRequestDTO?> GetByIdAsync(int id, string? userId = null);
        Task<ApprovalRequestDTO> CreateAsync(ApprovalRequestCreateDTO dto, string userId);
        Task<ApprovalRequestDTO?> UpdateAsync(int id, ApprovalRequestUpdateDTO dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<ApprovalRequestDTO?> ProcessApprovalAsync(int id, ApprovalActionDTO actionDto, string userId);
    }
}
