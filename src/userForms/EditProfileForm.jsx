import React, { useContext, useState } from 'react';
import AlertMessage from '../common/AlertMessage';
import BackendApi from '../common/backendApi';
import UserContext from '../common/UserContext';
import useFields from '../hooks/useFields';

function EditProfileForm () {
	const { currentUser, setCurrentUser } = useContext(UserContext);

	const initialState = {
		username: currentUser.username,
		firstName: currentUser.firstName,
		lastName: currentUser.lastName,
		email: currentUser.email,
		password: '',
	};

	const [formData, handleChange, resetFormData] = useFields(initialState);
	const [errors, setErrors] = useState([]);
	const [saveSucceeded, setSaveSucceeded] = useState(false);

	async function handleSubmit(evt) {
		evt.preventDefault();

		// Delete username from form data as it is not editable and not accepted by API JSON schema
		delete formData.username;

		let updatedUser;

		try {
			updatedUser = await BackendApi.updateProfile(
				currentUser.username,
				formData
			);
		} catch (errs) {
			setErrors(errs);
		}

		setErrors([]);
		setSaveSucceeded(true);
		setCurrentUser(updatedUser);
	}

	return (
		<div className="EditProfileForm">
			<div className="container col-md-6 col-lg-4 mt-5">
				<form onSubmit={handleSubmit} className="bg-light p-4 rounded">
					<div className="mb-3 text-start">
						<label htmlFor="username" className="form-label">
							Username:
						</label>
						<p>{currentUser.username}</p>
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

					{errors.length ? (
						<AlertMessage alertType="danger" errs={errors} />
					) : null}

					{saveSucceeded ? (
						<AlertMessage
							alertType="success"
							messages={['Your profile was successfully updated.']}
						/>
					) : null}

					<div className="text-end">
						<button type="submit" className="btn btn-primary">
							Update Profile
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditProfileForm;
