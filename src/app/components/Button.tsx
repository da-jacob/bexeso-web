import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
}

export const Button = ({children, onClick}: ButtonProps) => {
    return <button className="w-full text-3xl border-2 border-purple-400 shadow-[5px_5px_0_rgba(0,0,0,0.1)] py-3 cursor-pointer transition-colors hover:bg-purple-400 uppercase font-semibold text-slate-700 hover:text-white active:bg-purple-600" onClick={onClick}>{children}</button>
}