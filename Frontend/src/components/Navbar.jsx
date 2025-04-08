import { use, useState } from "react"
import {Menu, X, PawPrint} from "lucide-react"
import icon from "../assets/icon.jpg"
import {navItems} from "../constants"

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
            <div className="container px-4 mx-auto relative text-sm">
                <div className="flex justify-between items-center">
                    <a href="/">
                        <div className="flex items-center flex-shrink-0">
                            {/* <img className="h-9 w-15 mr-2" src={icon} alt="logo" /> */}
                            <PawPrint className="m-2"/>
                            <span className="text-xl tracking-tight">Canine Dermal Analyser</span>
                        </div>
                    </a>
                    <ul className="hidden lg:flex ml-14 space-x-12">
                        {navItems.map((navItems, index) => (
                            <li key={index}>
                                <a href={navItems.href}>{navItems.label}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={toggleNavbar}>
                            {mobileDrawerOpen? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul>
                            {navItems.map((navItems, index) => (
                                <li key={index} className="py-3">
                                    <a href={navItems.href}>{navItems.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;