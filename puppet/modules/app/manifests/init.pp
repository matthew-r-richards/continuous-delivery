class app {

    require docker

    docker::image { 'node': }
    docker::image { 'microsoft/aspnetcore': }

    file { '/home/vagrant/apps/remove_old_docker_images.sh':
        source => 'puppet:///modules/app/remove_old_docker_images.sh',
        ensure => present,
        mode => 'a+x'
    }

    exec {'remove_old_images':
        require => File['/home/vagrant/apps/remove_old_docker_images.sh'],
        command => "/home/vagrant/apps/remove_old_docker_images.sh"
    }

    exec {'rm -rf /home/vagrant/apps/*':
        path => '/usr/bin:/usr/sbin:/bin'
    }

    file { '/home/vagrant/apps':
        ensure => 'directory',
        owner => 'vagrant',
    }

    file { '/home/vagrant/apps/Client':
        ensure => 'directory',
        source => 'puppet:///modules/app/Client',
        recurse => 'remote',
        owner => 'vagrant',
    }

    file { '/home/vagrant/apps/Server':
        ensure => 'directory',
        source => 'puppet:///modules/app/Server',
        recurse => 'remote',
        owner => 'vagrant',
    }

    file { '/home/vagrant/apps/docker-compose.yml':
        ensure => 'present',
        source => 'puppet:///modules/app/docker-compose.yml',
        owner => 'vagrant',
        require => File['/home/vagrant/apps/Server']
    }
    
    class {'docker::compose':
      ensure => present
    }

    docker_compose {'/home/vagrant/apps/docker-compose.yml':
      ensure => present
    }
}