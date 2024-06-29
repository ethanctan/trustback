import { ethers } from "ethers";
import { HTMLInputTypeAttribute } from "react";

export interface ISubmissionTable {
    headings: string[];
    submissions: any[];
    RowGenerator: (submission : any) => JSX.Element;
}

export interface INavlinkComponent {
    to: string;
    classNamePath: string;
    title: string;
    onClick: () => void;
}

export interface IQuestionTitleComponent {
    title: string;
    subtitle: string;
}

export interface INavbarComponent {
    passAccount: (value: any) => void;
    passContracts: (value: any) => void;
    passProvider: (value: any) => void;
    passSigner: (value: any) => void;
    pendingState: boolean;
    toggleMenuApp: () => void;
}

export interface IPendingCheck {
    txHash: string;
    provider : ethers.providers.JsonRpcProvider
}

export interface IButtonComponent {
    text?: string;
    onClick?: () => void;
    pending?: boolean;
}

export interface ILinkbuttonComponent {
    href: string;
    target: string;
    rel: string;
    text: string;
    navlink: boolean;
}

export interface IInputbuttonComponent {
    text?: string;
    placeholder?: string;
    onClick: () => void;
    handleInputChange: (e: any) => void;
    inputtype: HTMLInputTypeAttribute;
    value: string | number;
}

/**
 export default function Inputbutton() {

    return(
        <div className="flex mt-4 h-12 items-center rounded-lg bg-opacity-50 backdrop-filter backdrop-blur-md  focus:outline-none transition-all duration-100">
            <input
            type="text"
            value={stakeAmount}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="border-slate-500 border-2 w-full h-full flex-1 px-4 py-full bg-gray-900 hover:border-white transition-all duration-100 rounded-l-lg bg-transparent border border-transparent group"
            />

        <span className="relative inline-flex h-full">
            <button
            onClick={stake}
            className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-r-lg group bg-gradient-to-br from-purple-600 to-blue-500  text-zinc-300 shadow-lg shadow-purple-800/40"
            >
            <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-r-md group-hover:bg-opacity-0">
                Stake
            </span>
            </button>
        </span>
        </div>
    )
}
 */