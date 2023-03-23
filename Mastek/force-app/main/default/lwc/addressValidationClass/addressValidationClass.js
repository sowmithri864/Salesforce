import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import verify from '@salesforce/apex/AddressValidationClass.verify';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Lead.Street', 'Lead.City', 'Lead.State', 'Lead.Country', 'Lead.PostalCode'];
export default class AddressValidationClass extends LightningElement {
    @api recordId;
    street;
    city;
    state;
    country;
    postalcode;
    suggestedAddress1;
    realaddr2;
    suggestedCity;
    suggestedState;
    suggestedzip5;
    suggestedPostalCode;
    statu;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecords({ data, error }) {
        if (data) {
            console.log('Data===' + JSON.stringify(data));
            this.street = data.fields.Street.value;
            this.city = data.fields.City.value;
            this.state = data.fields.State.value;
            this.country = data.fields.Country.value;
            this.postalcode = data.fields.PostalCode.value;
        }
        else if (error) {
            console.log('error=====', error);
        }
    }
    handleClick() {
        verify({ add1v: this.street, add2v: this.country, citys: this.city, statev: this.state, zipecodev: this.postalcode })
        .then((result) => {
            this.statu = result.status;
            console.log('Data real' + JSON.stringify(result));
            this.suggestedAddress1 = result.Address1;
            this.suggestedCity = result.City;
            this.suggestedState = result.State;
            this.suggestedzip5 = result.Zip5;
            this.realaddr2 = result.Address2;
            this.suggestedPostalCode=result.Zip5;
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',message: error.body.message,
                    variant: 'error'
                })
            );
        });
        //this.updateAccount();
    }
    updateLead() {
        var fields = {
            Id: this.recordId,
            Street: this.realaddr2,
            City: this.suggestedCity,
            State: this.suggestedState,
            PostalCode: this.suggestedzip5,
            Country: this.suggestedAddress1,
            PostalCode: this.postalcode
        }
        console.log('fields', fields);
        const recordInput = {
            fields: fields
        };
        updateRecord(recordInput)
        .then(accup => {
            console.log('Data', JSON.stringify(accup));
            this.dispatchEvent(
                new ShowToastEvent({
                     title: 'Success',
                     message: 'Address updated',
                     variant: 'success'
                    })
                );
            }).catch(error => {
                console.log('error', error)
            })
    }
}