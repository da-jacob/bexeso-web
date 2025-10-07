import { Game } from "../components/Game";

export default async function GameRoom({
    params,
}: {
    params: Promise<{ room: string }>;
}) {
    const { room } = await params;

    return (
        <div className="w-screne h-screen grid place-items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-7xl font-bold uppercase tracking-widest text-purple-400 text-shadow-[5px_5px_0_rgba(0,0,0,0.1)] mb-8">
                    Begseso
                </h1>
                <Game
                    room={room}
                    socketUrl={process.env.NEXT_SOCKET_URL || ""}
                />
            </div>
        </div>
    );
}
