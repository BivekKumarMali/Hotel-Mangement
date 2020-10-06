<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


  // Sanitize.  
  $eid    = mysqli_real_escape_string($con, (int)$request->eid);
  $name = mysqli_real_escape_string($con, trim($request->name));
  $role = mysqli_real_escape_string($con, trim($request->role));
  $mobile = mysqli_real_escape_string($con, (int)$request->mobile);
  $mail = mysqli_real_escape_string($con, trim($request->mail));
  $password = mysqli_real_escape_string($con, trim($request->password));
  $status = mysqli_real_escape_string($con, trim($request->status));
  $joining = mysqli_real_escape_string($con, date($request->joining));
  $remarks = mysqli_real_escape_string($con, trim($request->remarks));
  $paid = mysqli_real_escape_string($con, trim($request->paid));



  // Create.
  $sql = "INSERT INTO `employee` VALUES (null, '{$name}', '{$role}','{$mobile}', '{$mail}', '{$password}', '{$status}' , '{$joining}', '{$remarks}', '{$paid}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $employee = [ 
      'name' => $name,
      'role' => $role,
      'mobile' => $mobile,
      'mail' => $mail,
      'password' => $password,
      'status' => $status,
      'joining' => $joining,
      'remarks' => $remarks,
      'paid' => $paid,
      'eid'    => mysqli_insert_id($con)
    ];
    echo json_encode($employee);
  }
  else
  {
    http_response_code(422);
  }
}