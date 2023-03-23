import { LightningElement, track, wire } from "lwc";
import saveApplicationRecord from "@salesforce/apex/AppEnroll.saveApplication";
import getContactRecord from "@salesforce/apex/AppEnroll.getContactData";
import getContactName from "@salesforce/apex/AppEnroll.getContactName";
import getContactAppDataStatus from "@salesforce/apex/AppEnroll.getContactAppDataStatus"
import getEnrollCourselist from "@salesforce/apex/AppEnroll.getEnrollData";
import getCourselist from "@salesforce/apex/AppEnroll.getCourseData";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Id from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";
//import APPLICATION_FIELD from "@salesforce/schema/Application__c.IsApplicationSubmitted__c";
import { getRecord } from "lightning/uiRecordApi";
const MAX_FILE_SIZE = 100000000; //10mb

export default class ApplicationEnrollment extends LightningElement {
  @track courselist;
  @track subjectlist;
  @track error;
  @track name;
  @track exp;
  @track DOB;
  //@track contact;

  seatcount;
  ApplicationStatus;
  // viewForm = true;
  contactId;
  dateval;


  applist = [];

  uploadedFiles = [];
  file;
  fileContents;
  fileReader;
  content;
  fileName;
  course;


  UserFullName;
  @wire(getRecord, { recordId: Id, fields: [NAME_FIELD] })
  userDetails({ error, data }) {
    if (data) {
      this.UserFullName = data.fields.Name.value;
      console.log(this.UserFullName);
    } else if (error) {
      this.error = error;
    }
  }

  ContactName;
  @wire(getContactName, { userName: "$UserFullName" }) wiredConName({error, data}) {
    if (data) {
      console.log('ContactName is'+ data);
      this.ContactName = data;
      this.error = undefined;
    } else if (error) {
      console.log('Error block'+ JSON.stringify(error));
      this.error = error;
      this.ContactName = undefined;
    }
  }

  ContactStatus;
  @wire(getContactRecord, { userName: "$UserFullName" }) wiredContacts({error, data}) {
    if (data) {
      console.log('ContactStatus is'+ data);
      this.ContactStatus = data;
      this.error = undefined;
    } else if (error) {
      console.log('Error block'+ JSON.stringify(error));
      this.error = error;
      this.ContactStatus = undefined;
    }
  }
  get dateValue(){
    if(this.dateval == undefined){
        this.dateval = new Date().toISOString().substring(0, 10);}
        return this.dateval;}

  // ApplicationSubStatus;
  @wire(getContactAppDataStatus, { userName: "$UserFullName" }) wiredContact({error, data}) {
    if (data) {
      console.log('ApplicationSubStatus is'+ data);
      this.ApplicationSubStatus = data;
      //getEnrollCourselist();
      this.error = undefined;
    } else if (error) {
      console.log('Error block'+ JSON.stringify(error));
      this.error = error;
      this.ApplicationSubStatus = undefined;
    }
  }
  @wire(getEnrollCourselist, { userName: "$UserFullName" }) wiredAp({error, data}) {
    if (data) {
      console.log('Application List is'+ JSON.stringify(data));
      this.courselist = data;
      this.error = undefined;
    } else if (error) {
      console.log('Error block'+ JSON.stringify(error));
      this.error = error;
      this.courselist = undefined;
    }
  }
  COLUMNS = [
    { label: 'Application Date', fieldName: 'Application_Date__c', type: 'date'},
    { label: 'Application No', fieldName: 'Name', type: 'text'},
    { label: 'Application Status', fieldName: 'Status__c', type: 'text'},
  ];

  @wire(getCourselist, { userName: "$UserFullName" }) wiredEN({error, data}) {
    if (data) {
      console.log('subjectlist is'+ JSON.stringify(data));
      this.subjectlist = data;
      this.error = undefined;
    } else if (error) {
      console.log('Error block'+ JSON.stringify(error));
      this.error = error;
      this.subjectlist = undefined;
    }
  }
  COLUMNS2 = [
    // { label: 'S. No.', type: 'number', typeAttributes: { minimumIntegerDigits: 2 } },
    { label: 'Enrollment No', fieldName: 'Name', type: 'text'},
    { label: 'Enrolled Course Name', fieldName: 'Course_Name__c', type: 'text'},
  ];
  
  // @wire( getEnrollCourselist()wiredContac({error, data}) 
  // {
  //   if (data) {
  //     console.log('ApplicationSubStatus is'+ data);
  //     this.courselist = data;
  //     //getEnrollCourselist();
  //     this.error = undefined;
  //   }
  //    else if (error) {
  //     console.log('Error block'+ JSON.stringify(error));
  //     this.error = error;
  //     this.ApplicationSubStatus = undefined;
  //   }
  // }
  get options() {
    return [
      { label: "American Literature", value: "American Literature" },
      { label: "British Literature", value: "British Literature" },
      { label: "Calculus I", value: "Calculus I" },
      { label: "Chemistry with Lab", value: "Chemistry with Lab" },
      { label: "Communications", value: "Communications" },
      { label: "Economics", value: "Economics" },
      { label: "Finance", value: "Finance" },
      { label: "Geometry", value: "Geometry" },
      { label: "Marketing", value: "Marketing" },
      { label: "Physics with Lab", value: "	Physics with Lab" },
      { label: "Political Science", value: "	Political Science" },
      { label: "Writing", value: "Writing" }
    ];
  }
  handleChange(event) {
    this.course = event.detail.value;
  }
  onNameChange(event) {
    this.name = event.detail.value;
  }
  onExpChange(event) {
    this.exp = event.detail.value;
  }
  onDOBChange(event) {
    this.DOB = event.detail.value;
  }
  onAppDateChange(event) {
    this.Application_Date__c = event.detail.value;

  }
  // onContactChange(event) {
  //   this.contact = event.target.value;
  // }
  
  onFileUpload(event) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files;
      this.fileName = event.target.files[0].name;
      this.file = this.uploadedFiles[0];
      if (this.file.size > this.MAX_FILE_SIZE) {
        // eslint-disable-next-line no-alert
        alert("File Size Cannot Exceed" + MAX_FILE_SIZE);
      }
    }
  }

  saveApplication() {
    if (!this.file) {
      console.log("File is null or not loaded");
      const event = new ShowToastEvent({
        title: 'Error',
        message: 'Please fill in all the required fields !',
        variant: 'error'
    });
    this.dispatchEvent(event);
      return;
    }
    this.fileReader = new FileReader();
    this.fileReader.onloadend = () => {
      this.fileContents = this.fileReader.result;
      let base64 = "base64,";
      this.content = this.fileContents.indexOf(base64) + base64.length;
      this.fileContents = this.fileContents.substring(this.content);
      this.saveRecord();
    };
    this.fileReader.readAsDataURL(this.file);
  }

  saveRecord() {
    var app = {
      sobjectType: "Application__c",
      Name: this.name,
      Work_experience__c: this.exp,
      Date_Of_Birth__c: this.DOB,
      Course_Enrolled__c: this.cource,
      Contact__c: this.ContactName,
      Status__c: 'Awaiting Approval'
    };

    saveApplicationRecord({
      applicationRec: app,
      file: encodeURIComponent(this.fileContents),
      fileName: this.fileName,
      courseName: this.course
    })
      .then((appId) => {
        console.log("appID---->" + JSON.stringify(appId));
        if (appId !== "No Seat is available") {
          console.log("appID" + JSON.stringify(appId));
          this.ApplicationStatus = JSON.stringify(appId);
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              variant: "success",
              message: "Application Successfully created"
            })
          );
          window.location.reload(true)
          //this.viewForm = false;

         
        } else {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error",
              variant: "Error",
              message: "No Seat is Available"
            })
          );
        }
      })
      .catch((error) => {
        console.log("error ", error);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            variant: "Error",
            message: "Application Record is not Created"
          })
        );
      });
  }
}