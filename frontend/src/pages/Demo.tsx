import { ShineButton } from "../components/ui/ShineButton";

export default function Demo() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 gap-8">
            <h1 className="text-3xl font-bold text-white mb-8">Eventure UI Components</h1>
            <div className="flex flex-wrap items-center justify-center gap-6 z-20">
                <ShineButton>Click Me</ShineButton>
                <ShineButton glowColor="#A855F7">Explore Events</ShineButton>
                <ShineButton glowColor="#EC4899">Get Tickets</ShineButton>
            </div>
            <p className="text-gray-400 mt-8">
                Note: The main event discovery experience has been moved to the homepage (/).
            </p>
        </div>
    );
}
