job('demo-v3') {
    steps {
        shell('echo Hello World!')
    }
}

pipelineJob('github-demo-v3') {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        github('jenkinsci/pipeline-examples')
                    }
                }
            }
            scriptPath('declarative-examples/simple-examples/environmentInStage.groovy')
        }
    }
}