<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RY4N - The Last Uchiha</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a0a;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-x: hidden;
        }

        /* 3D Name Animation */
        .name-container {
            perspective: 1000px;
            text-align: center;
            padding: 60px 20px;
            position: relative;
            overflow: hidden;
        }

        .name-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(139, 0, 255, 0.1), 
                transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .name-3d {
            font-size: 120px;
            font-weight: 900;
            letter-spacing: 20px;
            background: linear-gradient(45deg, #8B00FF, #6A0DAD, #9D4EDD, #8B00FF);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientFlow 4s ease infinite, float3d 6s ease-in-out infinite;
            text-shadow: 
                0 0 30px rgba(139, 0, 255, 0.8),
                0 0 60px rgba(139, 0, 255, 0.6),
                0 0 90px rgba(139, 0, 255, 0.4);
            transform-style: preserve-3d;
            position: relative;
        }

        .name-3d::before {
            content: 'RY4N';
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            background: linear-gradient(45deg, #6A0DAD, #4B0082);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transform: translateZ(-20px) scale(1.05);
            filter: blur(2px);
            opacity: 0.7;
        }

        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes float3d {
            0%, 100% { 
                transform: translateY(0) rotateX(0deg) rotateY(0deg);
            }
            25% { 
                transform: translateY(-20px) rotateX(5deg) rotateY(-5deg);
            }
            75% { 
                transform: translateY(-20px) rotateX(-5deg) rotateY(5deg);
            }
        }

        .subtitle {
            font-size: 24px;
            color: #6A0DAD;
            margin-top: 20px;
            letter-spacing: 4px;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
        }

        /* Typing Animation Section */
        .typing-section {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(180deg, rgba(139, 0, 255, 0.05), transparent);
        }

        .typing-container {
            display: inline-block;
            position: relative;
        }

        .typing-text {
            font-size: 32px;
            font-weight: 700;
            color: #8B00FF;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 2px;
        }

        .cursor {
            display: inline-block;
            width: 3px;
            height: 32px;
            background: #8B00FF;
            margin-left: 5px;
            animation: blink 0.7s infinite;
        }

        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }

        /* Content Container */
        .content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .philosophy {
            text-align: center;
            padding: 30px;
            background: rgba(139, 0, 255, 0.1);
            border: 2px solid #8B00FF;
            border-radius: 15px;
            margin: 40px 0;
            font-size: 20px;
            font-style: italic;
            color: #9D4EDD;
            box-shadow: 0 0 30px rgba(139, 0, 255, 0.3);
        }

        .section-title {
            font-size: 48px;
            color: #8B00FF;
            text-align: center;
            margin: 60px 0 30px;
            letter-spacing: 3px;
            text-shadow: 0 0 20px rgba(139, 0, 255, 0.6);
        }

        /* Particle Background */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #8B00FF;
            border-radius: 50%;
            opacity: 0;
            animation: particleFloat 10s infinite;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .name-3d {
                font-size: 60px;
                letter-spacing: 10px;
            }
            
            .typing-text {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <!-- Particle Background -->
    <div class="particles" id="particles"></div>

    <!-- 3D Name Section -->
    <div class="name-container">
        <h1 class="name-3d">RY4N</h1>
        <p class="subtitle">THE LAST UCHIHA OF CODE</p>
    </div>

    <!-- Typing Animation -->
    <div class="typing-section">
        <div class="typing-container">
            <div class="typing-text">
                <span id="typed-text"></span>
                <span class="cursor"></span>
            </div>
        </div>
    </div>

    <div class="content">
        <!-- Philosophy -->
        <div class="philosophy">
            "Those who cannot acknowledge themselves will eventually fail."
            <br><br>
            — The Last Uchiha's Code Philosophy
        </div>

        <h2 class="section-title">SUSANOO ACTIVATED</h2>
    </div>

    <script>
        // Typing Animation
        const phrases = [
            'Full Stack Shinobi | Systems Architect',
            'Discord Bot Engineer | Cloud Native',
            'Performance Obsessed | Code Perfectionist',
            'Building The Future One Commit at a Time',
            'Those who cannot acknowledge themselves will eventually fail',
            'Chidori Level Performance'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            const typedTextElement = document.getElementById('typed-text');

            if (isDeleting) {
                typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing animation
        setTimeout(type, 1000);

        // Create particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();
    </script>
</body>
</html>
