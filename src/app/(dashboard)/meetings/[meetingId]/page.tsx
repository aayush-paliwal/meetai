interface Props {
    params: Promise<{ meetingId: string }>    
}

const Page = async ({ params }: Props) => {
    const { meetingId } = await params

    return (
        <div>
            Meeting Id: {meetingId}
        </div>
    );
};

export default Page;