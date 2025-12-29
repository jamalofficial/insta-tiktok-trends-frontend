// Shape of our data (see also Zod schema in production, if needed).
// Provided for reference/documentation.\
import { TelescopeIcon, EyeIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};
const formatNumber = (num) => {
  if (num === null || num === undefined) return "N/A";
  return num.toLocaleString();
};
const formatPercentage = (num) => {
  if (num === null || num === undefined) return "N/A";
  return `${num.toFixed(1)}%`;
};

const columns = [
  {
    accessorKey: "relevant_keyword",
    header: ({ column, table }) => {
        const { actions } = table.options.meta;
        return (
          <Button
            variant="ghost"
            onClick={() => {
                column.toggleSorting(column.getIsSorted() == 'asc');
                actions.handleSorting(column.id, column.getIsSorted() == 'asc' ? 'desc' : 'asc');
            }}
          >
            Keyword
            {!column.getIsSorted() && <ArrowUpDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'asc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'desc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
          </Button>
        )
    },
    cell: ({row, table}) => {
        const result = row.original;
        const { actions } = table.options.meta;
        return (
          <div className="flex gap-2 items-center justify-start whitespace-nowrap text-sm font-medium cursor-pointer"
                // className="px-3 py-1 text-xs font-medium"
                onClick={() => {
                  actions.ToggleDetails(result);
                }}
              >
                {row.getValue("relevant_keyword")}
                <span className="bg-indigo-400 font-normal ml-2 px-1 rounded-2xl text-white text-xs">{result?.platform}</span>
                {/* {detailsView?.id == result?.id ? "Hide Details" : "Show Details"} */}
              {/* </button> */}
          </div>
        );
    }
  },
  {
    accessorKey: "search_popularity",
    header: ({ column, table }) => {
      const { actions } = table.options.meta;
      return (
        <Button
          variant="ghost"
          onClick={() => {
              column.toggleSorting(column.getIsSorted() == 'asc');
              actions.handleSorting(column.id, column.getIsSorted() == 'asc' ? 'desc' : 'asc');
          }}
        >
          Popularity
          {!column.getIsSorted() && <ArrowUpDownIcon className="ml-2 h-4 w-4" />}
          {column.getIsSorted() == 'asc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
          {column.getIsSorted() == 'desc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
    cell: ({ row }) => {
        return (
          <div className="text-sm text-gray-900">
            {formatNumber(row.getValue('search_popularity'))}
          </div>
        );
    }
  },
  {
    accessorKey: "topic_results",
    header: ({ column, table }) => {
      const { actions } = table.options.meta;
      return (
        <Button
          variant="ghost"
          onClick={() => {
              column.toggleSorting(column.getIsSorted() == 'asc');
              actions.handleSorting(column.id, column.getIsSorted() == 'asc' ? 'desc' : 'asc');
          }}
        >
          Trend Increase
          {!column.getIsSorted() && <ArrowUpDownIcon className="ml-2 h-4 w-4" />}
          {column.getIsSorted() == 'asc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
          {column.getIsSorted() == 'desc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
    cell: ({ row }) => {
        return (
          <div className="text-sm text-gray-900">
            {formatPercentage(row.getValue('topic_results'))}
          </div>
        );
    }
  },
  {
    accessorKey: "catgory",
    header: "Category",
    cell: ({row}) => {
        const result = row.original;
        // const { actions } = table.options.meta;
        return (
          <div className="flex gap-2 items-center justify-start whitespace-nowrap text-sm font-medium cursor-pointer">
                {result?.category?.name}
          </div>
        );
    }
  },
  {
    accessorKey: "updated_at",
    header: "Last Update",
    cell: ({ row }) => {
        return <span className="text-sm text-gray-500">{formatDate(row.getValue('updated_at'))}</span>;
    }
  },
  {
    header: "Action",
    cell: ({row, table}) => {
        const result = row.original;
        const { actions } = table.options.meta;
        return (
            <div className="flex gap-2 items-center whitespace-nowrap text-sm font-medium">
                <button
                  className="px-3 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  onClick={() => {
                    actions.ToggleDetails(result);
                  }}
                >
                  Show Details
                  {/* {detailsView?.id == result?.id ? "Hide Details" : "Show Details"} */}
                </button>
            </div>
        );
    }
  },
]

export { columns }