

export function SingleUser() {
    const primaryHandle = localStorage.getItem("primaryUser")
    return (
        <div className="bg-red-700 h-screen">
            {primaryHandle}
        </div>
    )
}