import { IInputbuttonComponent } from "../utils/componentInterfaces"

// TODO: Handle numerical inputs

export default function Inputbutton({ text, placeholder, onClick, handleInputChange, inputtype, value }: IInputbuttonComponent) {
    

    return(
        <div className="flex h-12 items-center rounded-lg transition-all duration-100 poppins">
            <input
            type={inputtype}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="border-white border-2 w-full h-full flex-1 px-4 py-full bg-gray-900 transition-all duration-100 rounded-l-lg bg-transparent border border-transparent group"
            />

            <span className="relative inline-flex h-full poppins">
                <button
                onClick={onClick}
                className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-r-lg group bg-gradient-to-br from-purple-600 to-blue-500  text-zinc-300 shadow-lg shadow-purple-800/40 w-36"
                >
                    <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-r-md group-hover:bg-opacity-0 w-36">
                        {text}
                    </span>
                </button>
            </span>
        </div>
    )
}