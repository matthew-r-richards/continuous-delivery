class app {

    require docker

    docker::image { 'node': }
    docker::image { 'microsoft/aspnetcore': }

    exec {'rm -rf /home/vagrant/apps/*':
        path => '/usr/bin:/usr/sbin:/bin'
    }

    file { '/home/vagrant/apps':
        ensure => 'directory',
        owner => 'vagrant',
    }

    file { '/home/vagrant/apps/client-app':
        ensure => 'directory',
        source => 'puppet:///modules/app/Client',
        recurse => 'remote',
        owner => 'vagrant',
    }
}