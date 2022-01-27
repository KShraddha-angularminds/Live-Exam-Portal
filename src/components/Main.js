import React from 'react'
import { Link } from 'react-router-dom'

function Main() {
    
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-light bg-dark fixed-top">
                <div className="collapse navbar-collapse justify-content-between" id="nav">
                    <ul className="navbar-nav">
                        <li className="nav-item" >
                            <Link id="RouterNavLink" className="nav-link text-light font-weight-light" to="/questions">Questions</Link>
                        </li>
                        
                        <li className="nav-item">
                        <Link id="RouterNavLink" className="nav-link text-light font-weight-light" to="/subjects">Subjects</Link>
                        </li>
                        <li className="nav-item">
                        <Link id="RouterNavLink" className="nav-link text-light font-weight-light" to="/topics">Topics</Link>
                        </li>
                    </ul>
                </div>

            </nav>



        </div >
    )
}

export default Main
