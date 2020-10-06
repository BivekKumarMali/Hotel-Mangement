<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


  // Sanitize.
  $cid = mysqli_real_escape_string($con, (int)$request->cid);
  $rid = mysqli_real_escape_string($con, (int)$request->rid);
  $due = mysqli_real_escape_string($con, (int)$request->due);
  $deposit = mysqli_real_escape_string($con, (int)($request->deposit));
  $payment = mysqli_real_escape_string($con, trim($request->payment));
  $deposit1 = mysqli_real_escape_string($con, (int)($request->deposit1));
  $payment1 = mysqli_real_escape_string($con, trim($request->payment1));
  $checkin = mysqli_real_escape_string($con, date($request->checkin));
  $checkout = mysqli_real_escape_string($con, date($request->checkout));
  $status = mysqli_real_escape_string($con, trim($request->status));
  $comment = mysqli_real_escape_string($con, trim($request->comment));
  $extra = mysqli_real_escape_string($con, trim($request->extra));


  // Create.
  $sql = "INSERT INTO `reservation` VALUES (null, '{$cid}', '{$rid}', '{$checkin}', '{$checkout}', '{$deposit}', '{$payment}', '{$due}', '{$status}', '{$comment}', '{$deposit1}', '{$payment1}','{$extra}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $reservation = [
      'checkin' => $checkin,
      'checkout' => $checkout,
      'deposit' => $deposit,
      'payment' => $payment,
      'deposit1' => $deposit1,
      'payment1' => $payment1,
      'due' => $due,
      'cid' => $cid,
      'rid' => $rid,
      'status' => $status,
      'comment' => $comment,
      'extra' => $extra,
      'bid'    => mysqli_insert_id($con)
    ];
    echo json_encode($reservation);
  }
  else
  {
    http_response_code(422);
  }
}