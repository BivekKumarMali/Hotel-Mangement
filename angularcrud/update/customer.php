<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);

  // Sanitize.
  $cid    = mysqli_real_escape_string($con, (int)$request->cid);
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

  // Update.
  $sql = " UPDATE `customer` SET `fname` = '$fname',  `lname` = '$lname',  `bname` = '$bname',  `phone` = '$phone',  `mobile` = '$mobile', `country` = '$country',  `state` = '$state',  `zip` = '$zip',  `address` = '$address',  `email` = '$email', `car` = '$car' WHERE  `cid` = '{$cid}' LIMIT 1 ";

  if(mysqli_query($con, $sql))
  {
    http_response_code(204);
  }
  else
  {
    return http_response_code(422);
  }  
}