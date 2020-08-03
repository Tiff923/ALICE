import React from 'react'
import './Header.css'

const Header = () => {
    return(
        <>
            <nav class="site-header fixed-top">
            <div class="container d-flex justify-content-between">
            <a className="logo-container" href="/about">
                    <img src="./logo.png" width="50" alt="A.L.I.C.E. logo" />
            </a>
            <a class="pt-3 d-md-inline-block" href="/upload">Upload</a>
            </div>
            </nav>
        </>
    )
}

export default Header