import { Menu } from "./components/Menu";

export default function Home() {
    return (
        <div className="w-screne h-screen grid place-items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-7xl font-bold uppercase tracking-widest text-purple-400 text-shadow-[5px_5px_0_rgba(0,0,0,0.1)] mb-10">
                    Begseso
                </h1>
                <Menu />
            </div>
        </div>
    );
}
