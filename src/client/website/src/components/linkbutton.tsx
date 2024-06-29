import { ILinkbuttonComponent } from "../utils/componentInterfaces";
import { NavLink } from "react-router-dom";

export default function Linkbutton({href, target, rel, text, navlink}: ILinkbuttonComponent) {

    if (navlink === true) {
        return (
            <NavLink
            to={href}
            className="w-36	relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 text-zinc-300 shadow-lg shadow-purple-800/40"
            >
                <span className="w-36 relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0 poppins">
                    {text}
                </span>
            </NavLink>
        )
    } else return (
        <span className="w-36 relative inline-flex">
            <a
            href={href}
            target={target}
            rel={rel}
            >
                <button
                    className="w-36	relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 text-zinc-300 shadow-lg shadow-purple-800/40"
                >
                    <span className="w-36 relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0 poppins">
                    {text}
                    </span>
                </button>
            </a>
        </span>
    )
}