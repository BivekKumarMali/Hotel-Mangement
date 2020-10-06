<?php
/**
 * Returns the list of employee.
 */
require '../database.php';

$employee = [];
$sql = "SELECT * FROM employee";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $employee[$i]['eid']    = $row['eid'];
    $employee[$i]['name'] = $row['name'];
    $employee[$i]['role'] = $row['role'];
    $employee[$i]['mobile'] = $row['mobile'];
    $employee[$i]['mail']    = $row['mail'];
    $employee[$i]['password']    = $row['password'];
    $employee[$i]['status']    = $row['status'];
    $employee[$i]['joining']    = $row['joining'];
    $employee[$i]['remarks'] = $row['remarks'];
    $employee[$i]['paid'] = $row['paid'];
    $i++;
  }

  echo json_encode($employee);
}
else
{
  http_response_code(404);
}