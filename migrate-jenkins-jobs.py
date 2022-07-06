#!/usr/local/bin/python3
# Usage
# Required files
# Author
# version
# Description

import logging
import sys
import argparse
import configparser
from api4jenkins import Jenkins

logging.basicConfig(format="%(asctime)s %(message)s", level=logging.INFO, handlers=[logging.FileHandler("jenkins-migration.log"),logging.StreamHandler(sys.stdout)])

class Migration:
    __conf = None

    @staticmethod
    def config(file):
        if Migration.__conf is None:
            Migration.__conf = configparser.ConfigParser()
            Migration.__conf.read(file)
        return Migration.__conf

def validate_conf(configFile):
    try:
        validate_output=''
        for section in configFile.sections():
            for options in configFile.options(section):
                if len(configFile.get(section, options)) == 0:
                    validate_output=validate_output+' '+options
    except:
        logging.error("ERROR - Unable to read config file")
    
    return validate_output

def connectionTest(config):
    try:
        logging.info("%s","-"*50)
        logging.info("INFO - Testing connection parameters to SOURCE Jenkins Server [%s] with User: [%s]", config['SOURCE']['JENKINS_SOURCE_URL'], config['SOURCE']['JENKINS_SOURCE_USER'])
        source = Jenkins(config['SOURCE']['JENKINS_SOURCE_URL'], auth=(config['SOURCE']['JENKINS_SOURCE_USER'], config['SOURCE']['JENKINS_SOURCE_TOKEN']))
        location=config['SOURCE']['JENKINS_SOURCE_URL']
        logging.info("INFO - Connected to: [%s] - Running version: [%s]", config['SOURCE']['JENKINS_SOURCE_URL'], source.version)

        logging.info("INFO - Testing connection parameters to TARGET Jenkins Server [%s] with User: [%s]", config['TARGET']['JENKINS_TARGET_URL'], config['TARGET']['JENKINS_TARGET_USER'])
        target = Jenkins(config['TARGET']['JENKINS_TARGET_URL'], auth=(config['TARGET']['JENKINS_TARGET_USER'], config['TARGET']['JENKINS_TARGET_TOKEN']))
        location=config['TARGET']['JENKINS_TARGET_URL']
        logging.info("INFO - Connected to: [%s] - Running version: [%s]", config['TARGET']['JENKINS_TARGET_URL'], target.version)

        return True

    except:
        logging.error("ERROR - Connection Test to %s - found error while testing connections, please validate connection information", location)
        return False
    else:
        logging.error("ERROR - multiple errors, please validate connection information")
        return False

def migrate(config):
    try:
        source = Jenkins(config['SOURCE']['JENKINS_SOURCE_URL'], auth=(config['SOURCE']['JENKINS_SOURCE_USER'], config['SOURCE']['JENKINS_SOURCE_TOKEN']))
        target = Jenkins(config['TARGET']['JENKINS_TARGET_URL'], auth=(config['TARGET']['JENKINS_TARGET_USER'], config['TARGET']['JENKINS_TARGET_TOKEN']))
        
        logging.info(" %s Starting Migration %s", "#"*10, "#"*10)
        logging.info("%s","-"*50)
        logging.info("INFO - Migration From: %s", config['SOURCE']['JENKINS_SOURCE_URL'])
        logging.info("INFO - Jenkins Version: %s", source.version)
        logging.info("%s","-"*50)
        logging.info("INFO - Destination Server: %s", config['TARGET']['JENKINS_TARGET_URL'])
        logging.info("INFO - Jenkins Version: %s", target.version)
        logging.info("%s","-"*50)
        logging.info("INFO - Migration options: ")
        for lineOptions in config['OPTIONS']:
                if len(config.get('OPTIONS', lineOptions)) > 0:
                    logging.info("INFO -    - %s: %s", lineOptions, config.get('OPTIONS', lineOptions))
        
        logging.info("%s","-"*50)

        list_jobs(config, source, target)

        logging.info(" %s Migration Finished %s", "#"*10, "#"*10)

    except:
        logging.error("ERROR - found error while starting migrations")


def create_job(job, config, target):
    try:
        logging.info("INFO - getting xml for : %s", job.full_name)
        job_exists=target.get_job(job.full_name)
        if job_exists :
            if config['OPTIONS']['UPDATE_EXISTING_JOBS'].upper() == 'TRUE' :
                logging.info("INFO - Job exists [%s] - UPDATE_EXISTING_JOBS: True", job.full_name)
                job_exists.configure(job.configure())
                if config['OPTIONS']['DISABLE_JOBS'] :
                    job_exists.disable()
                logging.info("INFO - [UPDATED] - Job [%s] Sucessfuly updated", job.full_name)
            else :
                logging.info("INFO - [SKIPPED] - Job exists [%s] UPDATE_EXISTING_JOBS: False | skipping...!", job.full_name)
        else:
            target.create_job(job.full_name, job.configure(), recursive=True)
            if config['OPTIONS']['DISABLE_JOBS'] :
                job_exists=target.get_job(job.full_name)
                job_exists.disable()
            logging.info("INFO - [CREATED] - Job [%s] succesfully migrated", job.full_name)

    except:
        logging.error("ERROR - Unable to create job [%s] in jenkins server", job.full_name)


def list_jobs(config, source, target):
    try:
        
        for job in source.iter_jobs(depth=config['OPTIONS']['JOB_DEPTH']):
            logging.info("INFO - Moving %s : [%s]", job._class.split('.')[-1], job.full_name)
            create_job(job, config, target)
    
    except:
        logging.error("ERROR - Unable to read jobs from jenkins server")

def disable_enable_jobs(config, action):
    try:
        target = Jenkins(config['TARGET']['JENKINS_TARGET_URL'], auth=(config['TARGET']['JENKINS_TARGET_USER'], config['TARGET']['JENKINS_TARGET_TOKEN']))
        for job in target.iter_jobs(depth=config['OPTIONS']['JOB_DEPTH']):
            if job._class.split('.')[-1] != 'Folder':
                if action == "DISABLE" :
                    job.disable()
                    logging.info("INFO - Job %s : [%s] - [DISABLED]", job._class.split('.')[-1], job.full_name)
                else:
                    job.enable()
                    logging.info("INFO - Job %s : [%s] - [ENABLED]", job._class.split('.')[-1], job.full_name)
    
    except:
        logging.error("ERROR - Unable to read jobs from jenkins server to %s", action)

if __name__ == "__main__":
    try:
        # ./migrate-jenkins-job.py -C ./jenkins-migration.conf
        parser = argparse.ArgumentParser("migrate-jenkins-job.py", add_help=True)
        parser.add_argument( '-C','--config',default='',dest='config_file_path',action='store',metavar='',help='Path for the config file', required=True)
        parser.add_argument( '-T','--test',default=False,dest='cnx_test',action='store',metavar='',help='Test Connection only to Jenkins Source/Target', required=False)
        parser.add_argument( '-D','--disable',default='',dest='disable_jobs',action='store',metavar='',help='Disable jobs on Target Server', required=False)
        parser.add_argument( '-E','--enable',default='',dest='enable_jobs',action='store',metavar='',help='Enable jobs on Target Server', required=False)

        args = parser.parse_args()
        
        configKeys=validate_conf(Migration.config(args.config_file_path))
        if len(configKeys) > 0:
            print(f'INFO - [{configKeys}] not set in the \'jenkins-migration.conf\' file, please set the proper value\n')
        else:
            if args.cnx_test :
                logging.info("INFO - Testing connection parameters to Jenkins Servers")
                if connectionTest(Migration.config(args.config_file_path)) :
                    logging.info("INFO - Succesfully connected with parameters to Jenkins Servers")
            else :
                if args.disable_jobs :
                    disable_enable_jobs(Migration.config(args.config_file_path), "DISABLE")
                else:
                    if args.enable_jobs :
                        disable_enable_jobs(Migration.config(args.config_file_path), "ENABLE")
                    else:
                        migrate(Migration.config(args.config_file_path))
                
    except SystemExit:
        sys.exit(2)