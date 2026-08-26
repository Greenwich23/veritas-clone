/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Crosshair,
  CreditCard,
  Home,
  HelpCircle,
  LogOut,
  Menu,
  ChevronLeft,
  FileText,
  GraduationCap,
  BookOpen,
  Printer,
  Download,
  Info,
  Banknote,
  FileSpreadsheet,
  List,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const naira = (n) =>
  "₦" +
  n.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const isPositiveStatus = (s) => /paid|successful/i.test(s);

// ---------------------------------------------------------------------------
// MOCK DATA (Historical payments)
// ---------------------------------------------------------------------------

const MOCK_PAYMENTS = [
  {
    id: 1,
    matric: "VUG/CSC/23/9682",
    session: "2025/2026",
    description: "Tuition and Accommodation Fee",
    amount: 1019500.0,
    rrr: "261472944485",
    status: "Successfully paid",
    date: "2026-06-04 04:10:53",
    category: "50%",
    tuitionFee: 1917850.0,
    accommodationFee: 395000.0,
    totalDue: 2312850.0,
    vat: 0,
    amountPaid: 1019500.0,
    balance: 1293350.0,
    hostel: "HOSTEL T, Third Floor,",
    room: "Room 18",
    position: "Bunk 2, Position Up",
    method: "Paystack",
  },
  {
    id: 2,
    matric: "VUG/CSC/23/9682",
    session: "2025/2026",
    description: "Tuition and Accommodation Fee",
    amount: 509750.0,
    rrr: "131429261434",
    status: "Successful",
    date: "2026-02-10 13:37:01",
    category: "25%",
    tuitionFee: 1917850.0,
    accommodationFee: 395000.0,
    totalDue: 2312850.0,
    vat: 0,
    amountPaid: 509750.0,
    balance: 1803100.0,
    hostel: "HOSTEL T, Third Floor,",
    room: "Room 18",
    position: "Bunk 2, Position Up",
    method: "Remita",
  },
  {
    id: 3,
    matric: "VUG/CSC/23/9682",
    session: "2025/2026",
    description: "Tuition and Accommodation Fee",
    amount: 509750.0,
    rrr: "301321139518",
    status: "Successful",
    date: "2025-09-06 09:22:14",
    category: "25%",
    tuitionFee: 1917850.0,
    accommodationFee: 395000.0,
    totalDue: 2312850.0,
    vat: 0,
    amountPaid: 509750.0,
    balance: 2312850.0,
    hostel: "HOSTEL T, Third Floor,",
    room: "Room 18",
    position: "Bunk 2, Position Up",
    method: "Remita",
  },
];

// ---------------------------------------------------------------------------
// STUDENT DATA
// ---------------------------------------------------------------------------

const STUDENT = {
  name: "Panan Peter Ezekiel",
  matric: "vug/csc/23/9680",
  email: "vug/csc/23/9682@nas.veritas.edu.ng",
  phone: "09135279895",
  level: "300",
  programme: "Computer and Information Technology",
  gender: "Male",
  photo: "https://i.ibb.co/WNDMjRX0/download.jpg",
};

// ---------------------------------------------------------------------------
// LIST VIEW WITH DELETE
// ---------------------------------------------------------------------------

function PaymentListView({ payments, onView, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
        <h1 className="text-2xl md:text-[26px] font-medium text-[#2b3342]">
          Payment History
        </h1>
        <div className="text-sm text-slate-500">
          <a href="#" className="text-[#2f7dc0] no-underline">
            Dashboard
          </a>{" "}
          / Payment History
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg text-white p-6 mb-5 bg-gradient-to-br from-[#1c3f66] to-[#2c5f8f]">
        <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full bg-white/5" />
        <div className="absolute right-8 top-5 w-[110px] h-[110px] rounded-full bg-white/5" />
        <h2 className="relative z-10 flex items-center gap-2.5 text-xl font-semibold mb-2">
          <FileText size={20} />
          Payment history
        </h2>
        <p className="relative z-10 max-w-xl text-sm leading-relaxed text-[#dce7f2]">
          Review past tuition, other fees, acceptance, and application payments.
          Start a new payment, or open RRR / Paystack history from the actions
          below.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <button className="btn bg-[#5a6472] hover:bg-[#48505c]">
          <HelpCircle size={15} /> Help
        </button>
        <button className="btn bg-[#2f7dc0] hover:bg-[#2569a8]">
          <Banknote size={15} /> Pay Tuition Fee
        </button>
        <button className="btn bg-[#2f7dc0] hover:bg-[#2569a8]">
          <FileSpreadsheet size={15} /> Pay Other Fees
        </button>
        <button className="btn bg-[#2f7dc0] hover:bg-[#2569a8]">
          <List size={15} /> RRR History
        </button>
        <button className="btn bg-[#2f7dc0] hover:bg-[#2569a8]">
          <ArrowLeftRight size={15} /> Paystack History
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 text-base font-semibold text-[#2b3342] border-b border-slate-200">
          <GraduationCap size={18} className="text-[#2f7dc0]" />
          Tuition Fee Payment History
          {/* <span className="text-sm font-normal text-slate-500 ml-2">
            ({payments.length} payments)
          </span> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#1c3f66] text-white text-left">
                {[
                  "#",
                  "Matric No.",
                  "Session",
                  "Description",
                  "Amount",
                  "RRR",
                  "Status",
                  "Payment Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 font-semibold whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3.5">{idx + 1}</td>
                  <td className="px-4 py-3.5">{p.matric}</td>
                  <td className="px-4 py-3.5">{p.session}</td>
                  <td className="px-4 py-3.5">{p.description}</td>
                  <td className="px-4 py-3.5">{naira(p.amount)}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {p.rrr}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3.5 ${
                      isPositiveStatus(p.status)
                        ? "text-[#1f8a3d] font-medium"
                        : "text-[#2b3342]"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        title="View Receipt"
                        onClick={() => onView(p.id)}
                        className="text-[#2f7dc0] hover:text-[#1c3f66] bg-transparent border-none cursor-pointer p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <BookOpen size={16} />
                      </button>
                      <button
                        title="Delete Payment"
                        onClick={() => onDelete(p.id)}
                        className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;}`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RECEIPT (DETAIL) VIEW
// ---------------------------------------------------------------------------

function InfoRow({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <tr>
      <td className="w-[16%] bg-slate-50 font-bold text-[#1c3f66] border border-slate-200 px-3.5 py-3 text-[14.5px]">
        {leftLabel}
      </td>
      <td className="w-[34%] border border-slate-200 px-3.5 py-3 text-[14.5px] text-[#333c47]">
        {leftValue}
      </td>
      <td className="w-[16%] bg-slate-50 font-bold text-[#1c3f66] border border-slate-200 px-3.5 py-3 text-[14.5px]">
        {rightLabel}
      </td>
      <td className="w-[34%] border border-slate-200 px-3.5 py-3 text-[14.5px] text-[#333c47]">
        {rightValue}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// RECEIPT (DETAIL) VIEW WITH DOWNLOAD
// ---------------------------------------------------------------------------

function ReceiptView({ payment, onBack }) {
  const receiptRef = useRef(null);

  const handleDownload = () => {
    // Build the receipt HTML content
    const receiptHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - ${payment.rrr}</title>
        <style>
          /* Base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: white;
            padding: 40px 30px;
            color: #2b3342;
          }
          .receipt-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
          }
          .receipt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1c3f66;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .receipt-header-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .receipt-header-left img {
            height: 60px;
            width: auto;
            object-fit: contain;
          }
          .receipt-header-left h1 {
            font-size: 20px;
            color: #1c3f66;
            font-weight: 700;
          }
          .receipt-header-left h2 {
            font-size: 16px;
            color: #1c5c3e;
            font-weight: 600;
          }
          .student-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #e2e8f0;
          }
          .receipt-title {
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            color: #1c3f66;
            margin-bottom: 20px;
            padding: 10px;
            background: #f0f4f9;
            border-radius: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          table td {
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
            font-size: 13px;
          }
          .label-cell {
            background: #f8fafc;
            font-weight: 600;
            color: #1c3f66;
            width: 16%;
          }
          .value-cell {
            width: 34%;
            color: #333c47;
          }
          .section-title {
            background: #eaf1fb;
            text-align: center;
            font-weight: 700;
            color: #1c3f66;
            font-size: 14px;
            padding: 12px;
          }
          .status-paid {
            color: #1f8a3d;
            font-weight: 600;
          }
          .status-pending {
            color: #d69e2e;
            font-weight: 600;
          }
          .important-note {
            margin-top: 25px;
            padding: 18px 20px;
            background: #eef6fb;
            border: 1px solid #d6e9f5;
            border-radius: 8px;
          }
          .important-note h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 700;
            color: #2b3342;
            margin-bottom: 8px;
          }
          .important-note p, .important-note li {
            font-size: 13px;
            color: #333c47;
            line-height: 1.6;
          }
          .important-note ul {
            padding-left: 20px;
            margin: 8px 0;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          .receipt-id {
            font-size: 11px;
            color: #94a3b8;
            text-align: right;
            margin-top: 5px;
          }
          .badge {
            display: inline-block;
            padding: 2px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-success {
            background: #d4edda;
            color: #155724;
          }
          .badge-warning {
            background: #fff3cd;
            color: #856404;
          }
          .hostel-details {
            background: #f0f7ff;
            border-radius: 6px;
            padding: 10px 14px;
            margin-top: 5px;
          }
          .hostel-details span {
            font-weight: 600;
            color: #1c3f66;
          }
          .no-print { display: none !important; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Header -->
          <div class="receipt-header">
            <div class="receipt-header-left">
              <img src="https://admission.veritas.edu.ng/ui/dist/img/veritasin.png" alt="Veritas University" />
              <div>
                <h1>Veritas University</h1>
                <h2>Payment Receipt</h2>
              </div>
            </div>
            <img src="${STUDENT.photo}" alt="Student" class="student-photo" />
          </div>

          <div class="receipt-title">OFFICIAL PAYMENT RECEIPT</div>

          <!-- Student Info -->
          <table>
            <tbody>
              <tr>
                <td class="label-cell">Name</td>
                <td class="value-cell">${STUDENT.name}</td>
                <td class="label-cell">Matric No</td>
                <td class="value-cell">${STUDENT.matric}</td>
              </tr>
              <tr>
                <td class="label-cell">Email</td>
                <td class="value-cell">${STUDENT.email}</td>
                <td class="label-cell">Phone No</td>
                <td class="value-cell">${STUDENT.phone}</td>
              </tr>
              <tr>
                <td class="label-cell">Level</td>
                <td class="value-cell">${STUDENT.level}</td>
                <td class="label-cell">Programme</td>
                <td class="value-cell">${STUDENT.programme}</td>
              </tr>
              <tr>
                <td class="label-cell">Session</td>
                <td class="value-cell">${payment.session}</td>
                <td class="label-cell">Gender</td>
                <td class="value-cell">${STUDENT.gender}</td>
              </tr>
              <tr>
                <td colspan="4" class="section-title">Tuition Fee Payment Details</td>
              </tr>
              <tr>
                <td class="label-cell">Payment Description</td>
                <td class="value-cell">${payment.description}</td>
                <td class="label-cell">Payment Category</td>
                <td class="value-cell">${payment.category}</td>
              </tr>
              <tr>
                <td class="label-cell">Tuition Fee</td>
                <td class="value-cell">${naira(payment.tuitionFee)}</td>
                <td class="label-cell">Accommodation Fee</td>
                <td class="value-cell">${naira(payment.accommodationFee)}</td>
              </tr>
              <tr>
                <td class="label-cell">Total Amount Due</td>
                <td class="value-cell"><strong>${naira(payment.totalDue)}</strong></td>
                <td class="label-cell">Reference No</td>
                <td class="value-cell" style="font-size:11px;word-break:break-all;">${payment.rrr}</td>
              </tr>
              <tr>
                <td class="label-cell">VAT (0%)</td>
                <td class="value-cell">${naira(payment.vat)}</td>
                <td class="label-cell"></td>
                <td class="value-cell"></td>
              </tr>
              <tr>
                <td class="label-cell">Amount Paid</td>
                <td class="value-cell"><strong style="color:#1f8a3d;">${naira(payment.amountPaid)}</strong></td>
                <td class="label-cell">Payment Date</td>
                <td class="value-cell">${payment.date}</td>
              </tr>
              <tr>
                <td class="label-cell">Balance</td>
                <td class="value-cell"><strong style="color:#d69e2e;">${naira(payment.balance)}</strong></td>
                <td class="label-cell">Payment Status</td>
                <td class="value-cell">
                  <span class="badge ${isPositiveStatus(payment.status) ? "badge-success" : "badge-warning"}">
                    ${payment.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="label-cell">Hostel</td>
                <td class="value-cell">
                  <div class="hostel-details">
                    <span>${payment.hostel}</span>
                  </div>
                </td>
                <td class="label-cell">Room</td>
                <td class="value-cell">${payment.room}</td>
              </tr>
              <tr>
                <td class="label-cell">Position</td>
                <td class="value-cell">${payment.position}</td>
                <td class="label-cell">Payment Method</td>
                <td class="value-cell">${payment.method}</td>
              </tr>
            </tbody>
          </table>

          <!-- Important Note -->
          <div class="important-note">
            <h4>📋 Important Note</h4>
            <p>
              After payment of <strong>all the required fees</strong>, kindly print
              two copies of your <strong>Clearance Form</strong> and{" "}
              <strong>Credit Form</strong> from your dashboard.
            </p>
            <ul>
              <li>
                The <strong>Credit Form</strong> should be submitted at{" "}
                <strong>Debt Recovery Office</strong> in Block A.
              </li>
              <li>
                The <strong>Clearance Form</strong> should be submitted at{" "}
                <strong>Bursary Unit</strong> in Senate Building upon resumption.
              </li>
            </ul>
            <p style="color:#d69e2e;font-size:12px;margin-top:5px;">
              ⚠️ Failure to submit these documents may delay your clearance.
            </p>
          </div>

          <div class="footer">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <div class="receipt-id">Receipt ID: ${payment.rrr}</div>
          </div>
        </div>
      </body>
    </html>
  `;

    // Create a blob with the HTML content
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payment_Receipt_${payment.rrr}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div>
      <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
        <h1 className="text-2xl md:text-[26px] font-medium text-[#2b3342]">
          View Tuition Fee
        </h1>
        <div className="text-sm text-slate-500">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="text-[#2f7dc0] no-underline"
          >
            Dashboard
          </a>{" "}
          / Tuition Receipt
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg text-white p-6 mb-5 bg-gradient-to-br from-[#1c3f66] to-[#2c5f8f]">
        <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full bg-white/5" />
        <div className="absolute right-8 top-5 w-[110px] h-[110px] rounded-full bg-white/5" />
        <h2 className="relative z-10 flex items-center gap-2.5 text-xl font-semibold mb-2">
          <FileText size={20} />
          Tuition Payment Receipt
        </h2>
        <p className="relative z-10 max-w-xl text-sm leading-relaxed text-[#dce7f2]">
          Your confirmed tuition payment details. Print a copy for clearance if
          required.
        </p>
      </div>

      <div className="flex gap-2.5 mb-5 no-print">
        <button
          onClick={() => window.print()}
          className="btn bg-[#5a6472] hover:bg-[#48505c] flex text-white items-center p-[10px] gap-1.5 rounded-[10px]"
        >
          <Printer size={15} /> Print
        </button>
        <button
          onClick={handleDownload}
          className="btn bg-[#1fa6a6] hover:bg-[#178888] flex text-white items-center p-[10px] gap-1.5 rounded-[10px]"
        >
          <Download size={15} /> Download
        </button>
      </div>

      <div
        className="bg-white border border-slate-200 rounded-lg w-full"
        ref={receiptRef}
      >
        <div className="px-6 py-4 font-semibold text-base text-[#2b3342] border-b border-slate-200">
          Payment Receipt
        </div>

        <div className="px-6 md:px-8 pt-7 pb-3">
          <div className="flex justify-between items-center gap-4 flex-wrap mb-1.5">
            <div className="flex items-center gap-3.5">
              <img
                src="https://admission.veritas.edu.ng/ui/dist/img/veritasin.png"
                alt="Veritas University crest"
                className="w-[250px] h-[100px] object-contain"
              />
            </div>
            <img
              src={STUDENT.photo}
              alt="student"
              className="w-40 h-40 rounded-full object-cover border-2 border-slate-100 bg-slate-200"
            />
          </div>

          <table className="w-full border-collapse mt-3.5">
            <tbody>
              <InfoRow
                leftLabel="Name"
                leftValue={STUDENT.name}
                rightLabel="Matric No"
                rightValue={STUDENT.matric}
              />
              <InfoRow
                leftLabel="Email"
                leftValue={STUDENT.email}
                rightLabel="Phone No"
                rightValue={STUDENT.phone}
              />
              <InfoRow
                leftLabel="Level"
                leftValue={STUDENT.level}
                rightLabel="Programme"
                rightValue={STUDENT.programme}
              />
              <InfoRow
                leftLabel="Session"
                leftValue={payment.session}
                rightLabel="Gender"
                rightValue={STUDENT.gender}
              />

              <tr>
                <td
                  colSpan={4}
                  className="bg-[#eaf1fb] text-center font-bold text-[#1c3f66] text-[15px] border border-slate-200 py-3"
                >
                  Tuition Fee Payment Details
                </td>
              </tr>

              <InfoRow
                leftLabel="Payment Description"
                leftValue={payment.description}
                rightLabel="Payment Category"
                rightValue={payment.category}
              />
              <InfoRow
                leftLabel="Tuition Fee"
                leftValue={naira(payment.tuitionFee)}
                rightLabel="Accommodation Fee"
                rightValue={naira(payment.accommodationFee)}
              />
              <InfoRow
                leftLabel="Total Amount Due"
                leftValue={naira(payment.totalDue)}
                rightLabel="Reference No"
                rightValue={payment.rrr}
              />
              <InfoRow
                leftLabel="VAT (0%)"
                leftValue={naira(payment.vat)}
                rightLabel=""
                rightValue=""
              />
              <InfoRow
                leftLabel="Amount Paid"
                leftValue={naira(payment.amountPaid)}
                rightLabel="Payment Date"
                rightValue={payment.date}
              />
              <InfoRow
                leftLabel="Balance"
                leftValue={naira(payment.balance)}
                rightLabel="Payment Status"
                rightValue={payment.status}
              />
              <InfoRow
                leftLabel="Hostel"
                leftValue={payment.hostel}
                rightLabel="Room"
                rightValue={payment.room}
              />
              <InfoRow
                leftLabel="Position"
                leftValue={payment.position}
                rightLabel="Payment Method"
                rightValue={payment.method}
              />
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 mb-8 bg-[#eef6fb] border border-[#d6e9f5] rounded-lg px-5 py-4.5 no-print">
        <div className="flex items-center gap-2.5 font-bold text-base text-[#2b3342] mb-2.5">
          <Info size={18} />
          Important Note
        </div>
        <p className="text-[14.5px] text-[#333c47] m-0">
          After payment of <strong>all the required fees</strong>, kindly print
          two copies of your <strong>Clearance Form</strong> and{" "}
          <strong>Credit Form</strong> from your dashboard.
        </p>
        <ul className="text-[14.5px] text-[#333c47] leading-7 pl-5 my-2">
          <li>
            The <strong>Credit Form</strong> should be submitted at{" "}
            <strong>Debt Recovery Office</strong> in Block A.
          </li>
          <li>
            The <strong>Clearance Form</strong> should be submitted at{" "}
            <strong>Bursary Unit</strong> in Senate Building upon resumption.
          </li>
        </ul>
        <div className="flex items-center gap-2 text-[13.5px] text-slate-500 mt-1.5">
          <Info size={14} />
          Failure to submit these documents may delay your clearance.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FUNCTION TO GET PAYMENT FROM LOCALSTORAGE
// ============================================================

function getPaymentFromLocalStorage() {
  try {
    // Get hostel selection
    const hostelSelection = localStorage.getItem("veritas_hostel_selection");
    const hostelData = hostelSelection ? JSON.parse(hostelSelection) : null;

    // Get payment status
    const paymentStatus = localStorage.getItem("veritas_payment_status");
    const isPaid = paymentStatus === "success";

    // Get payment reference
    const paymentRef = localStorage.getItem("veritas_payment_reference");

    // Get student from localStorage
    const studentData = localStorage.getItem("student");
    const student = studentData ? JSON.parse(studentData) : STUDENT;

    // If not paid, return null
    if (!isPaid) return null;

    // Build payment object from localStorage
    const tuitionFee = 2217850; // Constant
    const accommodationFee = hostelData?.fee || 395000;
    const totalDue = tuitionFee + accommodationFee;
    const planPercentage = 100; // Default to 100% since we're using localStorage
    const amountPaid = totalDue; // Full payment since we're using 100%
    const balance = 0;

    return {
      id: Date.now(), // Unique ID based on timestamp
      matric: student?.regNo || STUDENT.matric,
      session: "2026/2027",
      description: "Tuition and Accommodation Fee",
      amount: amountPaid,
      rrr: paymentRef || `PSK_${Date.now()}_${student?.regNo || "9682"}`,
      status: "Successful",
      date: new Date().toISOString().replace("T", " ").slice(0, 19),
      category: "100%",
      tuitionFee: tuitionFee,
      accommodationFee: accommodationFee,
      totalDue: totalDue,
      vat: 0,
      amountPaid: amountPaid,
      balance: balance,
      hostel: hostelData?.hostelName
        ? `${hostelData.hostelName}, ${hostelData.category || ""}`
        : "HOSTEL T, Third Floor,",
      room: hostelData?.room ? `Room ${hostelData.room}` : "Room 18",
      position: hostelData?.position
        ? `Bunk ${hostelData.bunk || 2}, Position ${hostelData.position || "Up"}`
        : "Bunk 2, Position Up",
      method: "Paystack",
    };
  } catch (error) {
    console.error("Error getting payment from localStorage:", error);
    return null;
  }
}

// ============================================================
// ROOT COMPONENT WITH DELETE
// ============================================================

export default function PaymentHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [payments, setPayments] = useState([]);

  // Load payments on mount
  useEffect(() => {
    // Start with mock payments
    let allPayments = [...MOCK_PAYMENTS];

    // Check if there's a new payment in localStorage
    const newPayment = getPaymentFromLocalStorage();

    if (newPayment) {
      // Check if this payment already exists (avoid duplicates)
      const exists = allPayments.some((p) => p.rrr === newPayment.rrr);
      if (!exists) {
        // Add new payment to the beginning (most recent first)
        allPayments = [newPayment, ...allPayments];
      }
    }

    setPayments(allPayments);
  }, []);

  // Listen for payment status changes (when user completes payment)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "veritas_payment_status" ||
        e.key === "veritas_payment_reference"
      ) {
        const newPayment = getPaymentFromLocalStorage();
        if (newPayment) {
          setPayments((prev) => {
            const exists = prev.some((p) => p.rrr === newPayment.rrr);
            if (!exists) {
              return [newPayment, ...prev];
            }
            return prev;
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ DELETE PAYMENT FUNCTION
  const handleDeletePayment = (id) => {
    // Find the payment to delete
    const paymentToDelete = payments.find((p) => p.id === id);

    // Show confirmation dialog
    if (
      window.confirm(
        `Are you sure you want to delete this payment?\nRRR: ${paymentToDelete?.rrr}`,
      )
    ) {
      // Remove from state
      setPayments((prev) => prev.filter((p) => p.id !== id));

      // If the deleted payment was from localStorage, also remove from localStorage
      if (
        paymentToDelete &&
        localStorage.getItem("veritas_payment_reference") ===
          paymentToDelete.rrr
      ) {
        localStorage.removeItem("veritas_payment_status");
        localStorage.removeItem("veritas_payment_reference");
        localStorage.removeItem("veritas_payment_status");
        console.log("🗑️ Payment removed from localStorage");
      }

      // If the active payment is the one being deleted, close the receipt view
      if (activeId === id) {
        setActiveId(null);
      }

      console.log("🗑️ Payment deleted successfully");
    }
  };

  const activePayment = payments.find((p) => p.id === activeId) || null;

  return (
    <div className="min-h-screen flex bg-[#f3f5f8]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-7 pb-12 overflow-y-auto">
          {activePayment ? (
            <ReceiptView
              payment={activePayment}
              onBack={() => setActiveId(null)}
            />
          ) : (
            <PaymentListView
              payments={payments}
              onView={(id) => setActiveId(id)}
              onDelete={handleDeletePayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
