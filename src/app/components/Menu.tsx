"use client";

import { useState } from "react";
import { Button } from "./Button";
import { generateCode } from "@/utils/codeGenerator";
import { useRouter } from "next/navigation";

export const Menu = () => {
    const [showJoin, setShowJoin] = useState(false);
    const [gameCode, setGameCode] = useState("");
    const router = useRouter();

    const joinGame = () => {
        router.push(`/${generateCode()}`);
    };

    const connect = () => {
        router.push(`/${gameCode}`);
    };

    return (
        <div className="w-90 flex flex-col gap-8">
            {showJoin ? (
                <>
                    <input
                        type="text"
                        className="w-full text-3xl border-2 border-purple-400 shadow-[5px_5px_0_rgba(0,0,0,0.1)] py-3 font-semibold text-slate-700 text-center px-8"
                        placeholder="Enter game code"
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                    />
                    <Button onClick={connect}>Connect</Button>
                    <Button onClick={() => setShowJoin(false)}>Back</Button>
                </>
            ) : (
                <>
                    <Button onClick={joinGame}>Host Game</Button>
                    <Button onClick={() => setShowJoin(true)}>Join Game</Button>
                </>
            )}
        </div>
    );
};
