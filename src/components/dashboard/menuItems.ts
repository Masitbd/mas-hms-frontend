import { ENUM_USER_PEMISSION } from "@/constants/permissionList";

export const userMenuItem = [
  {
    key: "1",
    title: "Users",
    href: "/users",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_USER,
      ENUM_USER_PEMISSION.MANAGE_USER,
    ],
  },
  {
    key: "2",
    title: "Profile",
    href: "/profile",
    requiredPermission: [ENUM_USER_PEMISSION.USER],
  },
  {
    key: "3",
    title: "Permissions",
    href: "/permission",
    requiredPermission: [
      ENUM_USER_PEMISSION.MANAGE_PERMISSIONS,
      ENUM_USER_PEMISSION.GET_PERMISSIONS,
    ],
  },
];

export const financialReportItem = [
  {
    key: "1",
    title: "Overall Commission",
    href: "/financialReport/commission",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "2",
    title: "Doctor's Performance",
    href: "/financialReport/commission/single",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "3",
    title: "Income Statement- Test Wise",
    href: "/financialReport/incomeStatement/testWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "4",
    title: "Income Statement- Department Wise",
    href: "/financialReport/incomeStatement/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "5",
    title: "Collection Summery- Department Wise",
    href: "/financialReport/collectionSummery/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },

  {
    key: "6",
    title: "Doctor Performance - Test Wise",
    href: "/financialReport/doctorsPerformance/testWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "6",
    title: "Doctor Performance - Department Wise",
    href: "/financialReport/doctorsPerformance/departmentWise",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "17",
    title: "Income Statement",
    href: "/income-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "18",
    title: " Employee Income Statement",
    href: "/employee-income-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "19",
    title: "Employee Income Statement Summery",
    href: "/emp-income-summery",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "20",
    title: "Due Bills Details",
    href: "/due-bills",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "21",
    title: "Clientwise Inocme Statement",
    href: "/client-statement",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "22",
    title: "Employee Ledger Summery",
    href: "/employee-ledger",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "23",
    title: "Income By Refd Doctor",
    href: "/ref-doctor-income",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "24",
    title: "Doctors",
    href: "/financialReport/doctors",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "25",
    title: "Tests",
    href: "/financialReport/tests",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
  {
    key: "26",
    title: "Employee Performance",
    href: "/financialReport/employee-performance",
    requiredPermission: [
      ENUM_USER_PEMISSION.SUPER_ADMIN,
      ENUM_USER_PEMISSION.GET_FINANCIAL_REPORT,
    ],
  },
];

export const generalMenuItems = [
  {
    key: "1",
    title: "Doctor's Information",
    href: "/doctor",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_DOCTORS,
      ENUM_USER_PEMISSION.MANAGE_DOCTORS,
    ],
  },
  {
    key: "2",
    title: "Employee Information",
    href: "/employee",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_EMPLOYEE,
      ENUM_USER_PEMISSION.MANAGE_EMPLOYEE,
    ],
  },
  {
    key: "3",
    title: "Company Information",
    href: "/companyInfo",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_COMPANY_INFO,
      ENUM_USER_PEMISSION.MANAGE_COMPANY_INFO,
      ,
    ],
  },
  {
    key: "4",
    title: "Patient Information",
    href: "/patient",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_PATIENT,
      ENUM_USER_PEMISSION.MANAGE_PATIENT,
    ],
  },
  {
    key: "5",
    title: "Hospital Group",
    href: "/hospitalGroup",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_HOSPITAL_GROUP,
      ENUM_USER_PEMISSION.MANAGE_HOSPITAL_GROUP,
    ],
  },

  {
    key: "7",
    title: "Invoice Margin",
    href: "/margin",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_INVOICE_MARGIN,
      ENUM_USER_PEMISSION.MANAGE_INVOICE_MARGIN,
    ],
  },
];

export const labReportMenuItems = [
  {
    key: "1",
    title: "Report Type",
    href: "/reportType",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_REPORT_TYPE,
      ENUM_USER_PEMISSION.MANAGE_REPORT_TYPE,
    ],
  },
  {
    key: "2",
    title: "Report Group",
    href: "/reportGroup",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_REPORT_GROUP,
      ENUM_USER_PEMISSION.MANAGE_REPORT_GROUP,
    ],
  },
  {
    key: "3",
    title: "Bactrological Information",
    href: "/bactrologicalInfo",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_BATCROLOGICAL_INFORMATION,
      ENUM_USER_PEMISSION.MANAGE_BATCROLOGICAL_INFORMATION,
    ],
  },
  {
    key: "4",
    title: "Comment",
    href: "/comment",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_COMMENT,
      ENUM_USER_PEMISSION.MANAGE_COMMENT,
    ],
  },
  {
    key: "5",
    title: "Doctor Seal",
    href: "/doctorSeal",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_DOCTORS_SEAL,
      ENUM_USER_PEMISSION.MANAGE_DOCTORS_SEAL,
    ],
  },
  {
    key: "6",
    title: "Test Reports",
    href: "/testReport",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_LAB_REPORTS,
      ENUM_USER_PEMISSION.MANAGE_LAB_REPORTS,
    ],
  },

  {
    key: "7",
    title: "Label Print",
    href: "/label-print",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.GET_ORDER,
    ],
  },
];

export const investigationMenuItems = [
  {
    key: "1",
    title: "Test Information",
    href: "/test",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "2",
    title: "Order Information",
    href: "/order",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_ORDER,
      ENUM_USER_PEMISSION.MANAGE_ORDER,
    ],
  },
  {
    key: "3",
    title: "Department Information",
    href: "/department",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_DEPARTMENT,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "4",
    title: "Specimen",
    href: "/specimen",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
  {
    key: "5",
    title: "Vacuum Tube",
    href: "/vacuumTube",
    requiredPermission: [
      ENUM_USER_PEMISSION.GET_TESTS,
      ENUM_USER_PEMISSION.MANAGE_TESTS,
    ],
  },
];
