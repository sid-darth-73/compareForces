
export function MultipleUser() {
    const primaryHandle = localStorage.getItem("primaryUser")
    const secondaryHandle = localStorage.getItem("secondaryUser")
    return (
        <div className="bg-green-700 h-screen">
            <div>
                {primaryHandle}
            </div>
            <div>
                {secondaryHandle}
            </div>
        </div>
    )
}