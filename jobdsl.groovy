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

folder('folder-test') {
    description('Folder containing all jobs for folder-a')
}
pipelineJob('folder-test/github-demo-v3') {
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