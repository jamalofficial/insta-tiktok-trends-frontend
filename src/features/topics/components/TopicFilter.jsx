import React, {useState, useEffect, useCallback} from "react";
import listService from "@/shared/services/listService";
import { MultiSelect } from "@/shared/components/MultiSelect";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { SearchIcon } from "lucide-react";

const TopicFilter = ({handleFiltersSubmit, filters, setFilterValues, isLoading=false, error=''}) => {
    // const [filters, setFilters] = useState({
    //     search: "",
    //     sort_by: null,
    //     sort_order: null,
    //     demographic: [], 
    //     region: [],
    //   });
    
    // const [sortByValues, setSortByValues] = useState([
    //     {label: 'Created Date', value: 'created_at'}, 
    //     {label: 'Topic Name', value: 'topic'}
    // ]);
    // const [sortOrderValues, setSortOrderValues] = useState([
    //     {label: 'Descending', value: 'desc'}, 
    //     {label: 'Ascending', value: 'asc'}
    // ]);
    const sortByValues = null;
    const sortOrderValues = null;
    const [demographicValues, setDemographicValues] = useState([]);
    const [regionValues, setRegionValues] = useState([]);

    const submitFilters = (e) => {
        e.preventDefault();
        handleFiltersSubmit(e, filters);
    }

    const fetchFiltersLists = useCallback(async () => {
        try {
            const dem_response = await listService.demographics();
            const dem_items = dem_response?.items?.map((item) => ({label: item, value: item}));
            setDemographicValues(dem_items);
            const reg_response = await listService.regions();
            const reg_items = reg_response?.items?.map((item) => ({label: item, value: item}));
            setRegionValues(reg_items);
        } catch (err) {
            console.error("Error fetching filters:", err);
        }
    }, []);

    useEffect(() => {
        // console.log("changing...");
        fetchFiltersLists();
    }, [fetchFiltersLists]);

    
    return <> 
        <form onSubmit={submitFilters} className="mb-4 flex flex-col md:flex-row gap-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={filters.search}
                    onChange={(e) => setFilterValues(e.target.value, "search")}
                    // onFocus={handleSearchFocus}
                    className="w-full pl-3 pr-10 py-2 h-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Search"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SearchIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="max-w-[250px]">
                <MultiSelect
                // label="Demographic"
                placeholder="Select age range" 
                options={demographicValues}
                value={filters?.demographic}
                responsive={true}
                onValueChange={(val) => setFilterValues(val, 'demographic')}
                />
            </div>
            <div className="max-w-[250px]">
                <MultiSelect 
                    // label="Region"
                    placeholder="Select region"
                    options={regionValues}
                    value={filters?.region}
                    onValueChange={(val) => setFilterValues(val, 'region')}
                />
            </div>
            {sortByValues && 
                <div className="max-w-[250px]">
                    <MultiSelect 
                        // label="Sort By"
                        placeholder="Sort By"
                        selectionMode={'single'}
                        options={sortByValues}
                        value={filters.sort_by}
                        onValueChange={(val) => setFilterValues(val, 'sort_by')}
                    />
                </div>
            }
            {sortOrderValues &&
                <div className="max-w-[250px]">
                    <MultiSelect 
                        // label="Region"
                        placeholder="Sort Order"
                        options={sortOrderValues}
                        value={filters?.sort_order}
                        onValueChange={(val) => setFilterValues(val, 'sort_order')}
                    />
                </div>
            }
            <Button
                type="submit"
                className="px-4 py-2 self-center"
                disabled={isLoading}
            >
                {isLoading ? <LoadingSpinner size="small" /> : "Filter"}
            </Button>
        </form>
    </>
}

export default TopicFilter;