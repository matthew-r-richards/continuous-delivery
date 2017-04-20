#!/bin/bash

JENKINS_URL='http://127.0.0.1:8080/'
JENKINS_PLUGINS_URL='https://updates.jenkins-ci.org/latest/'
JENKINS_PLUGINS_DIR='/var/lib/jenkins/plugins'

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

# Adapted from https://gist.github.com/micw/e80d739c6099078ce0f3
install_plugin(){
  if [ -f ${JENKINS_PLUGINS_DIR}/${1}.hpi -o -f ${JENKINS_PLUGINS_DIR}/${1}.jpi ]; then
    if [ "$2" == "1" ]; then
      return 1
    fi
    echo "Skipped: $1 (already installed)"
    return 0
  else
    echo "Installing: $1"
    curl -L --silent --output ${JENKINS_PLUGINS_DIR}/${1}.hpi  ${JENKINS_PLUGINS_URL}${1}.hpi
    return 0
  fi
}

echo "--- Adding apt repositories ---"
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893

echo "--- Updating apt package lists ---"
sudo apt-get -y update

# Install git and unzip
echo "--- Installing utilities ---"
sudo apt-get -y install git unzip

# Install dotnet core
echo "--- Installing dotnet core ---"
sudo apt-get -y install dotnet-dev-1.0.1

# Install jenkins
echo "--- Installing jenkins ---"
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
install_plugin "git"
install_plugin "workflow-aggregator"

changed=1

while [ "$changed"  == "1" ]; do
  echo "Check for missing dependecies ..."
  changed=0
  for f in /var/lib/jenkins/plugins/*.hpi ; do
      deps=$( unzip -p ${f} META-INF/MANIFEST.MF | tr -d '\r' | sed -e ':a;N;$!ba;s/\n //g' | grep -e "^Plugin-Dependencies: " | awk '{ print $2 }' | tr ',' '\n' | awk -F ':' '{ print $1 }' | tr '\n' ' ' )
      for plugin in $deps; do
        install_plugin "$plugin" 1 && changed=1
      done
  done
done

restart_jenkins

# Create jenkins jobs
echo "--- Creating jenkins jobs ---"
sudo java -jar jenkins-cli.jar -s $JENKINS_URL create-job continuous-deployment < /jenkins-config/continuous-deployment-config.xml

restart_jenkins

# Add jenkins user to docker group
sudo gpasswd -a jenkins docker
sudo service docker restart

restart_jenkins