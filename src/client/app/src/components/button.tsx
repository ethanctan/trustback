import { IButtonComponent } from "../utils/componentInterfaces"
import { Spinner } from '@chakra-ui/react'

export default function Button({text, onClick, pending = false}: IButtonComponent) {
    return (
        <button
            className="w-44	relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 text-zinc-300 shadow-lg shadow-purple-800/40"
            onClick={onClick? onClick : () => {}}
        >
            <span className={`w-44 relative px-5 transition-all ease-in duration-75 bg-slate-900 rounded-md group-hover:bg-opacity-0 poppins ${pending ? 'pt-2.5 pb-1' : 'py-2.5'}` }>
            {pending ? 
            <Spinner /> :
            text}
            </span>
        </button>
    )
}