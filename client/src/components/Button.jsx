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
    return(
        <button className={`${props.screen?'flex items-center cursor-pointer p-2 rounded-lg hover:bg-[#e1e7efff] w-30 justify-center gap-1':'flex items-center justofy-center gap-4 p1 border-b focus:text-white active:text-white w-full'}`} onClick={props.toggle}>
            <props.Icon />
            {props.name}
        </button>
    )
}

export {LinkBtn,NavBtn}