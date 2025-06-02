"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";


export const AgentsView = () => {
    const trpc = useTRPC();
    // This is making the request
    // const { data, isLoading, isError } = useQuery(trpc.agents.getMany.queryOptions());

    // This has already fetched data, so no need to use isLoading or isError
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    // if(isLoading) {
    //     return (
    //         <LoadingState 
    //             title="Loading agents"
    //             description="This may take few seconds..."
    //         />
    //     );
    // }

    // if(isError) {
    //     return (
    //         <ErrorState 
    //             title="Error loading agents"
    //             description="Please try again later"            
    //         />
    //     );
    // }

    return (
        <div className="">
            {JSON.stringify(data, null, 2)}
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