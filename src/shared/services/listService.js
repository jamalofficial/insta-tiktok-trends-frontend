import { apiService } from "./api";

export class ListService {

    // Get demographics list 
    async demographics() {
        return await apiService.get(`/lists/demographics`);
    }
    // Get regions list
    async regions() {
        return await apiService.get(`/lists/regions`);
    }
    // Get platforms list
    async platforms() {
        return await apiService.get(`/lists/platforms`);
    }
    // Get categories list
    async categories() {
        return await apiService.get(`/lists/categories`);
    }
}

export const listService = new ListService();
export default listService;
