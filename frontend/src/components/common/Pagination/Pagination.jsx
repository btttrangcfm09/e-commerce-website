import { useMemo } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = useMemo(() => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages !== 1) {
            range.push(totalPages);
        }

        return range;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
                Previous
            </button>

            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...' || page === currentPage}
                    className={`w-10 h-8 rounded ${
                        page === currentPage ? 'bg-rose-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                    } ${page === '...' ? 'cursor-default' : ''}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;
