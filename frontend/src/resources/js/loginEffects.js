export const initLoginEffects = () => {
    const card = document.querySelector('.login-card');

    // Fade-in on load
    setTimeout(() => {
        card?.classList.add('show');
    }, 120);

    // Remove shake after animation
    card?.addEventListener('animationend', () => {
        card.classList.remove('shake');
    });
};
