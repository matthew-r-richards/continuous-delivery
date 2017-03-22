#!/bin/bash

echo "--- Updating apt package lists ---"
sudo apt-get -y update

# Install git
echo "--- Installing git ---"
sudo apt-get -y install git

# Install jenkins
echo "--- Installing jenkins ---"
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get -y update
sudo apt-get -y install jenkins