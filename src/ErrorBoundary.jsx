import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full bg-[#0c0a1f] text-indigo-50 font-sans flex items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-[#0c0a1f] border border-rose-500/30 p-8 rounded-[2rem] shadow-2xl text-center relative overflow-hidden">
                        <div className="flex justify-center mb-6 text-rose-500 animate-pulse">
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Something went wrong</h3>
                        <p className="text-rose-200/70 text-[10px] font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            The app encountered a critical error.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full mb-3 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg border-none active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Try Reloading
                        </button>
                        <button
                            onClick={this.handleReset}
                            className="w-full py-4 bg-rose-950/20 text-rose-400 font-black rounded-2xl border border-rose-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest hover:bg-rose-900/40 hover:text-white"
                        >
                            Reset App Data
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
