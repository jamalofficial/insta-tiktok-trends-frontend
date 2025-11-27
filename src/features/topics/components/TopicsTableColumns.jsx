// Shape of our data (see also Zod schema in production, if needed).
// Provided for reference/documentation.\
import { TelescopeIcon, EyeIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const columns = [
  {
    accessorKey: "topic",
    header: ({ column, table }) => {
        const { actions } = table.options.meta;
        return (
          <Button
            variant="ghost"
            onClick={() => {
                console.log("get sorting", column.getIsSorted())
                column.toggleSorting(column.getIsSorted() == 'asc');
                actions.handleSorting(column.id, column.getIsSorted() == 'asc' ? 'desc' : 'asc');
            }}
          >
            Topic
            {!column.getIsSorted() && <ArrowUpDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'asc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'desc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
    cell: ({row, table}) => {
        const { actions } = table.options.meta;
        const topic = row.original;
        return (
        <div className="text-sm font-medium text-gray-900 cursor-pointer"
            onClick={() => actions.handleViewResults(topic)}
        >
            {row.getValue("topic")}
            <span className="bg-indigo-400 font-normal ml-2 px-1 rounded-2xl text-white text-xs">{topic?.platform}</span>
        </div>
        );
    }
  },
  {
    accessorKey: "topic_results",
    header: "Results",
    cell: ({ row }) => {
        return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.getValue("topic_results")?.length} results
        </span>
        );
    }
  },
  {
    accessorKey: "created_at",
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
            Created
            {!column.getIsSorted() && <ArrowUpDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'asc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
            {column.getIsSorted() == 'desc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
          </Button>
        )
      },
    cell: ({ row }) => {
        return formatDate(row.getValue("created_at"));
    }
  },
  {
    accessorKey: "",
    header: "Action",
    cell: ({row, table}) => {
        const topic = row.original;
        const { actions } = table.options.meta;
        return (
            <div className="flex gap-2 items-center whitespace-nowrap text-sm font-medium">
                {/* <button
                className=" text-green-600 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                title="Explore Topic"
                onClick={() => handleScrapTopic(topic)}
                >
                <CompassIcon />
                </button> */}
                <button
                className=" text-green-600 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                title="Explore Topic"
                onClick={() => actions.handleExploreTopic(topic)}
                >
                <TelescopeIcon />
                </button>
                <button
                onClick={() => actions.handleViewResults(topic)}
                className=" text-indigo-600 hover:text-indigo-900 transition-colors duration-200 cursor-pointer"
                title="View Results"
                >
                <EyeIcon />
                </button>
                <button
                onClick={() => actions.handleDeleteTopic(topic)}
                className=" text-red-600 hover:text-red-900 transition-colors duration-200 cursor-pointer"
                title="Delete"
                >
                <Trash2Icon />
                </button>
            </div>
        );
    }
  },
]

export { columns }