const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
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
    const cards = document.getElementsByClassName('card');
    Array.from(cards).forEach((card) => card.classList.remove('logo1'));
}
setTimeout(remTransBtn, 15000);
function remTransBtn(){
    const buttons = document.getElementsByClassName('btn');
    if (buttons.length > 0) {
        buttons[0].classList.remove('four');
        buttons[0].setAttribute('id', 'border');
    }
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

/* DevTools detection code (kept for reference, currently disabled)
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
            'me@sdheeraj.is-cool.dev'
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
*/

setInterval(updateTime, 1000);
updateTime();
fetchSlack();
setInterval(fetchLastFM, 30000);
fetchLastFM();
setInterval(fetchSlack, 30000);

// Easter egg :)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let lastKonamiKeyTime = 0;
const RETRO_STYLE_ID = 'retro-mode-style';
const RETRO_FONT_ID = 'retro-mode-font';
const RETRO_POPUP_ID = 'retro-mode-popup';
const RETRO_MODE_STORAGE_KEY = 'portfolio_retro_mode';
const KONAMI_RESET_TIMEOUT_MS = 2500;
let retroAudioContext;

function isTypingTarget(target) {
    if (!target) return false;
    const tagName = target.tagName;
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable;
}

function ensureRetroAssets() {
    if (!document.getElementById(RETRO_FONT_ID)) {
        const fontLink = document.createElement('link');
        fontLink.id = RETRO_FONT_ID;
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }

    if (document.getElementById(RETRO_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = RETRO_STYLE_ID;
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
            0% { opacity: 0.95; }
            50% { opacity: 0.9; }
            100% { opacity: 0.95; }
        }

        .retro-mode {
            background-color: #000 !important;
            color: #0f0 !important;
            font-family: 'Press Start 2P', cursive !important;
            position: relative;
            overflow-x: hidden;
            overflow-y: auto;
            animation: flicker 0.4s infinite;
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
}

function playRetroBeep() {
    try {
        if (!retroAudioContext) {
            retroAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (retroAudioContext.state === 'suspended') {
            retroAudioContext.resume();
        }

        const oscillator = retroAudioContext.createOscillator();
        const gainNode = retroAudioContext.createGain();

        oscillator.type = 'square';
        oscillator.connect(gainNode);
        gainNode.connect(retroAudioContext.destination);

        oscillator.frequency.setValueAtTime(800, retroAudioContext.currentTime);
        gainNode.gain.setValueAtTime(0.08, retroAudioContext.currentTime);
        oscillator.start();
        oscillator.stop(retroAudioContext.currentTime + 0.1);
    } catch (err) {
        console.warn('Retro beep not available:', err);
    }
}

function showRetroMessage(isEnabled) {
    const existingMessage = document.getElementById(RETRO_POPUP_ID);
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.id = RETRO_POPUP_ID;
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

    message.innerHTML = isEnabled
        ? `
        <h2 style="margin-bottom: 30px; font-size: 1.5em; line-height: 1.4;">RETRO MODE ACTIVATED!</h2>
        <p style="margin: 20px 0; font-size: 1.2em;">KONAMI CODE ACCEPTED</p>
        <p style="margin: 20px 0; font-size: 1.2em;">CRT STYLE ENGAGED</p>
        <p style="margin: 20px 0; font-size: 1em;">Press ↑↑↓↓←→←→BA to toggle</p>
        <div style="margin-top: 30px; font-size: 2.5em;">👾 🕹️ 🎮</div>
    `
        : `
        <h2 style="margin-bottom: 30px; font-size: 1.5em; line-height: 1.4;">RETRO MODE DISABLED</h2>
        <p style="margin: 20px 0; font-size: 1.1em;">Back to normal interface.</p>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.transition = 'all 0.5s ease';
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 500);
    }, 2500);
}

function setRetroMode(enabled, options = {}) {
    const { announce = true, beep = true } = options;

    ensureRetroAssets();
    document.body.classList.toggle('retro-mode', enabled);
    localStorage.setItem(RETRO_MODE_STORAGE_KEY, enabled ? '1' : '0');

    if (announce) {
        showRetroMessage(enabled);
    }

    if (beep) {
        playRetroBeep();
    }
}

function restoreRetroModeState() {
    const isEnabled = localStorage.getItem(RETRO_MODE_STORAGE_KEY) === '1';
    if (isEnabled) {
        setRetroMode(true, { announce: false, beep: false });
    }
}

restoreRetroModeState();

document.addEventListener('keydown', (e) => {
    if (e.repeat || isTypingTarget(e.target)) {
        return;
    }

    const now = Date.now();
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (now - lastKonamiKeyTime > KONAMI_RESET_TIMEOUT_MS) {
        konamiIndex = 0;
    }

    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        lastKonamiKeyTime = now;

        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
            lastKonamiKeyTime = 0;
        }
    } else {
        konamiIndex = key === konamiCode[0] ? 1 : 0;
        lastKonamiKeyTime = now;
    }
});

function activateEasterEgg() {
    const isEnabled = !document.body.classList.contains('retro-mode');
    setRetroMode(isEnabled);
}

// another easter egg
let logoClickCount = 0;
let lastClickTime = 0;
const CLICK_TIMEOUT = 3000;

const logoEl = document.querySelector('.logo');
if (logoEl) {
    logoEl.addEventListener('click', () => {
        const currentTime = Date.now();

        if (currentTime - lastClickTime > CLICK_TIMEOUT) {
            logoClickCount = 0;
        }

        logoClickCount++;
        lastClickTime = currentTime;

        if (logoClickCount === 5) {
            const config = {
                enableAsteroidDestroyer: true
            };

            if (config.enableAsteroidDestroyer) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.onerror = function() {
                    alert('Failed to load the asteroid destroyer effect.');
                };
                document.body.appendChild(script);
                script.src = 'https://blog.roysolberg.com/js/dom2.min.js';
            } else {
                const asteroidCanvas = document.querySelector('canvas[style*="fixed"]');
                if (asteroidCanvas) asteroidCanvas.remove();
            }

            logoClickCount = 0;
        }
    });
}