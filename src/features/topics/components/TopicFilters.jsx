import React, {useState, useEffect, useCallback} from "react";
import listService from "@/shared/services/listService";
import { MultiSelect } from "@/shared/components/MultiSelect";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import { LoaderCircleIcon } from "lucide-react";

const TopicFilters = ({handleFiltersSubmit, filters, setFilterValues, isLoading=false, error=''}) => {
    const sortByValues = null;
    const sortOrderValues = null;
    const [demographicValues, setDemographicValues] = useState([]);
    const [regionValues, setRegionValues] = useState([]);
    const [platformValues, setPlatformValues] = useState([]);

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
            const pf_response = await listService.platforms();
            const pf_items = pf_response?.items?.map((item) => ({label: item, value: item}));
            setPlatformValues(pf_items);
        } catch (err) {
            console.error("Error fetching filters:", err);
        }
    }, []);

    useEffect(() => {
        // console.log("changing...");
        fetchFiltersLists();
    }, [fetchFiltersLists]);

    
    return <> 
        <form onSubmit={submitFilters} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search topics..."
                    value={filters.search}
                    onChange={(e) => setFilterValues(e.target.value, "search")}
                />
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
            <div className="max-w-[250px]">
                <MultiSelect 
                    // label="Region"
                    placeholder="Select platform"
                    options={platformValues}
                    value={filters?.platform}
                    selectionMode={'single'}
                    onValueChange={(val) => setFilterValues(val, 'platform')}
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
                variant="accent-purple"
                size="medium"
            >
                {isLoading ? <LoaderCircleIcon className="text-white animate-spin w-full" /> : "Filter"}
            </Button>
        </form>
    </>
}

export default TopicFilters;