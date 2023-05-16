# EventLoop - Event Management System

## Team Name: HackstreetBoys
- Tuan Vu Ho (Scrum Master/Developer)
- Prompong Yutasane (Developer)
- Shridhar Prabhuraman (Developer)
- Rudra Harmish Jikadra (Developer)
- Vibhu Sharma (Developer)

### Requirements
- Dev/Test environment: Lubuntu 20.4.1 LTS
- Node 16.x LTS
- NPM 8.x
- Python 3.8.x
- pip3
- Firefox 106.x.x
---
### Testing System
EventLoop application shall be tested in Lubuntu 20.4.1 LTS Virtual Machine. The credentials for the virtual machine are as follows:
- Username: **lubuntu**
- Password: **lubuntu**

It is noted that the above password (i.e. sudo password) shall be used to install/update packages of the virtual machine as per following instructions before running the application.

---
### Initial System Configuration
To get started, ensure that all packages in the virtual machine are fully up to date. Enter Y if you are asked to install the package maintainer's version or if there is any other prompt during the installation.
```bash
$ sudo apt update
$ sudo apt upgrade
```
After the packages and dependencies are up to date. Check the version of Firefox installed on the machine with the following command. Ensure Firefox 106.x.x is installed so that all HTML elements (such as datetime-locale) are supported.
```bash
$ firefox -v              # Should return 106.x.x
```

If Firefox version is outdated (<= version 92), run the command below to update to the latest version.
```bash
$ sudo apt-get install --only-upgrade firefox
```

Please reboot the system if there is any update on the Linux Kernel. After that, install `curl` with the command below.
```bash
$ sudo apt install -y curl
```

Once curl is installed, Node 16.x can be downloaded and set up by using the following command.
```bash
$ curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
```

The script will run and add required elements to the VM apt sources, and will even run another apt update to make sure everything is ready to go. Once the above is finished, you will need to install or upgrade the current version of Node.js you have installed with the command below.
```bash
$ sudo apt install -y nodejs
```

After the installation is completed, the node version can be checked by the following command.
```bash
$ node --version            # Should return v16.x.x

```

Once all of the above configurations are done, the backend and frontend apps can be set up and run as per the instructions below.

---

### Backend
#### Check Python3 version
Lubuntu 20.4.1 LTS comes with a pre-installed Python 3.8.x. Python version can be checked by the command below. Ensure Python 3.8.x is installed.
```bash
$ python3 --version
```
If Python3 is not installed, run the command below to start the installation of Python 3.8. The sudo password is "lubuntu".
```bash
$ sudo apt install python3.8
```

#### Install pip3
Install the latest version of pip3 (python package manager) with the following command. The sudo password is "lubuntu".
```bash
$ sudo apt install python3-pip
```

#### Requirements
It is recommended to set up and install a Python *virtual environment* to protect the global environment and avoid dependency conflicts.
First, install the virtual environment package python3.8-venv using the following command. The sudo password is "lubuntu".
```bash
$ sudo apt install python3.8-venv
```

Change directory to the **backend** folder. It is noted that the `<path_to_project>` should be the path to where the project source code is unzipped.
```bash
$ cd <path_to_project>/backend
```

Run the following commands to create a virtual environment (named **"venv"**), and install all required dependencies automatically.
```bash
$ python3 -m venv venv
$ source venv/bin/activate
(venv)$ pip3 install -r requirements.txt
```

If some of the packages are not installed successufully, please run the following command for each package.
```bash
(venv)$ pip3 install <package-name>
```

Note: To deactivate the virtual environment and go back to the global environment. The command below can be used.
```bash
(venv)$ deactivate
$
```

#### How to run backend app
Once all dependencies are installed, the backend app can be run locally by the following command. Please ensure the venv (virtual environment) is activated inside the **backend** directory.
```bash
$ cd <path_to_project>/backend          # (Optional) Navigate to backend folder if required
$ source venv/bin/activate              # (Optional) Activate python virtual environment
(venv)$ python3 app.py                  # Execute backend app
```
Note: the first two commands are optional and only required if the terminal is closed or restarted.

Once the app starts, the swagger documentation of the application can be accessed at: http://localhost:5000/api/v1/ui 

---
### Frontend
The below commands must be performed in a new terminal and inside the **frontend** directory. Start a new terminal and change to the **frontend** directory (if required) by using the following command.
```bash
$ cd <path_to_project>/frontend
```

#### Install NPM
Install npm (Node package manager) with the command below. The sudo password is "lubuntu".
```bash
$ npm install
```
After the installation is finished, the npm version can be checked by the following command.
```bash
$ npm --version             # Should return v8.x.x
```
#### How to run frontend app
##### Local
To run the app in development mode locally, run the below command
```bash
$ npm run start
```
The application will spin up on http://localhost:3000/. The above command will automatically open a Firefox web browser and the application can be accessed by entering http://localhost:3000/ into the address bar.

##### Linting
Apply linting across all the frontend project directories
```bash
$ npm run pretty
```

##### Testing
Run unit tests
```bash
$ npm run test
```


