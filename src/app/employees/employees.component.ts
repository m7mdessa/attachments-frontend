
import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { ToastrService } from 'ngx-toastr'; 
import { FormGroup, FormControl,Validators } from '@angular/forms';   
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']

})
export class EmployeesComponent implements OnInit {
  @ViewChild('callCreateDialog') callCreateDialog! :TemplateRef<any>
  @ViewChild('callDeleteDailog') callDelete!:TemplateRef<any>
  @ViewChild('callEditDailog') callEditDailog!:TemplateRef<any>
  @ViewChild('callDetailDailog') callDetailDailog!:TemplateRef<any>


  employees: any[] = [];
  Employee: any;
  isLinear = false;

  constructor( private employeeService: EmployeeService, private toastr: ToastrService,private dialog:MatDialog) {}


  ngOnInit(): void {
    this.getEmployees();
  }

  form :FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
    phone: new FormControl('', [Validators.required]),
    employeeName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

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
    this.employeeService.getById(id).subscribe( (Employee) => {
        this.Employee = Employee;
      
      });  
    }

  getEmployees() {
    this.employeeService.getAll().subscribe((employees) => {
      this.employees = employees;
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

  addEmployee(){
    
    console.log(this.form.value);
    this.employeeService.add(this.form.value).subscribe((_res:any) => {
         console.log('Employee created successfully!');
         this.toastr.success('Employee added successfully.', 'Success');
         this.getEmployees(); 
         this.dialog.closeAll();
         this.form.reset();
          },
          (error) => {
            console.log( this.form.value);
    
            console.log('Error while add employee:', error);
              this.toastr.error('Error while add employee.', 'Error'); 
            
    
          });
          
  }


}