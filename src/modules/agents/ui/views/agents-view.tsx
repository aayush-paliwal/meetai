"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";



export const AgentsView = () => {

    const trpc = useTRPC();
    // This is making the request
    // const { data, isLoading, isError } = useQuery(trpc.agents.getMany.queryOptions());

    // This has already fetched data, so no need to use isLoading or isError
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data} />
            {data.length === 0 && (
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
            title="Loading agents"
            description="This may take few seconds..."   
        />
    );
};


export const AgentsViewError = () => {
    return (
        <ErrorState 
            title="Error loading agents"
            description="Please try again later"            
        />
    );
};