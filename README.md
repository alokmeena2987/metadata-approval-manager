# Approval Metadata Manager

A Salesforce metadata management tool focused on importing, editing, and redeploying the Approval_Config_Record__c custom object.

## Overview

This repository contains tools and scripts to manage Salesforce metadata related to approval configurations.

## Features

- **Export Metadata**: Extract Approval_Config_Record__c and related metadata from a Salesforce org
- **Edit Configurations**: Modify approval configurations locally
- **Deploy Changes**: Push updated metadata back to Salesforce

## Requirements

- Python 3.x
- Salesforce CLI (sf)
- Salesforce org with appropriate permissions

## Usage

### Exporting Metadata

```bash
python export_metadata.py
```

This script retrieves metadata based on the manifest/package.xml file and stores it in the exported_metadata directory.

### Deploying Metadata

```bash
python deploy_metadata.py
```

This script deploys the metadata from the exported_metadata directory back to the Salesforce org.

## Structure

- `manifest/package.xml`: Defines the metadata components to retrieve
- `exported_metadata/`: Contains the exported Salesforce metadata
- `*.py`: Python scripts for metadata operations
- `sfdx-project.json`: SFDX project configuration

## Custom Object: Approval_Config_Record__c

The main custom object used in this project with fields including:
- Approval_Type__c
- Config_Name__c
- Decision__c
- Is_Approved__c

