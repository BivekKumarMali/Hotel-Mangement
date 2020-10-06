<?php
/**
 * Returns the list of customer.
 */
require '../database.php';

$customer = [];
$sql = "SELECT * FROM customer";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $customer[$i]['cid']    = $row['cid'];
    $customer[$i]['fname'] = $row['fname'];
    $customer[$i]['lname'] = $row['lname'];
    $customer[$i]['bname'] = $row['bname'];
    $customer[$i]['address']    = $row['address'];
    $customer[$i]['country']    = $row['country'];
    $customer[$i]['state']    = $row['state'];
    $customer[$i]['zip']    = $row['zip'];
    $customer[$i]['phone'] = $row['phone'];
    $customer[$i]['mobile'] = $row['mobile'];
    $customer[$i]['email'] = $row['email'];
    $customer[$i]['car'] = $row['car'];
    $i++;
  }

  echo json_encode($customer);
}
else
{
  http_response_code(404);
}