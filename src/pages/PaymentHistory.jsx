/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  Loader,
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
// RECEIPT (DETAIL) VIEW WITH REAL PDF DOWNLOAD
// ---------------------------------------------------------------------------

function ReceiptView({ payment, onBack }) {
  // Everything inside this ref (the receipt card AND the important note)
  // gets captured and turned into the PDF.
  const printRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownload = async () => {
    if (!printRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      // Render the receipt DOM node to a high-resolution canvas image.
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // sharper output
        useCORS: true, // allow cross-origin images (crest / student photo)
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: printRef.current.scrollWidth,
        windowHeight: printRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 in points: 595.28 x 841.89
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Scale the captured image to fit the PDF's page width, preserving
      // aspect ratio, then paginate vertically if it's taller than one page.
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Payment_Receipt_${payment.rrr}.pdf`);
    } catch (err) {
      console.error("Could not generate PDF:", err);
      alert("Sorry, the receipt PDF could not be generated. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
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
          disabled={isGeneratingPdf}
          className="btn bg-[#1fa6a6] hover:bg-[#178888] disabled:opacity-60 flex text-white items-center p-[10px] gap-1.5 rounded-[10px]"
        >
          {isGeneratingPdf ? (
            <>
              <Loader size={15} className="animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download size={15} /> Download
            </>
          )}
        </button>
      </div>

      {/* Everything inside this wrapper is what gets rendered into the PDF */}
      <div ref={printRef}>
        <div className="bg-white border border-slate-200 rounded-lg w-full">
          <div className="px-6 py-4 font-semibold text-base text-[#2b3342] border-b border-slate-200">
            Payment Receipt
          </div>

          <div className="px-6 md:px-8 pt-7 pb-3">
            <div className="flex justify-between items-center gap-4 flex-wrap mb-1.5">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://admission.veritas.edu.ng/ui/dist/img/veritasin.png"
                  alt="Veritas University crest"
                  crossOrigin="anonymous"
                  className="w-[250px] h-[100px] object-contain"
                />
              </div>
              <img
                src={STUDENT.photo}
                alt="student"
                crossOrigin="anonymous"
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

        <div className="mt-6 mb-8 bg-[#eef6fb] border border-[#d6e9f5] rounded-lg px-5 py-4.5">
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
    </div>
  );
}

// ============================================================
// FUNCTION TO GET PAYMENT FROM LOCALSTORAGE
// ============================================================

function getPaymentFromLocalStorage() {
  try {
    const paymentStatus = localStorage.getItem("veritas_payment_status");
    const isPaid = paymentStatus === "success";
    if (!isPaid) return null;

    const hostelSelection = localStorage.getItem("veritas_hostel_selection");
    const hostelData = hostelSelection ? JSON.parse(hostelSelection) : null;

    const studentData = localStorage.getItem("student");
    const student = studentData ? JSON.parse(studentData) : STUDENT;

    // The ACTUAL verified numbers saved by the payment page right after
    // Paystack confirmed the transaction (amount, reference, paidAt, plan).
    // Falls back to sensible defaults only if that record is missing.
    const lastPaymentRaw = localStorage.getItem("veritas_last_payment");
    const lastPayment = lastPaymentRaw ? JSON.parse(lastPaymentRaw) : null;

    const legacyRef = localStorage.getItem("veritas_payment_reference");

    const tuitionFee = lastPayment?.tuitionFee ?? 2217850;
    const accommodationFee =
      hostelData?.fee ?? lastPayment?.hostelFee ?? 395000;
    const totalDue = tuitionFee + accommodationFee;
    const amountPaid = lastPayment?.amount ?? totalDue;
    const balance = Math.max(totalDue - amountPaid, 0);
    const category = lastPayment?.plan ? `${lastPayment.plan}%` : "100%";

    // A STABLE id/reference — derived from the real Paystack reference so
    // repeat mounts don't keep generating a "new" payment every time.
    const rrr =
      lastPayment?.reference ||
      legacyRef ||
      `PSK_${student?.regNo || "9682"}`;

    const date = lastPayment?.paidAt
      ? new Date(lastPayment.paidAt).toISOString().replace("T", " ").slice(0, 19)
      : new Date().toISOString().replace("T", " ").slice(0, 19);

    return {
      id: rrr,
      matric: student?.regNo || STUDENT.matric,
      session: "2026/2027",
      description: "Tuition and Accommodation Fee",
      amount: amountPaid,
      rrr,
      status: "Successful",
      date,
      category,
      tuitionFee,
      accommodationFee,
      totalDue,
      vat: 0,
      amountPaid,
      balance,
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

  useEffect(() => {
    let allPayments = [...MOCK_PAYMENTS];

    const newPayment = getPaymentFromLocalStorage();

    if (newPayment) {
      const exists = allPayments.some((p) => p.rrr === newPayment.rrr);
      if (!exists) {
        allPayments = [newPayment, ...allPayments];
      }
    }

    setPayments(allPayments);
  }, []);

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

  const handleDeletePayment = (id) => {
    const paymentToDelete = payments.find((p) => p.id === id);

    if (
      window.confirm(
        `Are you sure you want to delete this payment?\nRRR: ${paymentToDelete?.rrr}`,
      )
    ) {
      setPayments((prev) => prev.filter((p) => p.id !== id));

      const lastPaymentRaw = localStorage.getItem("veritas_last_payment");
      const lastPayment = lastPaymentRaw ? JSON.parse(lastPaymentRaw) : null;

      if (paymentToDelete && lastPayment?.reference === paymentToDelete.rrr) {
        localStorage.removeItem("veritas_payment_status");
        localStorage.removeItem("veritas_payment_reference");
        localStorage.removeItem("veritas_last_payment");
        console.log("🗑️ Payment removed from localStorage");
      }

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
