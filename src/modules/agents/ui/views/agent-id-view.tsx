"use client";

import { toast } from "sonner";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";


interface Props {
    agentId: string;
};

export const AgentIdView = ({ agentId }: Props) => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({ 
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
                router.push("/agents");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm("Are you sure?", `The following action will remove ${data.meetingCount} associated meetings`);

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove();

        if(!ok) return;

        await removeAgent.mutateAsync({ id: agentId });
    };

    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog 
                open={updateAgentDialogOpen}
                onOpenChange={setUpdateAgentDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <AgentIdViewHeader 
                    agentId={agentId}
                    agentName={data.name}
                    onEdit={() => setUpdateAgentDialogOpen(true)}
                    onRemove={handleRemoveAgent}
                />
                <div className="bg-white rounded-lg border">
                    <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                        <div className="flex items-center gap-x-3">
                            <GeneratedAvatar 
                                variant="botttsNeutral"
                                seed={data.name}
                                className="size-10"
                            />
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>
                        <Badge  
                            variant="outline"
                            className="flex items-center gap-x-2 [&>svg]:size-4"
                        >
                            <VideoIcon className="text-blue-700" />
                            {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
                        </Badge>

                        <div className="flex flex-col gap-y-4">
                            <p className="text-lg font-medium">Instructions</p>
                            <p className="text-neutral-800">{data.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export const AgentIdViewLoading = () => {
    return (
        <LoadingState 
            title="Loading agent"
            description="This may take few seconds..."   
        />
    );
};


export const AgentIdViewError = () => {
    return (
        <ErrorState 
            title="Error loading agent"
            description="Please try again later"            
        />
    );
};