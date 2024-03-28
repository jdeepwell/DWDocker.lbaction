# A Simple LaunchBar Action to work with Docker containers

## Installation

- Checkout repo (should generated folder "DWDocker.lbaction"
- Locate DWDocker.lbaction in Finder
- Double click to install into LaunchBar

*(The last step will actually copy it over into `~/Library/Application Support/LaunchBar/Actions/`, so you can delete the original*


## Usage

Activate without Paramters (simply press return):
Lists all containers (running and exited)

Choose one of the containers and press return:
Presents list of available actions

Actions:

If container is running:
  - Stop
  - Restart
  - Shell (open bash in Terminal.app)

If container is stopped:
  - Start

