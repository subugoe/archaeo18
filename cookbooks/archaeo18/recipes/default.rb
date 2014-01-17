execute "apt-get update"

# http://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
execute 'DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade'
execute 'DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade'

packages = ["openjdk-7-jdk", "ant", "libjaxp1.3", "htop", "git"]

packages.each do |p|
	package p
end

# make a small shell script to start archaeo18
cookbook_file "/usr/local/bin/archaeo18" do
	source "archaeo18"
	mode "0755"
end

# add archaeo18 startup to upstart
cookbook_file "/etc/init/archaeo18.conf" do
	source "archaeo18.conf"
	mode "0644"
end

execute "cd /home/vagrant/archaeo18/ && ant serve > /dev/null 2>&1 &"