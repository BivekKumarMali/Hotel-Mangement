import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddreservationComponent } from './reservation/addreservation/addreservation.component';
import { ReservationlistComponent } from './reservation/reservationlist/reservationlist.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { RoomtypeComponent } from './hotelsetup/roomtype/roomtype.component';
import { RoomsComponent } from './hotelsetup/rooms/rooms.component';
import { CustomerComponent } from './customer/customer/customer.component';
import { AddCustomerComponent } from './customer/addcustomer/addcustomer.component';
import { AdvancedCalandraComponent } from './hotelsetup/advanced-calandra/advanced-calandra.component';
import { EmployeeComponent } from './hotelsetup/employee/employee.component';
import { LoginComponent } from './login/login.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { RecordComponent } from './record/record.component';
import { ReportComponent } from './hotelsetup/report/report.component';
import { PrintComponent } from './print/print.component';
import { ExpensesComponent } from './reservation/expenses/expenses.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DashboardComponent,
    ReservationlistComponent,
    AddreservationComponent,
    RoomtypeComponent,
    RoomsComponent,
    CustomerComponent,
    AddCustomerComponent,
    AdvancedCalandraComponent,
    ReportComponent,
    EmployeeComponent,
    LoginComponent,
    RecordComponent,
    PrintComponent,
    ExpensesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    NgxPrintModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
