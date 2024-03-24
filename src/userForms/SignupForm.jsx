import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../common/AlertMessage';
import useFields from '../hooks/useFields';

function SignupForm({ signup }) {
	const navigate = useNavigate();

	const initialState = {
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		email: '',
	};

	const [formData, handleChange] = useFields(initialState);
	const [errors, setErrors] = useState([]);

	async function handleSubmit(evt) {
		evt.preventDefault();

		const signupRes = await signup(formData);
		if (signupRes.signedUp) {
			return navigate('/homepage');
		} else {
			setErrors(signupRes.errs);
		}
	}

	return (
		<div className="SignupForm">
			<div className="container col-md-6 col-lg-4 mt-5">
				<form onSubmit={handleSubmit} className="bg-light p-4 rounded">
					<div className="mb-3 text-start">
						<label htmlFor="username" className="form-label">
							Username:
						</label>
						<input
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							type="text"
							className="form-control"
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label htmlFor="password" className="form-label">
							Password:
						</label>
						<input
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							type="password"
							className="form-control"
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label htmlFor="firstName" className="form-label">
							First Name:
						</label>
						<input
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							type="text"
							className="form-control"
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label htmlFor="lastName" className="form-label">
							Last Name:
						</label>
						<input
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							type="text"
							className="form-control"
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label htmlFor="email" className="form-label">
							Email:
						</label>
						<input
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							type="email"
							className="form-control"
							required
						/>
					</div>

					{errors.length ? (
						<AlertMessage alertType="danger" errs={errors} />
					) : null}

					<div className="text-end">
						<button type="submit" className="btn btn-primary">
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignupForm;