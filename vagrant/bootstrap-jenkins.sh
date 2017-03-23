#!/bin/bash

# Wait for the jenkins instance to be up and running
wait_for_jenkins(){
    # Check the response for a success code
    while [[ $(curl -s -w "%{http_code}"  http://127.0.0.1:8080 -o /dev/null) != "200" ]]; do
       sleep 1
    done
}

# Restart jenkins instance, pause script execution until it is back up and running
restart_jenkins(){
    sudo service jenkins restart
    wait_for_jenkins
}

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

# Copy jenkins configuration file (which is in the shared directory)
echo "--- Configuring jenkins ---"
sudo cp /jenkins-config/config.xml /var/lib/jenkins/config.xml

# Disable the upgrade wizard by setting the version
JENKINSVERSION=$(cat /var/lib/jenkins/config.xml | grep version\>.*\<\/version | grep -o [0-9\.]*)
echo $JENKINSVERSION >> /var/lib/jenkins/jenkins.install.UpgradeWizard.state

# Restart jenkins
restart_jenkins

# Fetch the CLI client
sudo wget http://127.0.0.1:8080/jnlpJars/jenkins-cli.jar

# Install jenkins plugins
echo "--- Installing jenkins plugins ---"
java -jar jenkins-cli.jar -s http://127.0.0.1:8080/ install-plugin git workflow-aggregator