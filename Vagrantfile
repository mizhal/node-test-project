#encoding: utf-8
## Vagrantfile de la maquina virtual del entorno de desarrollo

box      = 'trusty64'
url      = 'https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box'
hostname = 'devenv-box'
domain   = 'com'
ip       = '192.168.0.42'
ram      = '1024'

Vagrant.configure("2") do |config|
  config.vm.define :virtual_machine do |virtual|
    virtual.vm.box = box
    virtual.vm.hostname = "pfc-laminas-vm"
    virtual.vm.box_url = url
    virtual.vm.network "forwarded_port", guest: 80, host: 8082
    virtual.vm.synced_folder ".", "/vagrant", 
      type: "rsync",
      rsync__exclude: [".git/", ".node_modules/"],
      id: "workspace"

    virtual.vm.provider "virtualbox" do |v|
    	v.memory = ram
    	v.cpus = 2
      v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    end

    virtual.vm.provision "docker"
    virtual.vm.provision "shell", path: "./install-docker-compose.sh"
    virtual.vm.provision "shell", path: "./install-utilities.sh"
  end

  config.vm.define :la_villana do |villana|
    villana.vm.box = "tknerr/managed-server-dummy"
    villana.vm.synced_folder "./provision-scripts", "/home/deploy/vagrant", 
      type: "rsync",
      rsync__exclude: [".git/", ".node_modules/"],
      id: "workspace"

    villana.vm.provider :managed do |managed, override|
      managed.server = "192.168.2.17"
      override.ssh.username = "deploy"
      override.ssh.password = "F&m\"at&FxEgh0%4k dFk"
      #override.ssh.private_key_path = "/path/to/bobs_private_key"
    end

    villana.vm.provision "docker"
    villana.vm.provision "shell", path: "./install-docker-compose.sh"
    villana.vm.provision "shell", path: "./install-utilities.sh"
  end

end