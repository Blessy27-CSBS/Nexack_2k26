import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-urbanDark">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin shadow-neon-purple"></div>
                <div className="text-xl font-black tracking-[0.3em] text-white/50 animate-pulse uppercase">
                    Syncing Data...
                </div>
            </div>
        </div>
    );
};

export default Loading;
