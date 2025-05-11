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
}
setTimeout(remTransBtn, 15000);
function remTransBtn(){
    col = document.getElementsByClassName('btn')
    col[0].classList.remove('four')
    col[0].setAttribute("id", "border");
}

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
            status.textContent = data.status_text || 'None';
        }
        
        if (emoji && data.status_emoji_display_info && data.status_emoji_display_info[0]?.display_url) {
            emoji.src = data.status_emoji_display_info[0].display_url;
            emoji.style.display = 'inline-block';
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