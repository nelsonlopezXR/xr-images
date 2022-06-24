#!/bin/bash

## Exit on fail
set -o errexit
## Exit on undeclared variables
set -o nounset
## Produces a failure return code when using pipelines
set -o pipefail
### To Enable Debug	set to true
DEBUG=false
[[ "${DEBUG}" == 'true' ]] && set -o xtrace



## Load configuration information
source $(pwd)/jenkins-migration.conf
## Global Settings
header=" #### Starting migration of jobs from ${JENKINS_SOURCE_URL} ####"
folderPlugin="com.cloudbees.hudson.plugins.folder.Folder"
curlFolderHeader="Content-Type:application/x-www-form-urlencoded"
curlJobHeader="Content-Type:text/xml"


## Validates configuration file
function validate_conf() {
    validate_output=""
    if [ -z ${JENKINS_SOURCE_USER} ]; then
      validate_output="'JENKINS_SOURCE_USER',"
    fi
    if [ -z ${JENKINS_SOURCE_TOKEN} ]; then
      validate_output="${validate_output} 'JENKINS_SOURCE_TOKEN',"
    fi
    if [ -z ${JENKINS_SOURCE_URL} ]; then
      validate_output="${validate_output} 'JENKINS_SOURCE_URL',"
    fi
    if [ -z ${JENKINS_TARGET_USER} ]; then
      validate_output="${validate_output} 'JENKINS_TARGET_USER',"
    fi
    if [ -z ${JENKINS_TARGET_TOKEN} ]; then
      validate_output="${validate_output} 'JENKINS_TARGET_TOKEN',"
    fi
    if [ -z ${JENKINS_TARGET_URL} ]; then
      validate_output="${validate_output} 'JENKINS_TARGET_URL',"
    fi
    if [ -z ${JENKINS_CLI_PATH} ]; then
      validate_output="${validate_output} 'JENKINS_CLI_PATH',"
    fi
    if [[ ${#validate_output} > 0 ]]; then
      printf "\nINFO - ${validate_output} not set in the 'jenkins.auth' file, please set the proper value\n"
      exit 1
    fi
}

error_check() {
    if [[ $1 -ne 0 ]]; then
      echo "Something went wrong, Error code: $2" ; exit 1
    fi
}

## Creates folders in target jenkins
function create_folder() {
    if [[ $(echo ${1} | grep '/') ]]; then
        folderName="${1##*/}"
        baseFolder="${1%/*}"
        printf "\n"
        printf "%0.s-" $(seq 1 ${#header})
        printf "\nINFO - Create Folder: ${baseFolder}/${folderName}"
        
        json="{%7B%22name%22%3A%22${folderName}%22%2C%22mode%22%3A%22${folderPlugin}%22%2C%22from%22%3A%22%22%2C%22Submit%22%3A%22OK%22}"
        curl -XPOST "${JENKINS_TARGET_URL}/job/${baseFolder}/createItem?name=${folderName}&mode=${folderPlugin}&from=&json=${json}%7D&Submit=OK" --user "${JENKINS_TARGET_USER}:${JENKINS_TARGET_TOKEN}" -H "${curlFolderHeader}"
    else
        printf "\n"
        printf "%0.s-" $(seq 1 ${#header})
        printf "\nINFO - Create Folder: ${1}"

        json="{%7B%22name%22%3A%22${1}%22%2C%22mode%22%3A%22${folderPlugin}%22%2C%22from%22%3A%22%22%2C%22Submit%22%3A%22OK%22}"
        curl -XPOST "${JENKINS_TARGET_URL}/createItem?name=${1}&mode=${folderPlugin}&from=&json=${json}%7D&Submit=OK" --user "${JENKINS_TARGET_USER}:${JENKINS_TARGET_TOKEN}" -H "${curlFolderHeader}"
    fi
    
}

## Creates jobs in target jenkins
function create_jobs() {
    folderName="${1%/*}"
    jobName="${1##*/}"

    if [ ${folderName} = ${jobName} ]; then
        printf "\n"
        printf "%0.s-" $(seq 1 ${#header})
        printf "\nINFO - Migrating JOB to Folder: [/] - JobName - ${jobName}"

        job=$(java -jar ${JENKINS_CLI_PATH}/jenkins-cli.jar -auth ${JENKINS_SOURCE_USER}:${JENKINS_SOURCE_TOKEN} -s ${JENKINS_SOURCE_URL} -webSocket get-job ${jobName})
        curl -s -XPOST "${JENKINS_TARGET_URL}/createItem?name=${jobName}" --data-binary "${job}" -H "${curlJobHeader}" --user "${JENKINS_TARGET_USER}:${JENKINS_TARGET_TOKEN}"
    else
        printf "\nINFO - Migrating JOB to Folder: [${folderName}] - JobName: ${jobName}"
        
        job=$(java -jar ${JENKINS_CLI_PATH}/jenkins-cli.jar -auth ${JENKINS_SOURCE_USER}:${JENKINS_SOURCE_TOKEN} -s ${JENKINS_SOURCE_URL} -webSocket get-job ${folderName}/${jobName})
        curl -s -XPOST "${JENKINS_TARGET_URL}/job/${folderName}/createItem?name=${jobName}" --data-binary "${job}" -H "${curlJobHeader}" --user "${JENKINS_TARGET_USER}:${JENKINS_TARGET_TOKEN}"
    fi
}

## Gets all the jobs to export from source jenkins
function list_jobs() {
    if [ $# -eq 0 ]; then
        for x in $(java -jar ${JENKINS_CLI_PATH}/jenkins-cli.jar -auth ${JENKINS_SOURCE_USER}:${JENKINS_SOURCE_TOKEN} -s ${JENKINS_SOURCE_URL} -webSocket list-jobs All); 
        do
            list_jobs ${x} || true
        done
    else
        job=$1
        page=$(java -jar ${JENKINS_CLI_PATH}/jenkins-cli.jar -auth ${JENKINS_SOURCE_USER}:${JENKINS_SOURCE_TOKEN} -s ${JENKINS_SOURCE_URL} -webSocket list-jobs ${job} 2>/dev/null)
        if [[ ${#page} > 0 ]]; then
            folder=${job}
            create_folder ${folder}
            for y in ${page}; 
            do
                list_jobs ${1}"/"${y} || true
            done
        else
            create_jobs ${job} ${folder}
        fi
    fi
}

validate_conf
printf "\n${header}\n"
list_jobs
