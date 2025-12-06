// Visual effects for quiz results
export class VisualEffects {
    
    // Confetti animation for excellent results (90%+)
    static showConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confettiContainer);
        
        // Create multiple confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfettiPiece(confettiContainer);
            }, i * 50);
        }
        
        // Remove container after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 4000);
    }
    
    private static createConfettiPiece(container: HTMLElement) {
        const confetti = document.createElement('div');
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: ${color};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 50%;
            animation: confetti-fall 3s linear forwards;
        `;
        
        container.appendChild(confetti);
        
        // Remove piece after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
    
    // Stars animation for good results (70-89%)
    static showStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(starsContainer);
        
        // Create stars
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createStar(starsContainer);
            }, i * 100);
        }
        
        // Remove container after animation
        setTimeout(() => {
            if (starsContainer.parentNode) {
                starsContainer.parentNode.removeChild(starsContainer);
            }
        }, 3000);
    }
    
    private static createStar(container: HTMLElement) {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.cssText = `
            position: absolute;
            font-size: 20px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: star-sparkle 2s ease-in-out forwards;
        `;
        
        container.appendChild(star);
        
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, 2000);
    }
    
    // Sad magnifying glass for poor results (below 50%)
    static showSadEffect() {
        const sadContainer = document.createElement('div');
        sadContainer.className = 'sad-container';
        sadContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 100px;
            z-index: 9999;
            animation: sad-wobble 2s ease-in-out forwards;
        `;
        sadContainer.innerHTML = '🔍😢';
        
        document.body.appendChild(sadContainer);
        
        setTimeout(() => {
            if (sadContainer.parentNode) {
                sadContainer.parentNode.removeChild(sadContainer);
            }
        }, 2000);
    }
    
    // Add CSS animations to page
    static initializeAnimations() {
        if (document.getElementById('visual-effects-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'visual-effects-styles';
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-10px) rotateZ(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotateZ(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes star-sparkle {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.5) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes sad-wobble {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2) rotate(-5deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0) rotate(5deg);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}