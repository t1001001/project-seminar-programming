# Project Seminar Programming - Fitness Tracker

Repository for the project seminar in programming for the winter semester 25/26.

## Prerequisites

Before running the project, install the following dependencies.

### 1. Java 21
```bash
sudo apt update
sudo apt install -y openjdk-21-jdk
java -version
```

### 2. Maven
```bash
sudo apt update
sudo apt install -y maven
```

### 3. Docker & Docker Compose
```bash
sudo apt remove docker docker-engine docker.io containerd runc
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Usage

## Contributors

Donauer, Marc

Kohnle, Philipp

Nguyen, Tobias

Schulz, Lukas

Sorg, Luca

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
