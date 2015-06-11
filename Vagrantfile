#encoding: utf-8
## Vagrantfile de la maquina virtual del entorno de desarrollo

box      = 'trusty64'
url      = 'https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box'
hostname = 'devenv-box'
domain   = 'com'
ip       = '192.168.0.42'
ram      = '1024'

Vagrant.configure("2") do |config|
  config.vm.box = box
  config.vm.hostname = "pfc-laminas-vm"
  config.vm.box_url = url
  config.vm.network "forwarded_port", guest: 80, host: 8082
  config.vm.synced_folder ".", "/vagrant", 
    type: "rsync",
    rsync__exclude: [".git/", ".node_modules/"],
    id: "workspace"

  config.vm.provider "virtualbox" do |v|
  	v.memory = ram
  	v.cpus = 2
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision "docker"
  config.vm.provision "shell", path: "./install-docker-compose.sh"
  config.vm.provision "shell", path: "./install-utilities.sh"

end