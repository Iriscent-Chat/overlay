window.addEventListener('load', onLoadHandler);

const LoadingTextList = ["Loading", "Toasting the Bread", "Putting the PB on the Jam", "Crossing the Road", "Taking a Nap", "Wasting your time"];
var UserData;

const app = document.getElementById("app");

async function onLoadHandler() {
    console.log("%cStop!", "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
    console.log("%cIf someone told you to insert something here, there's a 11/10 possibility they are trying to steal your data!", "color: red; font-family: sans-serif; font-size: 1.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
    console.log("%cUse this only if you know what you are doing or if the software developer said so.", "color: white; font-family: sans-serif; font-size: 1.5em; font-weight: bolder; text-shadow: #000 1px 1px;");

    let loading = true;
    
    var loadingText = LoadingTextList[Math.floor( Math.random() * LoadingTextList.length )];
    var dotCount = 1;
    document.getElementById("ltext").innerText = loadingText + ".".repeat(dotCount);

    let dot1 = document.getElementById("1");
    let dot2 = document.getElementById("2");
    let dot3 = document.getElementById("3");

    dot1.classList.add("dot-animation");
    dot2.classList.add("dot-animation");
    dot3.classList.add("dot-animation");
    
    while (loading) {
        var dotInterval = setInterval(() => {
            document.getElementById("ltext").innerText = loadingText + ".".repeat(dotCount);
            if(dotCount < 4) {
                dotCount++;
            } else {
                dotCount = 1;
            }
        }, 500);
        
        if(!localStorage.getItem("TwitchOAuth")) {
            localStorage.setItem("TwitchOAuth", await window.electronAPI.doAuth());
            let getUser = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("TwitchOAuth"),
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li'
                }
            });

            await getUser.json().then(data => {
                localStorage.setItem("UserData", JSON.stringify(data.data[0]));
            });

            UserData = JSON.parse(localStorage.getItem("UserData"));
            
            UserData = JSON.parse(localStorage.getItem("UserData"));
            
            console.info("User Profile Image URL: " + UserData["profile_image_url"]);
            document.getElementById("userAvatar").src = UserData["profile_image_url"];

            console.info("Username: " + UserData["display_name"]);
            document.getElementById("userName").innerText = `Welcome, ${UserData["display_name"]}!`;

            let chatSettings = localStorage.getItem("ChatSettings");
            if(chatSettings != null) {
                if(chatSettings != null) {
                    try {
                        const namedElements = document.querySelectorAll('label~*[id]');
                        namedElements[0].value = chatSettings.fontColor;
                        namedElements[1].value = chatSettings.bgColor;
                        namedElements[2].checked = chatSettings.showBadges;
                        namedElements[3].checked = chatSettings.emoteSources["7tv"];
                        namedElements[4].checked = chatSettings.emoteSources["btv"];
                        namedElements[5].checked = chatSettings.emoteSources["ffz"];
                        namedElements[6].value = chatSettings.fontSize;
                        namedElements[7].value = chatSettings.username;
                        namedElements[8].checked = chatSettings.transparentWindow;
                        namedElements[9].checked = chatSettings.topMost;
                        namedElements[10].value = chatSettings.pluginUrls;
    
                        document.getElementById("font-size-value").innerText = "Font Size: " + chatSettings.fontSize;
        
                        namedElements[7].placeholder = UserData.display_name;
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            
            window.electronAPI.updateRPC(JSON.stringify({
                details: 'In main menu...',
                state: 'Setting up stuff...',
                largeImageKey: 'logo',
                largeImageText: 'v1.0.0-beta',
                startTimestamp: Date.now(),
                buttons: [
                    { label: "Check out my Twitch!", url: `https://twitch.tv/${UserData.login}` },
                    { label: "Download the Overlay", url: "https://github.com/felixfromdiscord/iriscent-chat-overlay"}
                ]
            }));

            finishLoading();
            clearInterval(dotInterval);
            loading = false;
        } else {
            let getUser = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("TwitchOAuth"),
                    'Client-Id': 'opxhspb78xudppeapnoelutyyzz7li'
                }
            });
            
            await getUser.json().then(data => {
                localStorage.setItem("UserData", JSON.stringify(data.data[0]));
            });

            UserData = JSON.parse(localStorage.getItem("UserData"));
            
            console.info("User Profile Image URL: " + UserData["profile_image_url"]);
            document.getElementById("userAvatar").src = UserData["profile_image_url"];

            console.info("Username: " + UserData["display_name"]);
            document.getElementById("userName").innerText = `Welcome, ${UserData["display_name"]}!`;

            let chatSettings = JSON.parse(localStorage.getItem("ChatSettings"));
            if(chatSettings != null) {
                try {
                    const namedElements = document.querySelectorAll('label~*[id]');
                    namedElements[0].value = chatSettings.fontColor;
                    namedElements[1].value = chatSettings.bgColor;
                    namedElements[2].checked = chatSettings.showBadges;
                    namedElements[3].checked = chatSettings.emoteSources["7tv"];
                    namedElements[4].checked = chatSettings.emoteSources["btv"];
                    namedElements[5].checked = chatSettings.emoteSources["ffz"];
                    namedElements[6].value = chatSettings.fontSize;
                    namedElements[7].value = chatSettings.username;
                    namedElements[8].checked = chatSettings.transparentWindow;
                    namedElements[9].checked = chatSettings.topMost;
                    namedElements[10].value = chatSettings.pluginUrls;

                    document.getElementById("font-size-value").innerText = "Font Size: " + chatSettings.fontSize;
    
                    namedElements[7].placeholder = UserData.display_name;
                } catch (err) {
                    console.error(err);
                }
            }

            window.electronAPI.updateRPC(JSON.stringify({
                details: 'In main menu...',
                state: 'Setting up stuff...',
                largeImageKey: 'logo',
                largeImageText: 'v1.0.0-beta',
                startTimestamp: Date.now(),
                buttons: [
                    { label: "Check out my Twitch!", url: `https://twitch.tv/${UserData.login}` },
                    { label: "Download the Overlay", url: "https://github.com/felixfromdiscord/iriscent-chat-overlay"}
                ]
            }));

            finishLoading();
            clearInterval(dotInterval);
            loading = false;
        }

        await new Promise(r => setTimeout(r, 2500));
    }
}

async function finishLoading() {
    var loadingOverlay = document.getElementById("loading");

    loadingOverlay.classList.add("hide");

    await new Promise(r => setTimeout(r, 750));
    document.body.removeChild(loadingOverlay);

    if(!localStorage.getItem("notFirstRun")) {
        var template = document.querySelector('#popupTemplate');
    
        var clone = template.content.cloneNode(true);
        var popup = clone.children[0].children[0];

        popup.id = "WelcomePopup";

        popup.children[0].innerText = `Welcome, ${UserData["display_name"]}!`;
        popup.children[2].innerText = "Thanks for downloading the Iriscent Chat! This is an open-source, noncommercial project of mine, I will try to update it as much as I can, but no promises! If your anti-virus is thinking that the software is sketchy, it's because I can't afford the code signing fees (very expensive), the project is open-source, meaning anyone can see the code!\n\nHave fun!\n(for best results, restart the app)";

        popup.children[3].innerText = "Understood";

        popup.classList.add("show");

        app.appendChild(clone);

        popup.children[3].onclick = async function () {
            popup.classList.add("hide");
            popup.classList.remove("show");
            await new Promise(r => setTimeout(r, 750));
            localStorage.setItem("notFirstRun", true);
            app.removeChild(popup.parentElement);
        };
    }

    const launchbutton = document.getElementById("launch");
    const exitbutton = document.getElementById("exit");
    const logoutbutton = document.getElementById("logout");

    const fontsizevalue = document.getElementById("font-size-value");
    const fontsizeinput = document.getElementById("input-font-size");

    exitbutton.addEventListener("click", () => {
        window.electronAPI.exit();
    });

    fontsizeinput.addEventListener("input", (evt) => {
        fontsizevalue.innerText = "Font Size: " + fontsizeinput.value;
    });

    launchbutton.addEventListener("click", () => {
        const namedElements = document.querySelectorAll('label~*[id]');
        const settings = {
            "fontColor": namedElements[0].value,
            "bgColor": namedElements[1].value,
            "showBadges": namedElements[2].checked,
            "emoteSources": {
                "7tv": namedElements[3].checked,
                "btv": namedElements[4].checked,
                "ffz": namedElements[5].checked
            },
            "fontSize": namedElements[6].value,
            "username": namedElements[7].value,
            "transparentWindow": namedElements[8].checked,
            "topMost": namedElements[9].checked,
            "pluginUrls": namedElements[10].value
        }
        localStorage.setItem("ChatSettings", JSON.stringify(settings));

        window.electronAPI.launchChat(JSON.stringify(settings));

        window.electronAPI.updateRPC(JSON.stringify({
            details: 'Watching chat...',
            state: 'Reading all the funny messages...',
            largeImageKey: 'logo',
            largeImageText: 'v1.0.0-beta',
            startTimestamp: Date.now(),
            buttons: [
                { label: "Check out my Twitch!", url: `https://twitch.tv/${UserData.login}` },
                { label: "Download the Overlay", url: "https://github.com/felixfromdiscord/iriscent-chat-overlay"}
            ]
        }));
    });

    logoutbutton.addEventListener("click", async () => {
        let ans = await window.electronAPI.askLogout();
        if (ans === 0) {
            localStorage.removeItem("TwitchOAuth");
            localStorage.removeItem("UserData");
            window.electronAPI.forceQuit();
        }
    });

    document.getElementById("frameclose").addEventListener('click', (e) => {
        window.electronAPI.exit();
    });

    document.getElementById("frameminimize").addEventListener('click', (e) => {
        window.electronAPI.minimize();
    });

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    document.getElementById("input-script-list").addEventListener('input', (e) => {
        const regex = /^https:\/\/\S+\.\S{2,3}\/.+\.js|http:\/\/localhost.+\/\S+\.js\n{0,}$/;
        var value = e.target.value;
        var lines = value.split("\n");
        if(hasDuplicates(lines)) {
            e.target.style.backgroundColor = 'lightpink';
            return console.error("Duplicates found in the addon list");
        } else {
            e.target.style.backgroundColor = 'palegreen';
        }
        lines.forEach((l, i) => {
            if(l.length <= 1) return;
            if(regex.test(l)) {
                e.target.style.backgroundColor = 'palegreen';
            } else {
                e.target.style.backgroundColor = 'lightpink';
                return console.error("Incorrect link format found in the addon list");
            }
        });
    });

    document.getElementById("input-theme-list").addEventListener('input', (e) => {
        const regex = /^https:\/\/\S+\.\S{2,3}\/.+\.theme\.css|http:\/\/localhost.+\/\S+\.theme\.css\n{0,}$/;
        var value = e.target.value;
        var lines = value.split("\n");
        if(hasDuplicates(lines)) {
            e.target.style.backgroundColor = 'lightpink';
            return console.error("Duplicates found in the theme list");
        } else {
            e.target.style.backgroundColor = 'palegreen';
        }
        lines.forEach((l, i) => {
            if(l.length <= 1) return;
            if(regex.test(l)) {
                e.target.style.backgroundColor = 'palegreen';
            } else {
                e.target.style.backgroundColor = 'lightpink';
                return console.error("Incorrect link format found in the theme list");
            }
        });
    });
}