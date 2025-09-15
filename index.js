const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); 
        } else {
            entry.target.classList.remove('show')
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
setTimeout(remTrans, 5000);
function remTrans(){
    col = document.getElementsByClassName('card')
    col[0].classList.remove('logo1')
    col[1].classList.remove('logo1')
    col[2].classList.remove('logo1')
    col[3].classList.remove('logo1')
    col[4].classList.remove('logo1')
}
setTimeout(remTransBtn, 15000);
function remTransBtn(){
    col = document.getElementsByClassName('btn')
    col[0].classList.remove('four')
    col[0].setAttribute("id", "border");
}

/* Bot detection code
const isBot = /bot|crawl|slurp|spider|mediapartners|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|whatsapp|telegram|discord/i.test(navigator.userAgent.toLowerCase());

if (isBot) {
    document.body.innerHTML = `
        <div style="
            font-family: 'Rajdhani', sans-serif;
            background: #0e0e0e;
            color: #fff;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
        ">
            <h1 style="color: #00ff00; margin-bottom: 1rem;">🤖 Bot Detected</h1>
            <p style="max-width: 600px; line-height: 1.6;">
                Hello! I've detected that you're a bot. This is a personal portfolio website, and I'd prefer to keep it private from automated crawlers.
            </p>
            <p style="max-width: 600px; line-height: 1.6; margin-top: 1rem;">
                If you're actually a human and seeing this message, please <a href="mailto:me@sdheeraj.is-cool.dev" style="color: #00ff00; text-decoration: none;">contact me</a> and I'll fix this issue.
            </p>
        </div>
    `;
    throw new Error("Bot detected – stopping execution.");
}
*/

/* Mobile detection code
document.addEventListener("DOMContentLoaded", () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const pinkyPromise = localStorage.im_not_on_mobile_i_promise === "true";

    if (isMobile && !pinkyPromise) {
        const mainContent = document.getElementById("main-content");
        if (mainContent) mainContent.style.display = "none";

        const warningHTML = `
            <div style="
                font-family: 'Rajdhani', sans-serif;
                background: #0e0e0e;
                color: #ff0000;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 2rem;
            ">
                <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">No mobile support!</h1>
                <div style="font-weight: bold; margin: 1rem 0; max-width: 600px;">
                    Sorry, as of now my portfolio is not supported on mobile. Please access this page on a
                    desktop or laptop computer. If you pinky promise you are not on a mobile device, you can still
                    access this page by running this code in your console:
                </div>
                <code style="
                    background: #1e1e1e;
                    color: #fff;
                    padding: 1rem;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    margin-top: 1rem;
                    max-width: 90%;
                    overflow-x: auto;
                ">
                    localStorage.im_not_on_mobile_i_promise = "true";
                </code>
            </div>
        `;

        document.body.innerHTML = warningHTML;
    }
});
*/

const BASE_URL = 'https://api.sdheeraj.is-cool.dev/api';

async function fetchSlack() {
    try {
        const res = await fetch(`${BASE_URL}/slack`, {
            mode: 'cors',
            credentials: 'include'
        });
        const data = await res.json();
        const presence = document.getElementById('presence');
        const status = document.getElementById('status');
        const emoji = document.getElementById('emoji');
        
        if (presence) {
            let statusEmoji = '';
            if (data.huddle_state === 'in_a_huddle') {
                statusEmoji = '🎧';
            } else if (data.presence === 'active') {
                statusEmoji = '🟢';
            } else {
                statusEmoji = '⚪️';
            }
            presence.textContent = statusEmoji;
        }
        
        if (status) {
            const statusContainer = document.getElementById('status-container');
            if (data.status_text && data.status_text.trim() !== '') {
                status.textContent = data.status_text;
                statusContainer.style.display = 'inline';
                if (emoji) {
                    emoji.style.display = 'inline-block';
                }
            } else {
                statusContainer.style.display = 'none';
            }
        }
        
        if (emoji && data.status_emoji_display_info && data.status_emoji_display_info[0]?.display_url) {
            emoji.src = data.status_emoji_display_info[0].display_url;
            emoji.style.width = '20px';
            emoji.style.height = '20px';
            emoji.style.verticalAlign = 'middle';
        }
    } catch (err) {
        console.error('Error fetching Slack data:', err);
        const slackCard = document.getElementById('slack-card');
        if (slackCard) slackCard.innerHTML = "<div>Error loading Slack data</div>";
    }
}

async function fetchLastFM() {
    try {
        const res = await fetch(`${BASE_URL}/lastfm`, {
            mode: 'cors',
            credentials: 'include'
        });
        const data = await res.json();
        
        if (!data.recenttracks || !data.recenttracks.track) {
            console.error('Invalid Last.fm data structure:', data);
            return;
        }

        const recentTracks = data.recenttracks.track;
        const trackElement = document.getElementById('track');
        
        if (!trackElement) return;

        const nowPlaying = recentTracks.find(
            (song) => song?.['@attr']?.nowplaying === 'true'
        );

        if (nowPlaying) {
            trackElement.textContent = `Now playing: ${nowPlaying.name} by ${
                nowPlaying.artist['#text'].split('; ')[0]
            }`;
        } else {
            const lastTrack = recentTracks[0];
            const date = new Date(lastTrack.date.uts * 1000);
            const now = new Date();
            const diffMs = now - date;
            
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            let durationString = '';
            if (hours > 0) {
                durationString += `${hours} hour${hours !== 1 ? 's' : ''}`;
                if (minutes > 0) {
                    durationString += `, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
                }
            } else {
                durationString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
            durationString += ' ago';

            trackElement.textContent = `${lastTrack.name} by ${
                lastTrack.artist['#text'].split('; ')[0]
            } (${durationString})`;
        }
    } catch (err) {
        console.error('Error fetching Last.fm data:', err);
        const lastfmCard = document.getElementById('lastfm-card');
        if (lastfmCard) lastfmCard.innerHTML = "<div>Error loading Last.fm data</div>";
    }
}

function updateTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', options) + ' IST';
}

setInterval(updateTime, 1000);
updateTime();
fetchSlack();
setInterval(fetchLastFM, 30000);
fetchLastFM();

(function () {
    'use strict';

    const devtools = {
        isOpen: false,
        orientation: undefined
    };

    const threshold = 160;

    const emitEvent = (isOpen, orientation) => {
        window.dispatchEvent(new CustomEvent('devtoolschange', {
            detail: {
                isOpen,
                orientation
            }
        }));
    };

    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (
            !(heightThreshold && widthThreshold) &&
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
        ) {
            if (!devtools.isOpen || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }

            devtools.isOpen = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.isOpen) {
                emitEvent(false, undefined);
            }

            devtools.isOpen = false;
            devtools.orientation = undefined;
        }
    }, 500);

    window.devtools = devtools;
})();

function addMessage(text) {
    const message = document.createElement('div');
    message.className = 'glitch';
    message.setAttribute('data-text', text);
    message.textContent = text;
    return message;
}

function loadContent(consoleOpen) {
    const overlay = document.getElementById('devtools-overlay');
    if (overlay) {
        overlay.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'glitch-container';
        
        const messages = [
            'glad you found me :)',
            'what you doing inspect elementing in my portfolio site 🤨',
            'if you would like to chat drop in a messge at',
            'contact@sdheeraj.is-cool.dev'
        ];
        
        messages.forEach(text => {
            container.appendChild(addMessage(text));
        });
        
        overlay.appendChild(container);
    }
}

function loadCss(consoleOpen) {
    const style = document.getElementById('devtools-style');
    if (style) {
        style.remove();
    }
    
    if (consoleOpen) {
        const newStyle = document.createElement('style');
        newStyle.id = 'devtools-style';
        newStyle.textContent = `
            body { overflow: hidden !important; }
            #main-content { display: none !important; }
        `;
        document.head.appendChild(newStyle);
    }
}

function convertPage(consoleOpen = true) {
    loadCss(consoleOpen);
    document.title = consoleOpen ? '🤨' : 'My Portfolio';
    loadContent(consoleOpen);
}

function showPlaceholderContent() {
    const overlay = document.createElement('div');
    overlay.id = 'devtools-overlay';
    document.body.appendChild(overlay);
    convertPage(true);
}

function removePlaceholderContent() {
    const overlay = document.getElementById('devtools-overlay');
    if (overlay) {
        overlay.remove();
        convertPage(false);
    }
}

function setConsoleState(open) {
    if (open) {
        showPlaceholderContent();
    } else {
        removePlaceholderContent();
    }
}

window.addEventListener('devtoolschange', e => {
    setConsoleState(e.detail.isOpen);
});

setInterval(fetchSlack, 30000);

// Easter egg :)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes retroGlow {
            0% { text-shadow: 0 0 5px #0f0, 0 0 10px #0f0; }
            50% { text-shadow: 0 0 10px #0f0, 0 0 20px #0f0; }
            100% { text-shadow: 0 0 5px #0f0, 0 0 10px #0f0; }
        }
        
        @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); }
        }

        @keyframes flicker {
            0% { opacity: 0.9; }
            5% { opacity: 0.8; }
            10% { opacity: 0.9; }
            15% { opacity: 0.85; }
            20% { opacity: 0.9; }
            100% { opacity: 0.9; }
        }

        @keyframes pixelate {
            0% { filter: none; }
            50% { filter: pixelate(2px); }
            100% { filter: none; }
        }
        
        .retro-mode {
            background-color: #000 !important;
            color: #0f0 !important;
            font-family: 'Press Start 2P', cursive !important;
            position: relative;
            overflow-x: hidden;
            overflow-y: auto;
            animation: flicker 0.3s infinite;
        }
        
        .retro-mode .header,
        .retro-mode .mobile-nav {
            background-color: rgba(0, 0, 0, 0.9) !important;
            border-bottom: 2px solid #0f0 !important;
            z-index: 9998 !important;
        }

        .retro-mode .navbar a,
        .retro-mode .mobile-nav a {
            color: #0f0 !important;
            text-shadow: 0 0 5px #0f0;
            font-size: 0.9em;
            letter-spacing: 1px;
        }

        .retro-mode .navbar a:hover,
        .retro-mode .mobile-nav a:hover {
            background-color: #0f0 !important;
            color: #000 !important;
            box-shadow: 0 0 10px #0f0;
        }
        
        .retro-mode::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 255, 0, 0.03),
                rgba(0, 255, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 9990;
        }

        .retro-mode::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: rgba(0, 255, 0, 0.5);
            animation: scanline 4s linear infinite;
            pointer-events: none;
            z-index: 9999;
        }
        
        .retro-mode h1, .retro-mode h2, .retro-mode h3 {
            animation: retroGlow 2s infinite;
            letter-spacing: 2px;
            margin: 1em 0;
        }
        
        .retro-mode .cs, .retro-mode .cs2 {
            color: #0f0 !important;
            text-shadow: 0 0 5px #0f0;
        }

        .retro-mode a {
            color: #0f0 !important;
            text-decoration: none;
            position: relative;
            padding: 0 5px;
        }

        .retro-mode a:hover {
            background-color: #0f0;
            color: #000 !important;
        }

        .retro-mode img {
            filter: sepia(100%) hue-rotate(70deg) saturate(500%);
            transition: all 0.3s ease;
        }

        .retro-mode img:hover {
            transform: scale(1.05);
            filter: sepia(100%) hue-rotate(70deg) saturate(800%);
        }

        .retro-mode .btn {
            border: 2px solid #0f0 !important;
            background: transparent !important;
            box-shadow: 0 0 10px #0f0;
            transition: all 0.3s ease;
            font-family: 'Press Start 2P', cursive !important;
            font-size: 0.9em;
            padding: 15px 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .retro-mode .btn:hover {
            background: #0f0 !important;
            color: #000 !important;
            box-shadow: 0 0 20px #0f0;
            transform: scale(1.05);
        }

        .retro-mode section {
            padding: 40px 20px;
            margin: 20px 0;
            border: 1px solid rgba(0, 255, 0, 0.2);
            background: rgba(0, 255, 0, 0.05);
            box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1);
        }

        .retro-mode input,
        .retro-mode textarea {
            background: #000 !important;
            color: #0f0 !important;
            border: 1px solid #0f0 !important;
            font-family: 'Press Start 2P', cursive !important;
            font-size: 0.8em;
            padding: 10px;
            margin: 5px 0;
            box-shadow: 0 0 5px #0f0;
        }

        .retro-mode input:focus,
        .retro-mode textarea:focus {
            outline: none;
            box-shadow: 0 0 15px #0f0;
        }

        .retro-mode .mobile-nav-toggle span {
            background-color: #0f0 !important;
            box-shadow: 0 0 5px #0f0;
        }

        .retro-mode .logo img {
            filter: brightness(0) sepia(100%) hue-rotate(70deg) saturate(500%) !important;
            transition: all 0.3s ease;
        }

        .retro-mode .logo img:hover {
            filter: brightness(0) sepia(100%) hue-rotate(70deg) saturate(800%) !important;
            transform: scale(1.1) rotate(-5deg);
        }
    `;
    document.head.appendChild(style);

    document.body.classList.toggle('retro-mode');

    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.98);
        color: #0f0;
        padding: 40px;
        border: 3px double #0f0;
        font-family: 'Press Start 2P', cursive;
        z-index: 10000;
        text-align: center;
        animation: retroGlow 2s infinite;
        box-shadow: 0 0 30px #0f0;
        max-width: 90vw;
        min-width: 320px;
    `;
    message.innerHTML = `
        <h2 style="margin-bottom: 30px; font-size: 1.5em; line-height: 1.4;">SECRET MODE ACTIVATED!</h2>
        <p style="margin: 20px 0; font-size: 1.2em;">KONAMI CODE ACCEPTED</p>
        <p style="margin: 20px 0; font-size: 1.2em;">RETRO MODE ENGAGED</p>
        <p style="margin: 20px 0; font-size: 1em;">Press ↑↑↓↓←→←→BA to toggle</p>
        <div style="margin-top: 30px; font-size: 2.5em;">👾 🕹️ 🎮</div>
    `;
    document.body.appendChild(message);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);

    setTimeout(() => {
        message.style.transition = 'all 0.5s ease';
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => message.remove(), 500);
    }, 5000);
}

// another easter egg
let logoClickCount = 0;
let lastClickTime = 0;
const CLICK_TIMEOUT = 3000;

document.querySelector('.logo').addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    
    if (currentTime - lastClickTime > CLICK_TIMEOUT) {
        logoClickCount = 0;
    }
    
    logoClickCount++;
    lastClickTime = currentTime;

    if (logoClickCount === 5) {
        const config = {
            enableAstroidDestroyer: true
        };
        
        if (config.enableAstroidDestroyer) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.onerror = function(e) {
                alert('Failed to load the astroid destroyer effect.');
            };
            document.body.appendChild(s);
            s.src = 'https://blog.roysolberg.com/js/dom2.min.js';
        } else {
            const astroidCanvas = document.querySelector('canvas[style*="fixed"]');
            if (astroidCanvas) astroidCanvas.remove();
        }
        
        logoClickCount = 0;
    }
});