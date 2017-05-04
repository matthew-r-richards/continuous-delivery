class app {

    require docker

    exec {'rm -rf /home/vagrant/apps/*':
        path => '/usr/bin:/usr/sbin:/bin'
    }

    file { '/home/vagrant/client-app':
        ensure => 'directory',
        source => 'puppet:///modules/app/client',
        recurse => 'remote',
        path => '/home/vagrant/apps/client-app',
        owner => 'vagrant',
    }
}