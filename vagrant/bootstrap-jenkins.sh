#!/bin/bash

JENKINS_URL='http://127.0.0.1:8080/'
JENKINS_PLUGINS_URL='https://updates.jenkins-ci.org/latest/'

# Wait for the jenkins instance to be up and running
wait_for_jenkins(){
    # Check the response for a success code
    while [[ $(curl -s -w "%{http_code}"  $JENKINS_URL -o /dev/null) != "200" ]]; do
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
JENKINS_VERSION=$(cat /var/lib/jenkins/config.xml | grep version\>.*\<\/version | grep -o [0-9\.]*)
echo $JENKINS_VERSION >> /var/lib/jenkins/jenkins.install.UpgradeWizard.state

# Restart jenkins
restart_jenkins

# Fetch the CLI client
sudo wget -q ${JENKINS_URL}jnlpJars/jenkins-cli.jar

# Install jenkins plugins
echo "--- Installing jenkins plugins ---"
java -jar jenkins-cli.jar -s $JENKINS_URL install-plugin ${JENKINS_PLUGINS_URL}git.hpi ${JENKINS_PLUGINS_URL}workflow-aggregator.hpi

# Restart jenkins safely (i.e. after plugin installation)
java -jar jenkins-cli.jar -s $JENKINS_URL safe-restart
java -jar jenkins-cli.jar -s $JENKINS_URL reload-configuration