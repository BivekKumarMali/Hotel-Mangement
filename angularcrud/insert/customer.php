<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


  // Sanitize.
  $fname = mysqli_real_escape_string($con, trim($request->fname));
  $lname = mysqli_real_escape_string($con, trim($request->lname));
  $bname = mysqli_real_escape_string($con, trim($request->bname));
  $address = mysqli_real_escape_string($con, trim($request->address));
  $state = mysqli_real_escape_string($con, trim($request->state));
  $country = mysqli_real_escape_string($con, trim($request->country));
  $zip = mysqli_real_escape_string($con, (int)$request->zip);
  $phone = mysqli_real_escape_string($con, (int)$request->phone);
  $mobile = mysqli_real_escape_string($con, (int)$request->mobile);
  $email = mysqli_real_escape_string($con, trim($request->email));
  $car = mysqli_real_escape_string($con, trim($request->car));


  // Create.
  $sql = "INSERT INTO `customer` VALUES (null, '{$fname}', '{$lname}','{$bname}', '{$address}', '{$state}', '{$country}' , '{$zip}', '{$phone}', '{$mobile}', '{$email}', '{$car}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $customer = [
      'fname' => $fname,
      'lname' => $lname,
      'bname' => $bname,
      'address' => $address,
      'state' => $state,
      'country' => $country,
      'zip' => $zip,
      'phone' => $phone,
      'mobile' => $mobile,
      'email' => $email,
      'cid'    => mysqli_insert_id($con)
    ];
    echo json_encode($customer);
  }
  else
  {
    http_response_code(422);
  }
}