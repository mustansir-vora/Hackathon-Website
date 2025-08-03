export const fadeIn = (element) => {
    element.style.opacity = 0;
    element.style.transition = 'opacity 0.5s ease-in';
    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
};

export const fadeOut = (element) => {
    element.style.opacity = 1;
    element.style.transition = 'opacity 0.5s ease-out';
    element.style.opacity = 0;
};

export const slideIn = (element) => {
    element.style.transform = 'translateY(-20px)';
    element.style.opacity = 0;
    element.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    element.style.transform = 'translateY(0)';
    element.style.opacity = 1;
};

export const slideOut = (element) => {
    element.style.transform = 'translateY(0)';
    element.style.opacity = 1;
    element.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    element.style.transform = 'translateY(-20px)';
    element.style.opacity = 0;
};

export const hoverEffect = (element) => {
    element.style.transition = 'transform 0.3s ease';
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
    });
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
};
