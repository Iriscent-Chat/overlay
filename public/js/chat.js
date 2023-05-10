const UserData = JSON.parse(localStorage.getItem("UserData"));

class EventSub {
    constructor () {
        this.socket;
        this.sessionId;
        this.secret;
    };

    open = function() {
        this.socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

        this.socket.onopen = this.onopen;
        this.socket.onmessage = this.onmessage;
        this.socket.onclose = this.onclose;
        this.socket.onerror = this.onerror;
    }

    onopen = function(e) {
        console.info("[open] EventSub WebSocket connection estabilished!");
    };

    onmessage = function(event) {
        let data = JSON.parse(event.data);

        let userId = UserData["id"];
        let auth = localStorage.getItem("TwitchOAuth");

        console.info(`[message] Got server data`);

        if(!this.sessionId) {
            this.sessionId = data.payload?.session?.id;
            fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'type': 'channel.follow',
                    'version': '2',
                    'condition': {
                        'broadcaster_user_id': userId,
                        'moderator_user_id': userId
                    },
                    'transport': {
                        'method': 'websocket',
                        'session_id': this.sessionId
                    }
                })
            });
            fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'type': 'channel.channel_points_custom_reward_redemption.add',
                    'version': '1',
                    'condition': {
                        'broadcaster_user_id': userId
                    },
                    'transport': {
                        'method': 'websocket',
                        'session_id': this.sessionId
                    }
                })
            });
            fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'type': 'channel.subscription.gift',
                    'version': '1',
                    'condition': {
                        'broadcaster_user_id': userId
                    },
                    'transport': {
                        'method': 'websocket',
                        'session_id': this.sessionId
                    }
                })
            });
            fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'type': 'channel.subscription.message',
                    'version': '1',
                    'condition': {
                        'broadcaster_user_id': userId
                    },
                    'transport': {
                        'method': 'websocket',
                        'session_id': this.sessionId
                    }
                })
            });
            fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'type': 'channel.cheer',
                    'version': '1',
                    'condition': {
                        'broadcaster_user_id': userId
                    },
                    'transport': {
                        'method': 'websocket',
                        'session_id': this.sessionId
                    }
                })
            });
        }

        if(Object.keys(data?.payload).length < 2) return;

        if('content' in document.createElement('template')) {
            var chat = document.getElementById('chat');
            var template = document.querySelector('#event');
          
            var clone = template.content.cloneNode(true);
            var div = clone.children[0];

            var sender = div.children[0];
            var info = div.children[1];
            var extra = div.children[2];

            switch (data.payload.subscription.type) {
                case "channel.follow":
                    sender.innerText = data.payload.event.user_name;
                    info.innerText = " just followed your channel!";
                    break;
                case "channel.channel_points_custom_reward_redemption.add":
                    sender.innerText = data.payload.event.user_name;
                    info.innerHTML = " redeemed <span class='sender'>" + data.payload.event.reward.title + "</span> for " + data.payload.event.reward.cost + " channel points!";
                    if(data.payload.event.user_input) {
                        extra.innerText = data.payload.event.user_input;
                    }
                    break;
                case "channel.subscription.gift":
                    sender.innerText = data.payload.event.user_name;
                    info.innerHTML = " gifted <span class='sender'>" + data.payload.event.total + "</span>" + " tier " + data.payload.event.tier + " subs to the community!";
                    if(data.payload.event.cumulative_total) {
                        extra.innerHTML += `${data.payload.event.cumulative_total} total gifted!`;
                    }
                    break;
                case "channel.subscription.message":
                    sender.innerText = data.payload.event.user_name;
                    info.innerHTML = " resubbed for " + data.payload.event.duration_months + " months!";
                    if(data.payload.event.streak_months) {
                        info.innerHTML += "\n" + data.payload.event.streak_months + " months in a row!"
                    }
                    if(data.payload.event.message.text) {
                        extra.innerHTML = data.payload.event.message.text;
                    }
                    break;
                case "channel.cheer":
                    if(data.payload.event.is_anonymous) {
                        sender.innerText = "An anonymous person";
                    } else {
                        sender.innerText = data.payload.event.user_name;
                    }
                    info.innerHTML = " just sent " + data.payload.event.bits + " bits!";
                    extra.innerHTML = data.payload.event.message;
                    break;
                default:
                    break;
            }
    
            chat.insertBefore(clone, chat.children[0]);
        } else {
            console.error("Templating not supported :(")
        }
    };

    onclose = function(event) {
        if (event.wasClean) {
            console.info(`[close] Connection closed, code: ${event.code}, reason: ${event.reason}`);
        } else {
            console.warn('[close] Connection interrupted!');
        }
    };

    onerror = function(error) {
        console.error(`[error] ${error}`);
    };
}

function load(username, auth, settings) {
    const chat = document.getElementById("chat");


    if(settings.transparentWindow) {
        document.body.style.backgroundColor = "transparent";
    } else {
        chat.style.backgroundColor = settings.bgColor;
    }
    
    chat.style.color = settings.fontColor;
    document.body.style.fontSize = settings.fontSize + "px";

    emoteParser.setTwitchCredentials("opxhspb78xudppeapnoelutyyzz7li", auth);

    emoteParser.loadAssets(username, {
        "7tv": settings.emoteSources["7tv"],
        "bttv": settings.emoteSources["btv"],
        "ffz": settings.emoteSources["ffz"],
    });
    
    const client = new tmi.Client({
        channels: [ username ]
    });

    client.connect().catch(console.error);
    
    client.on('message', (channel, userstate, message, self) => {
        if ('content' in document.createElement('template')) {
            var chat = document.getElementById('chat');
            var template = document.querySelector('#message');
          
            var clone = template.content.cloneNode(true);
            var div = clone.children[0];

            if(settings.showBadges) {
                var badges = emoteParser.getBadges(userstate, channel);

                for (const ind in badges) {
                    const badgeElement = div.children[0];
                    let badge = badges[ind];
                    badgeElement.innerHTML += `<img src="${badge.img}" alt-"${badge.info}">`;
                }
            }

            var name = div.children[1];
            var text = div.children[2];
    
            name.innerText = userstate["display-name"];
            text.innerHTML = emoteParser.replaceEmotes(message, userstate, channel, self);

            name.style.color = userstate["color"];
    
            chat.insertBefore(clone, chat.children[0]);
        } else {
            console.error("Templating not supported :(")
        }
    });

    ES.open();
}

async function init() {
    console.info("Loaded")
    ChatSettings = await window.electronAPI.getChatSettings();
    load(ChatSettings.username ? ChatSettings.username : UserData["login"], localStorage.getItem("TwitchOAuth"), ChatSettings);
};

const ES = new EventSub;

init();

document.addEventListener("keydown", (event) => {
    const keyName = event.key;
  
    if (keyName === "Control") {
        return;
    }
  
    if (event.ctrlKey && keyName === "r") {
        window.location.reload();
    }
}, false);