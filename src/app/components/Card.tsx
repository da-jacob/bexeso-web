import Image from "next/image";
import { useState } from "react";

export type CardProps = {
    flower: string;
    rotated: boolean;
    onClick: () => void;
    owner?: string | null;
    className?: string;
};

export const Card = ({
    flower,
    rotated,
    onClick,
    owner,
    className = "",
}: CardProps) => {
    return (
        <div
            className={`group perspective-1000 w-full aspect-square cursor-pointer transition-opacity ${className}`}
            onClick={owner ? undefined : onClick}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    rotated || owner ? "rotate-y-180" : ""
                }`}
            >
                <div className="absolute w-full h-full bg-purple-200 border-4 border-purple-400 text-purple-100 text-xl font-bold select-none flex items-center justify-center backface-hidden rounded-lg uppercase tracking-widest">
                    Begseso
                </div>
                <div className="absolute w-full h-full bg-purple-200 border-4 border-purple-400 flex items-center justify-center rotate-y-180 backface-hidden rounded-lg overflow-hidden">
                    <Image
                        src={`/flowers/${flower}.webp`}
                        width={400}
                        height={400}
                        alt=""
                        unoptimized
                        className="w-full aspect-square object-cover"
                    />
                </div>
            </div>
        </div>
    );
};
