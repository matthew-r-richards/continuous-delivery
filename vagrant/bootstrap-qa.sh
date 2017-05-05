#!/bin/bash

echo "--- Restarting network interfaces ---"
sudo service network-manager stop
sudo ifdown eth1
sudo ifup eth1
sudo service network-manager start

echo "--- Adding apt repositories ---"
wget https://apt.puppetlabs.com/puppetlabs-release-pc1-trusty.deb
sudo dpkg -i puppetlabs-release-pc1-trusty.deb

echo "--- Updating apt package lists ---"
sudo apt-get -y update

# Install jq to parse json files
echo "--- Installing utilities ---"
sudo apt-get -y install jq

echo "--- Installing puppet agent ---"
sudo apt-get -y install puppet-agent

echo "--- Configuring /etc/hosts ---"
sudo cp /vagrant/nodes.json nodes.json

length=$(jq <"nodes.json" '.nodes["qa.vm"]["links"] | length')

for (( i=0; i<$length; i++ ))
do

    ip=$(jq <"nodes.json" --arg index $i '.nodes["qa.vm"]["links"][$index|tonumber]["ip"]')

    hostname=$(jq <"nodes.json" --arg index $i '.nodes["qa.vm"]["links"][$index|tonumber]["hostname"]')

    host=$(echo "$ip $hostname" | sed 's/"//g')

    sudo echo "$host" >> /etc/hosts
done
sudo sed -i 's/127\.0\.0\.1.*/&\tqa.vm/' /etc/hosts

echo "--- Configuring agent ---"
# Add agent section to puppet.conf
sudo sed -i '$ a [agent]\nserver=puppet.vm\nenvironment=qa' /etc/puppetlabs/puppet/puppet.conf

# Add main section with certname to puppet.conf
sudo sed -i '$ a [main]\ncertname=qa.vm' /etc/puppetlabs/puppet/puppet.conf