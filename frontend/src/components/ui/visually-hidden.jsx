const VisuallyHidden = ({ children, ...props }) => {
    return (
        <span
            className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            {...props}
        >
            {children}
        </span>
    );
};

export { VisuallyHidden };