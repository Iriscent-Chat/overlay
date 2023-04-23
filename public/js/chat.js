function load(username, auth, settings) {
    const chat = document.getElementById("chat");

    chat.style.backgroundColor = settings.bgColor;
    
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
            
            console.log(settings);

            if(settings.showBadges) {
                var badges = emoteParser.getBadges(userstate, channel);

                for (const ind in badges) {
                    const badgeElement = div.children[0];
                    let badge = badges[ind];
                    badgeElement.innerHTML += `<img src="${badge.img}" alt-"${badge.info}">`;
                    console.log(badgeElement);
                }
            }

            var name = div.children[1];
            var text = div.children[2];
    
            name.innerText = userstate["display-name"];
            text.innerHTML = emoteParser.replaceEmotes(message, userstate, channel, self);
    
            name.style.color = "#8A2BE2";
    
            chat.insertBefore(clone, chat.children[0]);
        } else {
            console.error("Templating not supported :(")
        }
    });
}

async function init() {
    console.info("Loaded")
    UserData = JSON.parse(localStorage.getItem("UserData"));
    ChatSettings = await window.electronAPI.getChatSettings();
    load(UserData["login"], localStorage.getItem("TwitchOAuth"), ChatSettings);
};

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