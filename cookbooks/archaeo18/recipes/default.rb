execute "apt-get update"
packages = ["openjdk-7-jdk", "ant"]

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

execute "ant -f /home/vagrant/archaeo18/build.xml serve > /dev/null 2>&1 &"