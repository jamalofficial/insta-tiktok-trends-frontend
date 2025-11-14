import { apiService } from "./api";

const endpoint = "/kw-metrics";

export class TopKeywordService {

  async getKw_matric(keywordId) {
    return await apiService.get(`${endpoint}/${keywordId}`);
  }
  // Get paginated topics
  async getTopKeywords(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);
    // console.log("filters", params);
  // Expected filters object example:
  // {
  //   demographic: ["16-17", "18-24", "25-34", "35+", "4-15", "Others"],
  //   region: []
  // }
  // Required format: filters[demographic]=16-17&filters[demographic]=18-24&...
  if (params.filters && typeof params.filters === "object") {
    queryParams.append('filters', JSON.stringify(params.filters));
    // Object.entries(params.filters).forEach(([filterName, values]) => {
    //   if(!['sort_by', 'sort_order', 'search'].includes(filterName)){
    //     if (Array.isArray(values)) {
    //       values.forEach(value => {
    //         queryParams.append(`filters[${filterName}][]`, value);
    //       });
    //     }
    //     else{
    //       queryParams.append(`filters[${filterName}]`, values);
    //     }
    //   }
    // });
  }

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}/top/?${queryString}` : `${endpoint}/top/`;

    return await apiService.get(url);
  }
}

export const topKeywordService = new TopKeywordService();
export default topKeywordService;
