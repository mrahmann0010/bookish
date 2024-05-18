import { NavLink, Outlet } from "react-router-dom";
import { FaBeer } from 'react-icons/fa';


export default function RootLayout() {
    return(
        <div className='root-layout'>
            <nav className='nav-bar'>
                <NavLink to='home'>
                    <span><FaBeer/></span>
                    <span>Home</span>
                    
                </NavLink>
                <NavLink to='read'>
                    <span><FaBeer/></span>
                    <span>Read</span>
                </NavLink>
                <NavLink to='later'>
                    <span><FaBeer/></span>
                    <span>Saved</span>
                </NavLink>

                <NavLink to='abc'>
                    <span><FaBeer/></span>
                    <span>ABC</span>
                </NavLink>
            </nav>

            <Outlet/>
        </div>
    )
}