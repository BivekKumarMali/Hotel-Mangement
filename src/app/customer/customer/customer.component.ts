import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer';
import { CustomerService } from 'src/app/shared/service/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  Customer: Customer[];
  FilterCustomers: Customer[];
  errorMessage: any;
  constructor(private customerservice: CustomerService) { }

  ngOnInit(): void {
    this.fetchCustomer();
  }
  fetchCustomer(): void {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        this.FilterCustomers = customer;
        this.Customer = customer;
      },
      error: err => this.errorMessage = err
    });
  }
  DeleteCustomer(id: number, name: string, customer?: Customer): void {
    const cus = this.Customer.find(x => x.cid === id);
    if (confirm('Delete ' + name + ' from the list?')) {
      this.customerservice.deleteCustomer(id, cus).subscribe();
    }
    location.reload();
  }
  search(filterBy: any) {
    if (Number(filterBy)) {
      this.FilterCustomers = filterBy ? this.performFilterByMobile(filterBy) : this.Customer;
    }
    else {
      this.FilterCustomers = filterBy ? this.performFilterByName(filterBy) : this.Customer;
      if (this.FilterCustomers) {
        this.FilterCustomers = filterBy ? this.performFilterByLastName(filterBy) : this.Customer;
      }
    }
  }
  performFilterByMobile(filterBy: number): Customer[] {
    const filterB = filterBy.toLocaleString();
    return this.Customer.filter((customer: Customer) =>
      customer.mobile.toLocaleString().indexOf(filterB) !== -1);
  }
  performFilterByName(filterBy: string): Customer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.Customer.filter((customer: Customer) =>
      customer.fname.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  performFilterByLastName(filterBy: string): Customer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.Customer.filter((customer: Customer) =>
      customer.lname.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}
