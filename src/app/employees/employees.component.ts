import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { ToastrService } from 'ngx-toastr'; 
import { FormGroup, FormControl,Validators } from '@angular/forms';   
import { MatDialog } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']

})
export class EmployeesComponent implements OnInit {
  [x: string]: any;
  @ViewChild('callCreateDialog') callCreateDialog! :TemplateRef<any>
  @ViewChild('callDeleteDailog') callDelete!:TemplateRef<any>
  @ViewChild('callEditDailog') callEditDailog!:TemplateRef<any>
  @ViewChild('callDetailDailog') callDetailDailog!:TemplateRef<any>
  @ViewChild('callAttachmentDailog') callAttachmentDailog!:TemplateRef<any>

  validationErrors: string = '';
  employees: any[] = [];
  attachments:any[]=[];
  attachment:any;
  employee: any;
  attachmentDataList: File[] = [];
  isLinear = false;
  urlSafe: SafeResourceUrl | undefined;
  employeeImage:  File[] = [];

  constructor( private sanitizer: DomSanitizer,private employeeService: EmployeeService, private toastr: ToastrService,private dialog:MatDialog) {}


  ngOnInit(): void {
    this.getEmployees();

  }


  getEmployees() {
    this.employeeService.getAll().subscribe((employees) => {
      this.employees = employees;
  
      this.employees.forEach((employee) => {
        const employeeId = employee.id;
  
        this.employeeService.getEmployeeAttachments(employeeId).subscribe((attachments) => {
          employee.attachments = attachments;
          console.log('attachments:', this.attachments);

        });

      });
    });
  }




  form :FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
    phone: new FormControl('', [Validators.required]),
    employeeName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  UploadAttachments(event: any): void {
    const fileList: FileList = event.target.files;
    for (let i = 0; i < fileList.length; i++) {
      this.attachmentDataList.push(fileList[i]);
    }
    
  }
  
  UploadEmployeeImage(event: any): void {
    const fileList: FileList = event.target.files;

    for (let i = 0; i < fileList.length; i++) {
      this.employeeImage.push(fileList[i]);
    }
    
  }

  add(){

    console.log(this.form.value);
    this.employeeService.add(this.attachmentDataList,this.employeeImage,this.form.value).subscribe({
      next: () => {
         console.log('Employee created successfully!');
         this.toastr.success('Employee added successfully.', 'Success');

         this.getEmployees(); 
         this.dialog.closeAll();
         this.form.reset();
          },
          error: (error) => {
            
            console.log( this.form.value);
    
            if (error.status === 500) {
              if (Array.isArray(error.error)) {
                this.validationErrors =  error.error.join(', ');
              } else if (typeof error.error === 'string') {
                this.validationErrors = error.error.substring(25, 84).trim();
              } else {
                this.validationErrors = 'An unexpected validation error occurred.';
              }
            } else {
              this.validationErrors = 'An unexpected error occurred.';
            }
          this.toastr.error('Error while add employee.', 'Error'); 
     }
    });
  }

  previewAttachment(employeeId: number, id: number) {
    this.dialog.open(this.callAttachmentDailog);
    this.employeeService.getAttachmentById(employeeId, id).subscribe((attachment) => {
      this.attachment = attachment;

      this.urlSafe = this.getSafeUrl(`/assets/Files/${this.attachment.fileName}`);
      console.log('attachments:', this.attachment);
    });
  }
  
  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  downloadAttachment(employeeId: number) {
    this.employeeService.downloadAttachment(employeeId).subscribe((attachment) => {
        this.attachment = attachment;
        console.log('attachments:', this.attachment);
    
    });
  }

  formatFileSize(fileData: Uint8Array): string {
    const bytes = fileData.length;

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  edit :FormGroup  = new FormGroup({
    id: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    departmentId: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
   
  });

  matchError() {
    if (this.form.controls['password'].value === this.form.controls['confirmPassword'].value) {
      this.form.controls['confirmPassword'].setErrors(null);
    } else {
      this.form.controls['confirmPassword'].setErrors({ misMatch: true });
    }
  }

    OpenDialogAdd(){
    
  this.dialog.open(this.callCreateDialog);
  
  }


 OpenDialogDetail(id:number){
    
    this.dialog.open(this.callDetailDailog);
    this.employeeService.getById(id).subscribe( (employee) => {
       this.employee = employee;
      
     });  
   }


      
   
  openEditDailog(employee: any){
    this.edit.setValue({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      salary: employee.salary,
      email: employee.email,
      departmentId: employee.departmentId,
      phone: employee.phone,
   

    });
    
    const dialogRef= this.dialog.open(this.callEditDailog);
    dialogRef.afterClosed().subscribe((result)=>{
       if(result!=undefined)
       {
        if (result == 'yes') {
          this.employeeService.update(this.edit.value).subscribe(
            (response) => {
              console.log( this.edit.value);
      
              console.log('Employee name updated successfully:', this.edit.value);
              this.toastr.success('Employee updated successfully.', 'Success');
              this.getEmployees(); 
      
              this.dialog.closeAll();
            
            },
            (error) => {
              console.log( this.edit.value);
      
              console.log('Error while update employee:', error);
                this.toastr.error('Error while update employee.', 'Error'); 
      
            }
          );   
        } else if (result == 'no') {
          console.log("Thank you");
        }
        
           
       }
 
    })
   }
   
  openDeleteDailog(id:number){
    console.log(id)

    const dialogRef= this.dialog.open(this.callDelete);
    dialogRef.afterClosed().subscribe((result)=>{
       if(result!=undefined)
       {
        if (result == 'yes') {
          this.employeeService.delete(id).subscribe(
            () => {
              this.employees = this.employees.filter((employee) => employee.id !== id);
              console.log('Employee deleted successfully.');
              this.toastr.success('Employee deleted successfully.', 'Success');

              this.dialog.closeAll();  
              this.getEmployees(); 
    
            },
            (error) => {
              console.log('Error while deleting Employee:', error);
            }
          );         
        } else if (result == 'no') {
          console.log("Thank you");
        }
        
           
       }
 
    })
     
 
   }
   

  

}