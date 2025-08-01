"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";

import { columns } from "../components/columns";
import { DataPagination } from "../components/data-pagination";
import { useAgentsFilters } from "../../hooks/use-agents-filters";



export const AgentsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentsFilters();

    const trpc = useTRPC();
    // This is making the request
    // const { data, isLoading, isError } = useQuery(trpc.agents.getMany.queryOptions());

    // This has already fetched data, so no need to use isLoading or isError
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable 
                columns={columns} 
                data={data.items} 
                onRowClick={(row) => router.push(`/agents/${row.id}`)}
            />
            <DataPagination 
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState 
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
                />
            )}
        </div>
    );
};



export const AgentsViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Agents"
            description="This may take few seconds..."   
        />
    );
};


export const AgentsViewError = () => {
    return (
        <ErrorState 
            title="Error Loading Agents"
            description="Please try again later"            
        />
    );
};