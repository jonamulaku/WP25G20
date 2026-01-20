using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Public
{
    [Area("Public")]
    public class CampaignsController : Controller
    {
        private readonly ICampaignService _campaignService;

        public CampaignsController(ICampaignService campaignService)
        {
            _campaignService = campaignService;
        }

        public async Task<IActionResult> Index(FilterDTO? filter)
        {
            filter ??= new FilterDTO { PageNumber = 1, PageSize = 10 };
            
            // Only show active campaigns for public area
            filter.Filters ??= new Dictionary<string, string>();
            filter.Filters["Status"] = "Active";
            
            var result = await _campaignService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var campaign = await _campaignService.GetByIdAsync(id);
            if (campaign == null || campaign.Status != "Active")
            {
                return NotFound();
            }
            return View(campaign);
        }
    }
}
