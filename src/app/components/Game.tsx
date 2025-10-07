"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardProps } from "./Card";
import Confetti from "react-confetti-boom";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

export const Game = ({
    room,
    socketUrl,
}: {
    room: string;
    socketUrl: string;
}) => {
    const [flowers, setFlowers] = useState<CardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isMyMove, setIsMyMove] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [score, setScore] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const socket = useRef<WebSocket | null>(null);
    const playerId = useRef<string | null>(null);

    const router = useRouter();

    const endGame = () => {
        router.push("/");
    };

    useEffect(() => {
        playerId.current = window.localStorage.getItem("playerId");

        socket.current = new WebSocket(
            `${socketUrl}/game/${room}?playerId=${playerId.current || ""}`
        );

        socket.current.onopen = () => {
            setIsLoading(false);
            setIsWaiting(true);
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "welcome") {
                playerId.current = data.playerId;
                localStorage.setItem("playerId", playerId.current!);
            }

            if (data.type === "game:start") {
                setIsLoading(false);
                setIsWaiting(false);

                setFlowers(data.gameState.flowers);
                setIsMyMove(data.gameState.player === playerId.current);
                setScore(
                    data.gameState.flowers.filter(
                        // eslint-disable-next-line
                        (flower: any) => flower.owner === playerId.current
                    ).length / 2
                );
            }

            if (data.type === "game:update") {
                setFlowers(data.gameState.flowers);
                setIsMyMove(data.gameState.player === playerId.current);
                setScore(
                    data.gameState.flowers.filter(
                        // eslint-disable-next-line
                        (flower: any) => flower.owner === playerId.current
                    ).length / 2
                );
            }

            if (data.type === "game:end") {
                setGameEnded(true);
                setGameWon(data.winner === playerId.current);
            }
        };
    }, [room, socketUrl]);

    useEffect(() => {
        if (!isMyMove) return;
        const rotatedCards = flowers.filter(
            (flower) =>
                flower.rotated &&
                (flower.owner === null || flower.owner === undefined)
        );

        if (rotatedCards.length === 2) {
            setIsLocked(true);

            if (rotatedCards[0].flower === rotatedCards[1].flower) {
                const newFlowers: CardProps[] = [];
                flowers.forEach((flower) => {
                    if (
                        flower.rotated &&
                        (flower.owner === null || flower.owner === undefined)
                    ) {
                        flower.rotated = false;
                        flower.owner = playerId.current;
                    }
                    newFlowers.push(flower);
                });
                setFlowers(newFlowers);
                setIsLocked(false);
                if (socket.current) {
                    socket.current.send(
                        JSON.stringify({
                            type: "game:update",
                            flowers: newFlowers,
                            player: playerId.current,
                            switch: false,
                        })
                    );
                }
            } else {
                setTimeout(() => {
                    const newFlowers: CardProps[] = [];
                    flowers.forEach((flower) => {
                        if (
                            flower.rotated &&
                            (flower.owner === null ||
                                flower.owner === undefined)
                        ) {
                            flower.rotated = false;
                        }
                        newFlowers.push(flower);
                    });
                    setFlowers(newFlowers);
                    setIsLocked(false);

                    if (socket.current) {
                        socket.current.send(
                            JSON.stringify({
                                type: "game:update",
                                flowers: newFlowers,
                                player: playerId.current,
                                switch: true,
                            })
                        );
                    }
                }, 500);
            }
        }
    }, [isMyMove, flowers]);

    const rotateCard = (index: number) => {
        if (!isMyMove) return;
        if (isLocked) return;
        const newFlowers = [...flowers];

        newFlowers[index].rotated = !newFlowers[index].rotated;

        setFlowers(newFlowers);

        if (socket.current) {
            socket.current.send(
                JSON.stringify({
                    type: "game:update",
                    flowers: newFlowers,
                    player: playerId.current,
                    switch: false,
                })
            );
        }
    };

    return (
        <>
            {(isLoading || isWaiting) && (
                <div className="text-lg text-slate-400">
                    {isLoading && "Loading..."}
                    {isWaiting && "Waiting for second player..."}
                </div>
            )}
            {isWaiting && (
                <span className="text-2xl font-semibold mb-6">
                    Game code: <span className="text-purple-600">{room}</span>
                </span>
            )}
            {!isLoading && !isWaiting && (
                <span className="text-2xl font-semibold mb-6">
                    Score: <span className="text-purple-600">{score}</span>
                </span>
            )}
            <div
                className={`grid grid-cols-6 w-6xl gap-6 transition-opacity relative`}
            >
                {flowers.map((flower, index) => {
                    return (
                        <Card
                            className={`${
                                !isMyMove && !gameEnded ? "opacity-60" : ""
                            } ${
                                !isMyMove &&
                                flower.rotated &&
                                flower.owner === null
                                    ? "!opacity-100"
                                    : ""
                            } ${gameEnded ? "opacity-25 blur-sm" : ""}`}
                            key={index}
                            flower={flower.flower}
                            rotated={flower.rotated}
                            owner={flower.owner}
                            onClick={() => rotateCard(index)}
                        />
                    );
                })}
                {gameEnded && (
                    <div className="absolute inset-0 grid place-items-center">
                        <div>
                            <span className="text-9xl font-black tracking-widest text-shadow-[5px_5px_0_rgba(0,0,0,0.1)] uppercase text-purple-500">
                                {gameWon ? "Winner!" : "Loser!"}
                            </span>
                            <div className="w-90 mx-auto mt-10">
                                <Button onClick={endGame}>End game</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {gameWon && <Confetti particleCount={500} spreadDeg={80} />}
        </>
    );
};
