import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorageState from './useLocalStorageState';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useLocalStorageState', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('uses default value when no value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('saves to localStorage on state update', () => {
    const { result } = renderHook(() => useLocalStorageState('testKey', 'default'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('initializes with value from localStorage', () => {
    window.localStorage.setItem('testKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorageState('testKey', 'default'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('updates the state when setting a new value', () => {
    const { result } = renderHook(() => useLocalStorageState('testKey', 'default'));

    act(() => {
      result.current[1]('updatedValue');
    });

    expect(result.current[0]).toBe('updatedValue');
  });
});
