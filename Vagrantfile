# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "sub-base"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  # Assign this VM to a host-only network IP, allowing you to access it
  # via the IP. Host-only networks can talk to the host machine as well as
  # any other machines on the same network, but cannot be accessed (through this
  # network interface) by any external networks.
   config.vm.network :hostonly, "192.168.33.18"

  # Enable provisioning with chef solo, specifying a cookbooks path, roles
  # path, and data_bags path (all relative to this Vagrantfile), and adding 
  # some recipes and/or roles.
  #
  config.vm.provision :chef_solo do |chef|
     chef.cookbooks_path = "./cookbooks"
     chef.add_recipe "archaeo18"
  end
end
Vagrant.configure("2") do |config|
  config.vm.synced_folder ".", "/home/vagrant/archaeo18"
    config.vm.define :archaeo18 do |archaeo18|
    archaeo18.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", 1024]
    end
  end
end
