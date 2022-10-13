pipeline {
    agent {label 'ecs'}
    
    stages {
        stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

            steps {
                checkout scm
            }
        }
        /*
        stage('list files') {
            steps {
                script {
                    sh "pwd"
                    sh "ls -l Dockerfile hello"
                    sh "tar -czvf hello.tar.gz Dockerfile hello"
                    sh "ls -l hello.tar.gz"
                }
            }
        }
*/
        stage('Building image') {
          steps{
            script {
              sh "/kaniko/executor --dockerfile=Dockerfile --verbosity debug --insecure --skip-tls-verify --force --destination=nelsonlopezam/kaniko-hello:1"
            }
          }
        }
    }
}
/*
node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */
/*
        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */
/*
        app = docker.build("nelsonlopezam/helloworld:poc")
    }
/*
    stage('Test image') {
        /* Ideally, we would run a test framework against our image.
         * For this example, we're using a Volkswagen-type approach ;-) */
/*
        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
/*
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
*/
/*
}
*/