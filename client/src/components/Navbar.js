import React from "react";
// import { Link } from "react-router-dom";
import { useUserContext } from "../utils/contexts/UserContext";
import UserButtons from "./UserButtons";
import CustomLink from "./CustomLink";

function Navbar() {
	const { currentUser } = useUserContext();
	return (
		<nav className="list-nav sidebar-nav">
			<UserButtons />
			{/* <Link className="nav-item main-nav-item" to="/">
				Home
			</Link> */}
			<CustomLink className="nav-item main-nav-item" to="/my-story">
				My Story
			</CustomLink>
			<CustomLink className="nav-item main-nav-item" to="/my-class">
				My Class
			</CustomLink>
			<CustomLink className="nav-item main-nav-item" to="/how-it-works">
				How It Works
			</CustomLink>
			<CustomLink className="nav-item main-nav-item" to="/book-private">
				Book Private
			</CustomLink>

			{currentUser.isAdmin ? (
				<CustomLink className="nav-item main-nav-item" to="/admin-dashboard">
					Admin Dashboard
				</CustomLink>
			) : (
				""
			)}

			{currentUser.loggedIn ? (
				<CustomLink className="nav-item main-nav-item" to="/dashboard">
					Dashboard
				</CustomLink>
			) : (
				""
			)}

			{/* </ul> */}
		</nav>
	);
}

export default Navbar;
