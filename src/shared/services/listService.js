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
}

export const listService = new ListService();
export default listService;
