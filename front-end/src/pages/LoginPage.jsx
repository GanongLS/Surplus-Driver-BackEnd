import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async e => {
		e.preventDefault();
		try {
			await authService.login(username, password);
			navigate("/dashboard");
		} catch (err) {
			setError("Invalid username or password");
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				background: "radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)",
				color: "white",
			}}>
			<div
				className="glass-panel"
				style={{ padding: "2.5rem", borderRadius: "1rem", width: "100%", maxWidth: "400px" }}>
				<h2
					style={{
						textAlign: "center",
						marginBottom: "2rem",
						fontSize: "1.5rem",
						fontWeight: "600",
					}}>
					Admin Portal
				</h2>

				{error && (
					<div
						style={{
							background: "rgba(239, 68, 68, 0.1)",
							border: "1px solid var(--error)",
							color: "#fca5a5",
							padding: "0.75rem",
							borderRadius: "0.5rem",
							marginBottom: "1rem",
							fontSize: "0.875rem",
						}}>
						{error}
					</div>
				)}

				<form onSubmit={handleLogin}>
					<div style={{ marginBottom: "1rem" }}>
						<label
							style={{
								display: "block",
								marginBottom: "0.5rem",
								fontSize: "0.875rem",
								color: "var(--text-dim)",
							}}>
							Username
						</label>
						<input
							type="text"
							className="input-field"
							value={username}
							onChange={e => setUsername(e.target.value)}
							placeholder="Enter your username"
						/>
					</div>

					<div style={{ marginBottom: "2rem" }}>
						<label
							style={{
								display: "block",
								marginBottom: "0.5rem",
								fontSize: "0.875rem",
								color: "var(--text-dim)",
							}}>
							Password
						</label>
						<input
							type="password"
							className="input-field"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Enter your password"
						/>
					</div>

					<button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
