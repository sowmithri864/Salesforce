import { LightningElement, api } from 'lwc';
import FIRST_NAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Lead.LastName';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import STREET_FIELD from '@salesforce/schema/Lead.Street';
import CITY_FIELD from '@salesforce/schema/Lead.City';
import STATE_FIELD from '@salesforce/schema/Lead.State';
import ACADEMIC_DEPARTMENT from '@salesforce/schema/Lead.Academic_Dept__c';
import DOB_FIELD from '@salesforce/schema/Lead.DOB__c';
import {NavigationMixin} from 'lightning/navigation';

export default class rfiForm extends NavigationMixin(LightningElement) {
    firstnameField = FIRST_NAME_FIELD;
    lastNameField = LAST_NAME_FIELD;
    companyField = COMPANY_FIELD;
    phoneField = PHONE_FIELD;
    emailField = EMAIL_FIELD;
    streetField = STREET_FIELD;
    cityField = CITY_FIELD;
    stateField = STATE_FIELD;
    academicDeptField = ACADEMIC_DEPARTMENT;
    dob = DOB_FIELD;

    handleSuccess(event){
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Form submitted successfully!!',
            variant: 'success'
        });
        //console.log('Success -> ' + evt.detail.message)
        this.dispatchEvent(evt);
        this.navToLoginPage();
    }

    navToLoginPage(){
        this[NavigationMixin.Navigate](
            {
                type: 'comm__loginPage',
                attributes: {
                    actionName: 'login'
                }
            }
        );
    }
}


