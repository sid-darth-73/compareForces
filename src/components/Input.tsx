interface InputInterface {
    reference?: any,
    placeholder: string
}

export function Input({ placeholder, reference }: InputInterface) {
    return (
        <div>
            <input
                ref={reference}
                placeholder={placeholder}
                type="text"
                className="px-4 py-3 border rounded m-2 font-mono font-light w-full text-base"
            />
        </div>
    );
}
