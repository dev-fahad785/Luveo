

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const navItems = [
    { label: "NEW ARRIVALS", path: "/" },
    { label: "MEN", path: "/products/men" },
    { label: "WOMEN", path: "/products/women" },
    { label: "GIFTING", path: "/products/gifting" },
    { label: "LOYALTY PROGRAM", path: "/loyalty" },
    { label: "INFORMATION", path: "/info" },
];

const Navbar = () => {
    return (
        <header className="bg-white text-gray-900 border-b border-gray-200">
                        <div className="bg-black  text-white text-sm md:text-lg lg:text-lg font-bold  italic text-black text-sm py-2 text-center border-b-2 border-white">
                <p>GET FREE DELIVERY ON ALL ORDERS OF RS 1990 AND ABOVE, WITH DELIVERY WITHIN 3-7 DAYS.</p>
            </div>
            <div className="w-full px-4 lg:px-10">
                {/* Top row: centered logo, right icons */}
                <div className="grid grid-cols-3 items-center py-3">
                    <div />
                    <div className="flex justify-center">
                        <Link to="/" className="flex items-center select-none">
                            <span className="text-4xl font-semibold tracking-tight">HUB</span>
                        </Link>
                    </div>
                    <div className="flex justify-end items-center gap-6 text-lg">
                        <Link to="/profile" aria-label="Account" className="hover:opacity-70">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <button aria-label="Search" className="hover:opacity-70">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        <Link to="/cart" aria-label="Cart" className="hover:opacity-70">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Link>
                    </div>
                </div>

                {/* Bottom row: nav links */}
                <nav className="flex justify-center gap-8 pb-3 text-xs tracking-[0.28em] uppercase text-gray-800">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="relative pb-1 hover:opacity-80"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;