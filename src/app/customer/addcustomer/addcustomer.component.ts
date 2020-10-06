import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { Customer } from 'src/app/shared/models/customer';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})
export class AddCustomerComponent implements OnInit {

  customer = this.customerservice.intailizecustomer();
  pagetitle: string;
  errorMessage: any;
  past: Customer;
  constructor(
    private customerservice: CustomerService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const bid = +this.route.snapshot.paramMap.get('cid');
    this.customerservice.getCustomerById(bid).subscribe({
      next: customer => {
        this.customer = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.setTitle()
    });
  }
  saveCustomer() {

    if (this.customer.cid === 0) {
      this.customerservice.createCustomer(this.customer).subscribe({
        complete: () => this.SaveComplete()
      });
    } else {
      const bid = +this.route.snapshot.paramMap.get('cid');
      this.customerservice.getCustomerById(bid).subscribe({
        next: customer => { this.past = customer; },
        error: err => this.errorMessage = err,
        complete: () => {
          this.customerservice.updateCustomer(this.customer, this.past).subscribe({
            complete: () => this.SaveComplete()
          });
        }
      });
    }
  }


  SaveComplete() {
    this.router.navigate(['/customers']);
  }
  setTitle() {
    if (this.customer.cid === 0) {
      this.pagetitle = 'Add';
    }
    else {
      this.pagetitle = 'Edit';
    }
  }
}
