execute "apt-get update"

packages = ["openjdk-7-jdk", "ant", "libjaxp1.3", "htop", "git", "vim", "language-pack-de"]

packages.each do |p|
	package p
end

# make a small shell script to start archaeo18
cookbook_file "/usr/bin/archaeo18" do
	source "archaeo18"
	mode "0755"
end

# add archaeo18 startup to upstart
cookbook_file "/etc/init/archaeo18.conf" do
	source "archaeo18.conf"
	mode "0644"
end

execute "initctl reload-configuration"
execute "start archaeo18"