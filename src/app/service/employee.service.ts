import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private apiUrl = 'https://localhost:7191/api/Employees';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAttachmentGroup(attachmentGroupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAttachmentGroup/${attachmentGroupId}`);
  }

  getEmployeeAttachments(attachmentGroupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EmployeeAttachments/${attachmentGroupId}`);
  }

  downloadAttachment(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/DownloadAttachment/${employeeId}`);
  }


  add(attachmentDataList: File[],employeeImage: File[], employeeData: any): Observable<any> {
    const formData: FormData = new FormData();
    
    Object.keys(employeeData).forEach((key) => {
      formData.append(key, employeeData[key]);
    });

   for (const file of attachmentDataList) {
    formData.append('attachmentDataList', file, file.name);
 
    }

    for (const file of employeeImage) {
      formData.append('employeeImage', file, file.name);
   
      }
  
    
    return this.http.post(this.apiUrl, formData);
  }



}
