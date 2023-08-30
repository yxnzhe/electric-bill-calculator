import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  calculatorForm!: FormGroup;
  defaultUserCount = 2;
  finalBillAmount: any;
  currentDateTime: string = new Date().toLocaleString();
  
  constructor(
    private formBuilder: FormBuilder,
    private toastService: NgToastService
  ) { }

  @ViewChild('userGroup') userGroupRef!: ElementRef;
  
  ngOnInit(): void {
    this.calculatorForm = this.formBuilder.group({
      billAmount: [''],
      totalkWh: [''],
      fromDate: [''],
      toDate: [''],
      pricePerUnit: [''],
      commonArea: [''],
      finalBillPrice: [''],
      userForm: this.formBuilder.array([])
    });

    for (let i = 0; i < this.defaultUserCount; i++) {
      this.addUser();
    }
  }

  addUser() {
    const userForm = this.calculatorForm.get('userForm') as FormArray;
    userForm.push(this.createUserFormGroup());
    
    const userCount = userForm.length;
    if (userCount > 2) {
      this.toastService.success({detail: 'SUCCESS', summary: 'User added successfully'})
      this.userGroupRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  removeUser(index: number) {
    const userForm = this.calculatorForm.get('userForm') as FormArray;
    userForm.removeAt(index);
    this.toastService.success({detail: 'SUCCESS', summary: 'User removed successfully'})
  }

  createUserFormGroup() {
    return this.formBuilder.group({
      name: [''],
      previousReading: [''],
      currentReading: [''],
      totalUsage: [''],
      roomAmount: [''],
      totalAmount: ['']
    });
  }

  get userForm() {
    return this.calculatorForm.get('userForm') as FormArray;
  }

  onSubmit() {
    if(this.calculatorForm.invalid) {
      this.toastService.error({detail: 'ERROR', summary: 'Please fill all the fields'})
      return;
    } else {
      this.calculateBill(this.calculatorForm);
    }
  }

  calculateBill(calculatorForm: FormGroup) {
    const billAmount = calculatorForm.get('billAmount')?.value;
    const totalkWh = calculatorForm.get('totalkWh')?.value;
    
    let commonArea = totalkWh;

    const userForm = calculatorForm.get('userForm') as FormArray;
    const userCount = userForm.length;

    const pricePerUnit = billAmount / totalkWh;
    
    for (let i = 0; i < userCount; i++) {
      const user = userForm.at(i);

      const previousReading = user.get('previousReading')?.value;
      const currentReading = user.get('currentReading')?.value;
      const totalUsage = currentReading - previousReading;
      commonArea -= totalUsage; 
      const roomAmount = totalUsage * pricePerUnit;

      user.patchValue({totalUsage: Math.round(totalUsage * 100) / 100, roomAmount: Math.round(roomAmount * 100) / 100 });
    }

    commonArea = (commonArea * pricePerUnit) / userCount;
    
    let finalBillPrice = 0;
    
    for (let j = 0; j < userCount; j++) {
      const user = userForm.at(j);
      const roomAmount = user.get('roomAmount')?.value;
      const totalAmount = roomAmount + commonArea;
      
      finalBillPrice += totalAmount;
      user.patchValue({totalAmount: Math.round(totalAmount * 100) / 100});
    }
    calculatorForm.patchValue({pricePerUnit: Math.round(pricePerUnit * 100) / 100, commonArea: Math.round(commonArea * 100) / 100, finalBillPrice: Math.round(finalBillPrice * 100) / 100})
    
    this.finalBillAmount = calculatorForm.value;
  }
}
