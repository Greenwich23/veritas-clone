// import React from "react";
import { CircleQuestionMarkIcon, ScrollIcon } from "lucide-react";

const semesters = [
  {
    session: "2023/2024",
    level: "100",
    semester: "First Semester",
    courses: [
      ["CSC101", "INTRODUCTION TO COMPUTER", 2, 70, "A", "Pass"],
      ["MTH101", "Elementary Mathematics I", 2, 70, "A", "Pass"],
      ["PHY101", "General Physics I", 2, 45, "D", "Pass"],
      ["PHY107", "GENERAL PHYSICS PRACTICALS", 1, 85, "A", "Pass"],
      ["STA111", "Descriptive Statistics", 3, 45, "D", "Pass"],
      ["GST111", "Communication in English", 2, 60, "B", "Pass"],
      ["VUA-ETH171", "Ethics", 1, 71, "A", "Pass"],
      ["VUA-CSC107", "SYSTEM ANALYSIS AND DESIGN", 2, 45, "D", "Pass"],
      ["VUA-CSC105", "INTRODUCTION TO SOFTWARE ENGINEERING", 2, 51, "C", "Pass"],
      ["VUA-CSC103", "INTRODUCTION TO INFORMATION SYSTEMS", 2, 50, "C", "Pass"],
    ],
    totals: {
      creditLoad: 20,
      creditUnit: 69,
      gpa: "3.45",
      tc: 20,
      tgp: 69,
      cgpa: "3.45",
    },
  },

  {
    session: "2023/2024",
    level: "100",
    semester: "Second Semester",
    courses: [
      ["CSC102", "Problem Solving", 2, 60, "B", "Pass"],
      ["PHY102", "General Physics II", 2, 65, "B", "Pass"],
      ["PHY108", "EXPERIMENTAL PHYSICS II", 1, 71, "A", "Pass"],
      ["VUA-CMS142", "Community Service", 2, 70, "A", "Pass"],
      ["GST112", "Communication in English II", 2, 60, "B", "Pass"],
      ["VUA-CSC104", "INTRODUCTION TO WEB DEVELOPMENT", 2, 56, "C", "Pass"],
      ["VUA-CSC112", "HUMAN COMPUTER INTERFACE", 2, 50, "C", "Pass"],
      ["VUA-CSC106", "COMPUTER PROGRAMMING I", 2, 52, "C", "Pass"],
      ["VUA-CSC110", "IMAGE PROCESSING AND COMPUTER VISION", 2, 52, "C", "Pass"],
    ],
    totals: {
      creditLoad: 20,
      creditUnit: 73,
      gpa: "3.65",
      tc: 40,
      tgp: 142,
      cgpa: "3.55",
    },
  },

  {
    session: "2024/2025",
    level: "200",
    semester: "First Semester",
    courses: [
      ["CSC201", "Data Structures", 3, 64, "B", "Pass"],
      ["MTH201", "Mathematical Methods I", 2, 45, "D", "Pass"],
      ["PHY223", "Electric Circuits and Introductory Electronics", 2, 45, "D", "Pass"],
      ["VUA-THE211", "BASIC SPIRITUAL THEOLOGY", 1, 60, "B", "Pass"],
      ["ENT211", "Entrepreneurship and Innovation", 2, 71, "A", "Pass"],
      ["CSC211", "DIGITAL LOGIC DESIGN", 2, 69, "B", "Pass"],
      ["CSC203", "Discrete Structure", 2, 74, "A", "Pass"],
    ],
    totals: {
      creditLoad: 20,
      creditUnit: 77,
      gpa: "3.85",
      tc: 60,
      tgp: 219,
      cgpa: "3.69",
    },
  },

  {
    session: "2025/2026",
    level: "300",
    semester: "First Semester",
    courses: [
      ["CSC-301", "DATA STRUCTURES", 3, 64, "B", "Pass"],
      ["CSC-315", "INTRODUCTION TO CYBERSECURITY AND STRATEGY", 2, 56, "C", "Pass"],
      ["CSC-317", "MOBILE APPLICATION DEVELOPMENT", 2, 81, "A", "Pass"],
      ["CSC309", "Game application development", 2, 70, "A", "Pass"],
      ["CSC-303", "ARTIFICIAL INTELLIGENCE", 2, 75, "A", "Pass"],
      ["VUA-CSC303", "ARTIFICIAL INTELLIGENCE TOOLS AND FRAMEWORKS", 3, 74, "A", "Pass"],
      ["CSC305", "DATA COMMUNICATION SYSTEM AND NETWORK", 3, 75, "A", "Pass"],
      ["VUA-ENT307", "Advanced Entrepreneurial Skills", 2, 70, "A", "Pass"],
    ],
    totals: {
      creditLoad: 19,
      creditUnit: 88,
      gpa: "4.63",
      tc: 97,
      tgp: 376,
      cgpa: "3.88",
    },
  },
];

function Academics() {
  return (
    <div className="m-1 pb-10">
      {/* Page title */}
      <h1 className="text-3xl text-black/40 mb-5">
        My Transcript
      </h1>

      {/* Hero */}
      <div className="bg-blue-900 text-white p-7 rounded-xl">
        <div className="flex items-center gap-3 font-bold">
          <ScrollIcon size={30} />

          <h2 className="text-2xl md:text-3xl">
            My Transcript
          </h2>
        </div>

        <p className="text-sm text-white/80 mt-2">
          View your unofficial academic transcript.
        </p>
      </div>

      {/* Help */}
      <div className="border border-black/20 rounded mt-5 p-4 bg-black/[0.02]">
        <button className="text-blue-900 flex items-center gap-1 border border-blue-900/20 p-1.5 rounded text-sm hover:bg-blue-900 hover:text-white transition">
          <CircleQuestionMarkIcon className="h-5 w-5" />
          Help
        </button>
      </div>

      {/* Transcript */}
      <div className="mt-5 border border-black/10 rounded-lg overflow-hidden bg-white shadow-sm">
        {semesters.map((semester, index) => (
          <div key={index} className="border-b border-black/10 last:border-0">

            {/* Semester Header */}
            <div className="bg-blue-950 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-sm">
                ACADEMIC SESSION: {semester.session}
              </span>

              <div className="flex gap-6 text-sm">
                <span>
                  <strong>LEVEL:</strong> {semester.level}
                </span>

                <span>
                  <strong>SEMESTER:</strong> {semester.semester}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-sm border-collapse">

                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Course Code</th>
                    <th className="px-3 py-2 text-left">Course Title</th>
                    <th className="px-3 py-2 text-center">
                      Credit Unit
                    </th>
                    <th className="px-3 py-2 text-center">
                      Score
                    </th>
                    <th className="px-3 py-2 text-center">
                      Grade
                    </th>
                    <th className="px-3 py-2 text-center">
                      Pass/Fail
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {semester.courses.map((course, courseIndex) => (
                    <tr
                      key={courseIndex}
                      className={
                        courseIndex % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }
                    >
                      <td className="px-3 py-2 border-b border-black/5">
                        {courseIndex + 1}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5 font-medium">
                        {course[0]}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5">
                        {course[1]}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5 text-center">
                        {course[2]}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5 text-center">
                        {course[3]}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5 text-center font-semibold">
                        {course[4]}
                      </td>

                      <td className="px-3 py-2 border-b border-black/5 text-center">
                        {course[5]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="text-sm">

              <div className="flex justify-between bg-gray-100 px-4 py-2">
                <span className="font-semibold">
                  Total Credit Load
                </span>

                <span>{semester.totals.creditLoad}</span>
              </div>

              <div className="flex justify-between px-4 py-2">
                <span className="font-semibold">
                  Total Credit Unit
                </span>

                <span>{semester.totals.creditUnit}</span>
              </div>

              <div className="flex justify-between bg-gray-100 px-4 py-2">
                <span className="font-semibold">
                  Grade Point Average (GPA)
                </span>

                <span>{semester.totals.gpa}</span>
              </div>

              <div className="flex justify-between px-4 py-2">
                <span className="font-semibold">
                  TC
                </span>

                <span>{semester.totals.tc}</span>
              </div>

              <div className="flex justify-between bg-gray-100 px-4 py-2">
                <span className="font-semibold">
                  TGP
                </span>

                <span>{semester.totals.tgp}</span>
              </div>

              <div className="flex justify-between px-4 py-2 font-semibold">
                <span>
                  Cumulative Grade Points Average (CGPA)
                </span>

                <span>{semester.totals.cgpa}</span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-black/40 py-8">
        Copyright © Veritas University Abuja 2026.
      </footer>
    </div>
  );
}

export default Academics;