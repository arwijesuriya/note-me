export const validateEmail = (email) => {
    const regax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regax.test(email);
};