import React from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../common/AlertMessage';
import useFields from '../hooks/useFields';

function LoginForm({ login }) {
  const navigate = useNavigate();
  const initialState = {
    username: '',
    password: '',
  };

  const [formData, handleChange] = useFields(initialState);
  const [errors, setErrors] = React.useState([]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const loginRes = await login(formData);
    if (loginRes.loggedIn) {
      return navigate('/companies');
    } else {
      setErrors(loginRes.errs);
    }
  };

  return (
    <div className="LoginForm">
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

          {errors.length ? (
            <AlertMessage alertType="danger" errs={errors} />
          ) : null}
          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;