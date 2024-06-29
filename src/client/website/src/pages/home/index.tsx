import '../../App.css';
import Linkbutton from '../../components/linkbutton';
import { NavLink } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-around">

        <div className="flex flex-col justify-center h-1/3 unbounded pt-20">
            <h1 className="text-7xl">
                <span className="text-zinc-300">TRUST</span>
                <span className="gradient-stroke">BACK</span>
            </h1>
            <div className="poppins text-3xl mt-7">
                Decentralized chargebacks for web3.
            </div>
        </div>
        
        <div className="grid grid-cols-3 poppins h-1/3 gap-10">

            {/* Add boxes around each grid item material style */}

            <div className="bg-slate-700/50 p-5 rounded-lg">
                <Linkbutton href="http://localhost:5173" target="_blank" rel="noopener noreferrer" text="Launch App" navlink={false}/>
                <div className="mt-5 bg-slate-700/50 p-5 rounded-md w-56 text-sm">
                    If you're filing a dispute, serving as a juror, or have integrated TRUSTBACK with your protocol.
                </div>
            </div>
            <div className="bg-slate-700/50 p-5 rounded-lg">
                <Linkbutton href="http://aegis-protocol-1.gitbook.io/aegis-protocol" target="_blank" rel="noopener noreferrer" text="Docs" navlink={false}/>
                <div className="mt-5 bg-slate-700/50 p-5 rounded-md w-56 text-sm">
                    Find out how we've managed to decentralize consumer protection.
                </div>
            </div>
            <div className="bg-slate-700/50 p-5 rounded-lg">
                <Linkbutton href="/integrate" target="" rel="" text="Integrate Us" navlink={true}/>
                <div className="mt-5 bg-slate-700/50 p-5 rounded-md w-56 text-sm">
                    Secure your protocol's users with chargebacks. Earn your community's trust.
                </div>
            </div>
        </div>

    </div>
  );
}

export default App;
