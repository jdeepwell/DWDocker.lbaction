// LaunchBar Action Script

function run(argument)
{
    if (argument == undefined) {
        // execute system command: docker ps
        let result = LaunchBar.execute('/usr/local/bin/docker', 'ps', '-a');
        // parse container IDs and names
        let lines = result.split("\n");
        let containers = [];
        for (let i = 1; i < lines.length; i++) {
            let parts = lines[i].split(/\s+/);
            if (parts[1]) {
                containers.push({
                    id: parts[0],
                    name: parts[1],
                    status: 'unknown'
                });
            }
        }
        // loop over containers and check their status
        for (let i = 0; i < containers.length; i++) {
            let result = LaunchBar.execute('/usr/local/bin/docker', 'inspect', '--format', '{{.State.Status}}', containers[i].id);
            containers[i].status = result.trim();
            containers[i].statusIcon = containers[i].status == "running" ? "🏃" : "😴";
        }

        // loop over containers and create LaunchBar items
        let items = [];
        for (let i = 0; i < containers.length; i++) {
            items.push({
                title: `${containers[i].name} (${containers[i].status})`,
                action: 'containerSelect',
                actionArgument: {
                    id: containers[i].id,
                    status: containers[i].status,
                },
                icon: containers[i].statusIcon
            });
        }
        return items;
    } else {
    }
}

function containerSelect(arg)
{
    let items = [];
    if (arg.status == 'running') {
        items.push({
            title: 'Shell',
            action: 'containerShell',
            actionArgument: arg,
            icon: '🐚'
        });
        items.push({
            title: 'Restart',
            action: 'containerRestart',
            actionArgument: arg,
            icon: '🔄'
        });
        items.push({
            title: 'Stop',
            action: 'containerStop',
            actionArgument: arg,
            icon: '🛑',
            actionRunsInBackground: true
        });
    }
    else {
        items.push({
            title: 'Start',
            action: 'containerStart',
            actionArgument: arg,
            icon: '🚀'
        });
    }
    return items;
}

function containerStart(arg)
{
    LaunchBar.execute('/usr/local/bin/docker', 'start', arg.id);
    return containerSelect({id: arg.id, status: 'running'});
}

function containerStop(arg)
{
    LaunchBar.hide();
    LaunchBar.execute('/usr/local/bin/docker', 'stop', arg.id);
    // return containerSelect({id: arg.id, status: 'exited'});
}

function containerRestart(arg)
{
    LaunchBar.execute('/usr/local/bin/docker', 'restart', arg.id);
    return containerSelect({id: arg.id, status: 'running'});
}

function containerShell(arg)
{
    // open a terminal window and enter a bash in that container:
    // osascript -e 'tell app "Terminal" to do script "..."' 
    LaunchBar.executeAppleScript('tell application "Terminal" to do script "docker exec -it ' + arg.id + ' bash"');
    // Bring Terminal to front
    LaunchBar.executeAppleScript('tell application "Terminal" to activate');
    LaunchBar.hide();
}
