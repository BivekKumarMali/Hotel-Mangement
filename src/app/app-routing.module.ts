import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReservationlistComponent } from './reservation/reservationlist/reservationlist.component';
import { RoomtypeComponent } from './hotelsetup/roomtype/roomtype.component';
import { RoomsComponent } from './hotelsetup/rooms/rooms.component';
import { CustomerComponent } from './customer/customer/customer.component';
import { AddCustomerComponent } from './customer/addcustomer/addcustomer.component';
import { AddreservationComponent } from './reservation/addreservation/addreservation.component';
import { AdvancedCalandraComponent } from './hotelsetup/advanced-calandra/advanced-calandra.component';
import { ReportComponent } from './hotelsetup/report/report.component';
import { EmployeeComponent } from './hotelsetup/employee/employee.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { OwnerGuard } from './auth/owner.guard';
import { RecordComponent } from './record/record.component';
import { PrintComponent } from './print/print.component';
import { ExpensesComponent } from './reservation/expenses/expenses.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'roomtypes', component: RoomtypeComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'customers/:cid/edit', component: AddCustomerComponent, canActivate: [AuthGuard] },
  { path: 'reservations', component: ReservationlistComponent, canActivate: [AuthGuard] },
  { path: 'reservations/:bid/edit', component: AddreservationComponent, canActivate: [AuthGuard] },
  { path: 'reservations/:bid/expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  { path: 'invoice', component: PrintComponent, canActivate: [AuthGuard] },
  { path: 'advanced-calendra', component: AdvancedCalandraComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate: [OwnerGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [OwnerGuard] },
  { path: 'record', component: RecordComponent, canActivate: [OwnerGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
