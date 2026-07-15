import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotification = () => {
  const success = useCallback((message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  const error = useCallback((message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  const info = useCallback((message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  const warning = useCallback((message) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  return { success, error, info, warning };
};

export const useLocalStorage = (key, initialValue) => {
  const getStoredValue = (key) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key ${key}:`, error);
      return initialValue;
    }
  };

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(getStoredValue(key)) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key ${key}:`, error);
    }
  };

  return [getStoredValue(key), setValue];
};
