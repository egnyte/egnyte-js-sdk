@Library(value = ['avalonlib', 'seclib', 'pintlib', 'kubernetes-lib']) _


pipeline {
    agent {
        label "general-tools-rocky9"
    }
    options {
        timestamps()
        ansiColor('xterm')
        timeout(time: 1, unit: 'HOURS')
    }
    environment {
        GL_TOKEN = credentials('GITLAB_TOKEN')
    }
    stages {
        stage('test') {
            steps {
                sshagent(credentials: ['git_push']) {
                    sh 'git clone --depth=1 ssh://git@git.egnyte-internal.com/integrations/pint-runner-environment.git'
                }

                sh 'cp ./pint-runner-environment/egnyte-js-sdk/apiaccess.js ./spec/conf/apiaccess.js'
                sh 'ls -al spec/conf'

                script {
                    // Copy .npmrc to workspace so Docker container can access it
                    sh 'cp /home/packer/.npmrc ./.npmrc'

                    // Use Node.js 24 for all npm commands
                    // Mount SSL certificates to access internal Nexus registry
                    def dockerArgs = [
                        '-v /etc/pki:/etc/pki:ro',
                        '-v /etc/ssl:/etc/ssl:ro'
                    ].join(' ')
                    docker.image("node:24").inside(dockerArgs) {
                        // Set npm cache to a writable directory to avoid permission issues
                        sh 'export NPM_CONFIG_CACHE=$(pwd)/.npm && npm ci'
                        sh 'export NPM_CONFIG_CACHE=$(pwd)/.npm && npm run test:sequential'
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
