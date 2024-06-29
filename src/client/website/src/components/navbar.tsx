import { useState } from 'react';
import NavlinkComponent from "./navlink";
import Linkbutton from "./linkbutton";

export default function Navbar() {

  const [isMenuExpanded, setIsMenuExpanded] = useState(false); // for mobile navbar dropdown menu
  const toggleMenu = () => {
    setIsMenuExpanded(prevState => !prevState);
  };
  const closeMenu = () => {
    setIsMenuExpanded(false);
  };    

    return (
      <>
        <nav className="fixed top-0 left-0 right-0 w-full py-2 z-50 bg-slate-800/60 backdrop-blur-lg poppins">
          <div className={`max-w-screen-xl flex flex-wrap items-center justify-between mx-auto lg:p-4 px-4 pt-4 ${isMenuExpanded ? 'pb-0' : 'pb-4'}`}>
            <a href="/" className="">
                <img src="../../public/AEGIS.png" className="h-14 mx-3" alt="TRUSTBACK Logo" />
            </a>

            <div className="flex justify-center items-center lg:order-2">

              {/* Mobile menu button */}
              <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg lg:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600 mr-4" aria-controls="navbar-sticky" 
                aria-expanded={isMenuExpanded} 
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>

              {/* Launch App button */}
              <Linkbutton href="https://www.app.trustback.io" target="_blank" rel="noopener noreferrer" text="Launch App" navlink={false}></Linkbutton>

            </div>

            {/* Navlinks */}
            <div className={`ml-auto items-center justify-between ${isMenuExpanded ? 'block' : 'hidden lg:block'} w-full lg:flex lg:w-auto lg:order-1 lg:py-0 py-2`} id="navbar-sticky">
              <ul className={`flex flex-col lg:flex-row items-center justify-start space-y-2 lg:space-y-0 lg:space-x-6 px-8 py-2${isMenuExpanded ? 'block' : 'invisible lg:visible'}`}>
                  <NavlinkComponent to="/" classNamePath={"/"} title={"About"} onClick={closeMenu}/>
                  <a className="text-gray-400 hover:text-gray-100" href="https://aegis-protocol-1.gitbook.io/aegis-protocol/" target="_blank">Documentation</a>
                  <NavlinkComponent to="/integrate" classNamePath={"/integrate"} title={"Integrate Us"} onClick={closeMenu}/>
              </ul>
            </div>

          </div>

        </nav>
      </>
    );

}


