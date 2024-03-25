import { renderHook, act } from '@testing-library/react-hooks';
import useFields from './useFields';

describe('useFields', () => {
  it('should initialize form fields', () => {
    const { result } = renderHook(() => useFields({ username: '', password: '' }));

    expect(result.current[0]).toEqual({ username: '', password: '' });
  });

  it('should handle form field changes', () => {
    const { result } = renderHook(() => useFields({ username: '', password: '' }));

    act(() => {
      const event = { target: { value: 'testuser', name: 'username' } };
      result.current[1](event); // simulate onChange with event
    });

    expect(result.current[0]).toEqual({ username: 'testuser', password: '' });
  });

  it('should reset form fields to initial state', () => {
    const initialState = { username: 'initialUser', password: 'initialPass' };
    const { result } = renderHook(() => useFields(initialState));

    // Change the form data
    act(() => {
      const changeEvent = { target: { value: 'testuser', name: 'username' } };
      result.current[1](changeEvent); // simulate onChange with event
    });

    // Reset the form data
    act(() => {
      result.current[2](); // simulate resetFormData
    });

    expect(result.current[0]).toEqual(initialState);
  });
});
