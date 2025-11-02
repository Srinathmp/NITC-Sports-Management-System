import { useLocation } from "react-router-dom"

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

function NavBtn(props){
    const location = useLocation();
    const currentPath = location.pathname;
    return(
        <button className={`p-2 rounded-lg ${currentPath===props.path?'bg-orange-500 text-white hover:bg-orange-300':' hover:bg-[#e1e7efff] '} 
        ${props.screen?'flex items-center cursor-pointer rounded-lg w-30 justify-center gap-1':
        'flex items-center justofy-center gap-4 p1 focus:text-white active:text-white w-full'}`} onClick={props.toggle}>
            <props.Icon />
            {props.name}
        </button>
    )
}

function Button({ loading }) {
return (<button
  type="submit"
  disabled={loading}
  className={`px-4 py-2 rounded-md font-semibold text-white ${loading
    ? "bg-blue-300 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700 transition-colors"
    }`}
>
  {loading ? "Creating..." : "Create Event"}
</button>)
}

export {LinkBtn,NavBtn,Button};