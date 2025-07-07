// ===========================================
// 🎵 Background Music Control System
// ===========================================
let musicStarted = false;
let backgroundMusic = null;

// 等待页面完全加载后初始化音频
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded, initializing audio...');
    
    backgroundMusic = document.getElementById('backgroundMusic');
    
    if (backgroundMusic) {
        // 设置音量
        backgroundMusic.volume = 0.5;
        
        // 添加事件监听器来调试
        backgroundMusic.addEventListener('canplaythrough', function() {
            console.log('✅ Audio file loaded successfully');
        });
        
        backgroundMusic.addEventListener('error', function(e) {
            console.error('❌ Audio error:', e);
            if (backgroundMusic.error) {
                console.error('❌ Audio error code:', backgroundMusic.error.code);
            }
        });
        
        backgroundMusic.addEventListener('loadstart', function() {
            console.log('🔄 Starting to load audio...');
        });
        
        // 预加载音频
        backgroundMusic.load();
        console.log('🎵 Audio element found and initialized');
    } else {
        console.error('❌ Audio element not found! Make sure you have <audio id="backgroundMusic"> in your HTML');
    }
});

// Function to start music
function startBackgroundMusic() {
    console.log('🎵 Attempting to start music...');
    
    if (!backgroundMusic) {
        console.error('❌ Background music element not found');
        showMusicError('Audio element not found');
        return;
    }
    
    if (musicStarted) {
        console.log('🎵 Music already started');
        return;
    }
    
    // 尝试播放音乐
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicStarted = true;
            console.log('✅ Background music started successfully!');
            showMusicIndicator();
        }).catch(error => {
            console.error('❌ Music play failed:', error.name, error.message);
            
            // 显示用户友好的错误信息
            if (error.name === 'NotAllowedError') {
                showMusicError('Browser blocked autoplay. Try clicking again!');
            } else if (error.name === 'NotSupportedError') {
                showMusicError('Audio format not supported');
            } else {
                showMusicError('Failed to load music file');
            }
        });
    }
}

// 显示错误信息
function showMusicError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1002;
        max-width: 300px;
        font-size: 14px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    errorDiv.textContent = '🚫 ' + message;
    document.body.appendChild(errorDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Function to show music indicator
function showMusicIndicator() {
    // 检查是否已经存在音乐控制器
    if (document.getElementById('musicIndicator')) {
        return;
    }
    
    const musicIndicator = document.createElement('div');
    musicIndicator.id = 'musicIndicator';
    musicIndicator.innerHTML = `
        <div class="music-controls">
            <button onclick="toggleMusic()" class="music-toggle" title="Toggle Music">
                <i class="fas fa-volume-up"></i>
            </button>
            <div class="music-wave">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    musicIndicator.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 15px;
        border-radius: 50px;
        z-index: 1001;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        animation: fadeInRight 0.5s ease;
    `;
    
    document.body.appendChild(musicIndicator);
}

// Function to toggle music
function toggleMusic() {
    if (!backgroundMusic) {
        console.error('❌ Background music not available');
        return;
    }
    
    const toggleButton = document.querySelector('.music-toggle i');
    
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            if (toggleButton) {
                toggleButton.className = 'fas fa-volume-up';
            }
            console.log('🎵 Music resumed');
        }).catch(error => {
            console.error('❌ Failed to resume music:', error);
        });
    } else {
        backgroundMusic.pause();
        if (toggleButton) {
            toggleButton.className = 'fas fa-volume-mute';
        }
        console.log('🔇 Music paused');
    }
}

// 添加音乐控制样式
const musicControlsCSS = `
    .music-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .music-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 5px;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .music-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .music-wave {
        display: flex;
        gap: 2px;
        align-items: end;
        height: 20px;
    }

    .music-wave span {
        width: 3px;
        background: white;
        border-radius: 1px;
        animation: musicWave 1s infinite ease-in-out;
    }

    .music-wave span:nth-child(1) { animation-delay: 0s; }
    .music-wave span:nth-child(2) { animation-delay: 0.3s; }
    .music-wave span:nth-child(3) { animation-delay: 0.6s; }

    @keyframes musicWave {
        0%, 100% { 
            height: 8px; 
            opacity: 0.5;
        }
        50% { 
            height: 20px; 
            opacity: 1;
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @media (max-width: 768px) {
        #musicIndicator {
            top: 80px !important;
            right: 10px !important;
            padding: 10px !important;
        }
    }
`;

// 注入音乐控制样式
const musicStyle = document.createElement('style');
musicStyle.textContent = musicControlsCSS;
document.head.appendChild(musicStyle);

// ===========================================
// 🔗 Navigation and Smooth Scrolling  
// ===========================================

// Smooth scrolling for navigation links (修改这个部分)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            // Check if this is the "Discover Our Team" button
            if (this.classList.contains('cta-button') || this.href.includes('#team')) {
                console.log('🎯 CTA button clicked, starting music...');
                startBackgroundMusic(); // 启动音乐
            }
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.transform = 'translateY(0)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Enhanced intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for team cards
            if (entry.target.classList.contains('team-card')) {
                const cards = document.querySelectorAll('.team-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Apply observer to elements
document.querySelectorAll('.team-card, .project-card, .contact-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
});

// Add dynamic particle creation
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    const particleBg = document.querySelector('.particle-bg');
    if (particleBg) {
        particleBg.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 30000);
    }
}

// Create particles periodically
setInterval(createParticle, 3000);

// Add hover effects for skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Add click effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 107, 107, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add dynamic typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Add parallax effect to floating icons
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.floating-icons i');
    const speed = 0.3;
    
    parallax.forEach((icon, index) => {
        const yPos = -(scrolled * speed * (index + 1) * 0.1);
        icon.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Add smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-title, .hero-content');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add loading animation
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Initialize animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Add Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        // Show celebration message
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉 Easter Egg Activated! 🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            animation: bounceIn 0.5s ease;
        `;
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
        
        konamiCode = []; // Reset
    }
});

// Add bounceIn animation for Easter egg
const bounceInCSS = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;

// Inject bounceIn CSS
const bounceStyle = document.createElement('style');
bounceStyle.textContent = bounceInCSS;
document.head.appendChild(bounceStyle);

// Console welcome message
console.log(`
🚀 Welcome to Team Phoenix's Website! 🚀

████████╗███████╗ █████╗ ███╗   ███╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
   ██║   █████╗  ███████║██╔████╔██║
   ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝

Made with ❤️ by Zhang Baijian, Li Peng & Zhu Qianning

Try the Konami Code for a surprise! ⬆⬆⬇⬇⬅➡⬅➡BA
`);
