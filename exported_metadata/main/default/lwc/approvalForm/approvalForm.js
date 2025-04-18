import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDistinctApprovalTypes from '@salesforce/apex/ApprovalFormController.getDistinctApprovalTypes';
import getRecordsByApprovalType from '@salesforce/apex/ApprovalFormController.getRecordsByApprovalType';
import updateDecision from '@salesforce/apex/ApprovalFormController.updateDecision';

export default class Approvalform extends LightningElement {
    @track approvalTypeOptions = [];
    @track configOptions = [];
    @track selectedApprovalType = '';
    @track selectedConfigId = '';
    @track selectedDecision = '';
    @track showSuccess = false;
    @track showConfigs = false;
    @track isLoading = false;

    // Computed properties for UI state
    get acceptButtonClass() {
        return this.selectedDecision === 'Accept' ? 'decision-button selected' : 'decision-button';
    }

    get denyButtonClass() {
        return this.selectedDecision === 'Deny' ? 'decision-button selected' : 'decision-button';
    }

    get isSubmitDisabled() {
        return !this.selectedConfigId || !this.selectedDecision || this.isLoading;
    }

    // Get distinct approval types
    @wire(getDistinctApprovalTypes)
    wiredApprovalTypes({ data, error }) {
        if (data) {
            this.approvalTypeOptions = data;
        } else if (error) {
            console.error('Error fetching approval types:', error);
        }
    }

    // Handle approval type selection
    handleApprovalTypeChange(event) {
        this.selectedApprovalType = event.detail.value;
        this.selectedConfigId = ''; // Reset config selection
        this.isLoading = true;

        // Fetch records for the selected approval type
        getRecordsByApprovalType({ approvalType: this.selectedApprovalType })
            .then(result => {
                this.configOptions = result.map(record => ({
                    label: record.Config_Name__c,
                    value: record.Id
                }));
                this.showConfigs = this.configOptions.length > 0;
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error fetching records by approval type:', error);
                this.isLoading = false;
            });
    }

    // Handle config selection
    handleConfigChange(event) {
        this.selectedConfigId = event.detail.value;
    }

    // Handle Accept click
    handleAcceptClick() {
        this.selectedDecision = 'Accept';
    }

    // Handle Deny click
    handleDenyClick() {
        this.selectedDecision = 'Deny';
    }

    // Submit the decision
    handleSubmit() {
        if (this.selectedConfigId && this.selectedDecision) {
            this.isLoading = true;
            updateDecision({ recordId: this.selectedConfigId, decisionValue: this.selectedDecision })
                .then(() => {
                    this.showSuccess = true;
                    this.isLoading = false;
                    setTimeout(() => { this.showSuccess = false }, 3000);
                })
                .catch(error => {
                    console.error('Error submitting decision:', error);
                    this.isLoading = false;
                });
        } else {
            // Show error message with better UX than an alert
            const evt = new ShowToastEvent({
                title: 'Required Fields Missing',
                message: 'Please select both Approval Type and Decision.',
                variant: 'warning',
            });
            this.dispatchEvent(evt);
        }
    }
}