import { Link } from "react-router-dom";

interface NavbarProps {
  openModal: () => void;
}

function Navbar({ openModal }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">Parfumemarked</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/listings">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link btn btn-link"
                onClick={openModal}
              >
                Create
              </button>
            </li>

          </ul>

          <form className="d-flex" role="search">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search perfume" 
            />
            <button className="btn btn-outline-success">Search</button>
          </form>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
