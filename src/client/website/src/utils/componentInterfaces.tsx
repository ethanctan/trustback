export interface INavlinkComponent {
    to: string;
    classNamePath: string;
    title: string;
    onClick: () => void;
}

export interface ILinkbuttonComponent {
    href: string;
    target: string;
    rel: string;
    text: string;
    navlink: boolean;
}

