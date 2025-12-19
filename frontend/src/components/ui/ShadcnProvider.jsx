import { useEffect } from 'react';

export const ShadcnProvider = ({ children }) => {
    useEffect(() => {
        // Dynamically import Tailwind base styles
        import('@/styles/admin-shadcn.css');
    }, []);
    return (
        <div
            
            style={{
                isolation: 'isolate', // Creates a new stacking context
            }}
        >
            {children}
        </div>
    );
};
