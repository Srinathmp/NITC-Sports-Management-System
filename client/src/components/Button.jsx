function LinkBtn(props){
    return(
        <div className="
        bg-white text-slate-700 border border-slate-300 px-4 py-2 
        rounded-lg font-semibold text-sm transition-colors duration-200
        cursor-pointer hover:bg-blue-300 hover:text-white hover:border-blue-300">
            {props.children}
        </div>
    )
}

export {LinkBtn}