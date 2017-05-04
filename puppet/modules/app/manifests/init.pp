class app {

    require docker

    docker::image { 'node': }
    docker::image { 'microsoft/aspnetcore': }

    exec {'rm -rf /home/vagrant/apps/*':
        path => '/usr/bin:/usr/sbin:/bin'
    }

    file { '/home/vagrant/client-app':
        ensure => 'directory',
        source => 'puppet:///modules/app/Client',
        recurse => 'remote',
        path => '/home/vagrant/apps/client-app',
        owner => 'vagrant',
    }
}