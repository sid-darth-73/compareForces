interface InfoCardI{
    text: string,
    value: number | string,
    ActionButton?: any
}
export function InfoCard(props: InfoCardI) {
    return (
        <div className="rounded-none border border-pink-100 text-card-foreground border-x-0 border-y-0 
        border-l-4 bg-muted/20 rounded-r-lg rounded-l-none px-1 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
            <div className="text-2xl p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{props.text}</h3>
            </div>
            <div className="p-6 pt-0"><div className="text-xl sm:text-2xl font-mono">{props.value}</div>
        </div>
        </div>
    )
}