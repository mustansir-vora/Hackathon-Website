export const saveUserData = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = () => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
    localStorage.removeItem('userData');
};