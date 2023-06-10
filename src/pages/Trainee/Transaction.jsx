import React, { useEffect, useState } from "react";

export default function Transaction() {
  return (
    <div>
      <h1 className="m-0 p-0 mb-2">Billing History</h1>
      <div className="transaction-trainee m-5">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Amount (VNĐ)</th>
              <th>Status</th>
              <th>Refund</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
