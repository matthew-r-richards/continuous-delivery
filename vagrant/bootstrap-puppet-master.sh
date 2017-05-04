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

echo "--- Configuring /etc/hosts ---"
sudo cp /vagrant/nodes.json nodes.json

length=$(jq <"nodes.json" '.nodes["puppet.vm"]["links"] | length')

for (( i=0; i<$length; i++ ))
do

    ip=$(jq <"nodes.json" --arg index $i '.nodes["puppet.vm"]["links"][$index|tonumber]["ip"]')

    hostname=$(jq <"nodes.json" --arg index $i '.nodes["puppet.vm"]["links"][$index|tonumber]["hostname"]')

    host=$(echo "$ip $hostname" | sed 's/"//g')

    sudo echo "$host" >> /etc/hosts
done
sudo sed -i 's/127\.0\.0\.1.*/&\tpuppet.vm/' /etc/hosts

echo "--- Installing puppet server ---"
sudo apt-get -y install puppetserver

echo "--- Installing puppet modules ---"
/opt/puppetlabs/bin/puppet module install puppetlabs-ntp

echo "--- Updating the server memory allocation ---"
sudo sed -i 's/-Xms.*\s-Xmx.*\s/-Xms512m -Xmx512m /' /etc/default/puppetserver

echo "--- Configuring puppet server ---"
# Add optional alternate DNS names and certname to /etc/puppetlabs/puppet/puppet.conf
sudo sed -i 's/.*\[master\].*/&\ndns_alt_names = puppet,puppet.vm\ncertname = puppet.vm/' /etc/puppetlabs/puppet/puppet.conf

echo "--- Giving default user access to puppet configuration ---"
sudo usermod -a -G puppet vagrant
sudo chgrp puppet -R /etc/puppetlabs
sudo chmod g+w -R /etc/puppetlabs

echo "--- Starting the puppet server service ---"
sudo /opt/puppetlabs/bin/puppet resource service puppetserver ensure=running enable=true