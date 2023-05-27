function loadPlugins(ES, plugins) {
    let pluginsArray = plugins.split("\n");

    pluginsArray.forEach(async p => {
        try {
            let importedPlugin = await import(p);
            let plugin = importedPlugin.default;
            plugin.onload();

            ES.addEvent(0, plugin.onmessage);
            ES.addEvent(1, plugin.onevent)
        } catch (err) {
            console.log(err);
            return;
        }
    });
}

window.loadPlugins = loadPlugins;