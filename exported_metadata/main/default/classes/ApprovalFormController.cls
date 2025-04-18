public with sharing class ApprovalFormController {

    // Wrapper class to hold approval type data
    public class ApprovalTypeWrapper {
        @AuraEnabled public String label;
        @AuraEnabled public String value;

        public ApprovalTypeWrapper(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Approval_Config_Record__c> getApprovalConfigs() {
        return [
            SELECT Id, Approval_Type__c, Config_Name__c, Decision__c, Is_Approved__c
            FROM Approval_Config_Record__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<ApprovalTypeWrapper> getDistinctApprovalTypes() {
        // Get all approval records
        List<Approval_Config_Record__c> allRecords = [
            SELECT Id, Approval_Type__c
            FROM Approval_Config_Record__c
            WHERE Approval_Type__c != null
        ];

        // Use a map to track unique approval types
        Map<String, String> uniqueTypes = new Map<String, String>();

        // Populate the map with unique approval types
        for(Approval_Config_Record__c record : allRecords) {
            if(!uniqueTypes.containsKey(record.Approval_Type__c)) {
                uniqueTypes.put(record.Approval_Type__c, record.Approval_Type__c);
            }
        }

        // Create wrapper objects for each unique type
        List<ApprovalTypeWrapper> result = new List<ApprovalTypeWrapper>();
        for(String approvalType : uniqueTypes.keySet()) {
            result.add(new ApprovalTypeWrapper(approvalType, approvalType));
        }

        return result;
    }

    @AuraEnabled
    public static List<Approval_Config_Record__c> getRecordsByApprovalType(String approvalType) {
        return [
            SELECT Id, Approval_Type__c, Config_Name__c, Decision__c, Is_Approved__c
            FROM Approval_Config_Record__c
            WHERE Approval_Type__c = :approvalType
        ];
    }

    @AuraEnabled
    public static void updateDecision(Id recordId, String decisionValue) {
        Approval_Config_Record__c recordToUpdate = [
            SELECT Id FROM Approval_Config_Record__c WHERE Id = :recordId LIMIT 1
        ];
        recordToUpdate.Decision__c = decisionValue;
        update recordToUpdate;
    }
}