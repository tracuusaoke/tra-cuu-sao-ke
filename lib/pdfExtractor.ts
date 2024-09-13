// import fs from "fs";

// import { TicketX } from "lucide-react";
// import { unparse } from "papaparse";
// import pdfParse from "pdf-parse-new";
// import { z, ZodSchema } from "zod";

// interface ColumnZodValidatorType {
//   columnName: string;
//   validator: ZodSchema<any>;
// }
// // const COLUMNS_NAME = [
// //   "TNX Date, Doc No",
// //   "Debit",
// //   "Credit",
// //   "Balance",
// //   "Transactions in detail",
// // ];

// const vndCurrencyRegex = /^[1-9](\d{0,2}(\.\d{3})*)$/; // https://regex101.com/r/niOAfP/1
// const dataSegmentValidators = {
//   // 01/09/2024
//   TNXDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
//   //5218.81295
//   DocNo: z.string().regex(/^\d{4}\.\d{1,5}$/),
//   // Credit and Debit: 100.000
//   Credit: z.string().regex(vndCurrencyRegex, {
//     message: "Invalid VND currency format. Expected format: 100.000.000",
//   }),
// };

// // "do khac phuc hau qua sau bao", "08/09/2024",
// // "5213.660", "6.000", "706764.080924.172713.QUANG VAN QUYET",
// // "chuyen tien tu Viettel Money", "Page 17 of 12028",
// // "Telex : (0805) 411504 VCB - VT", "Swift : BFTV VNVX",
// // "Website: www.vietcombank.com.vn", "Contact center: 1900.54.54.13",
// // "Postal address:", "198 TRAN QUANG KHAI AVENUE",
// // "HANOI - S.R. VIETNAM"
// // ], [ "Ngày GD/" ], [
// // "TNX Date", "Số CT/ Doc No", "Số tiền ghi nợ/",
// // "Debit", "Số tiền ghi có/", "Credit", "Số dư/",
// // "Balance", "Nội dung chi tiết/", "Transactions in detail",
// // "08/09/2024", "5161.19593", "500.000", "PARTNER.DIRECT_DEBITS_VCB.MSE.6635",
// // "6036291.20240908.66356036291-0982077748_D",
// // "ANG NHA NGUYEN UNG HO KHAC PHUC", "HAU QUA BAO S3 YAGI",
// // "08/09/2024", "5243.25518", "200.000", "MBVCB.6977080089.NGUYEN THI THANH",
// // "BINH chuyen tien.CT tu 0011004397323", "NGUYEN THI THANH BINH toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "08/09/2024", "5218.7085", "500.000", "957940.080924.172846.TRUONG THI NGOC",
// // "TRAM UNG HO KHAC PHUC BAO YAGI", "08/09/2024",
// // "5212.10394", "20.000", "719500.080924.172947.DAO THUY HONG",
// // "chuyen tien", "08/09/2024", "5220.11499", "10.000",
// // "391814.080924.173016.Phan Thanh Huyen",
// // "ung ho khac phuc hau qua bao so 3 yaki",
// // "08/09/2024", "5240.26380", "500.000", "MBVCB.6977103129.NGUYEN THI NGOC",
// // "TRINH chuyen tien.CT tu 1018435117", "NGUYEN THI NGOC TRINH toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "08/09/2024", "5387.53288", "250.000", "020097042209081731412024DF4M121530.5328",
// // "8.173124.ung ho khac phuc hau qua bao so 3",
// // "yagi", "08/09/2024", "5213.17665", "1.000.000",
// // "290184.080924.173207.TAM MY UNG HO", "KHAC PHUC SAU BAO",
// // "08/09/2024", "5244.26843", "100.000", "MBVCB.6977128092.CHU THI TRANG UNG",
// // "HO KHAC PHUC HAU QUA BAO SO 3", "YAGI.CT tu 1034319714 CHU THI TRANG toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "08/09/2024", "5215.19991", "30.000", "735484.080924.173249.NGUYEN THI THANH",
// // "HANG chuyen tien", "08/09/2024", "5189.56694",
// // "100.000", "0200970422090817325320247OAS214189.5669",
// // "4.173254.THAN THUY HANG chuyen tien", "08/09/2024",
// // "5017.24736", "100.000", "987347.080924.173347.DINH DUC HIEU ung",
// // "ho mien bac", "08/09/2024", "5213.26804", "100.000",
// // "743770.080924.173432.Ung ho cuu tro bao so",
// // "3", "08/09/2024", "5161.21371", "200.000", "PARTNER.DIRECT_DEBITS_VCB.MSE.6635",
// // "5707730.20240908.66355707730-0905567477_U",
// // "ng ho khac phuc hau qua bao so 3 Yagi",
// // "08/09/2024", "5245.27415", "200.000", "MBVCB.6977146475.NGUYEN THI THANH",
// // "NHAN chuyen tien.CT tu 0281000570913", "NGUYEN THI THANH NHAN toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "Page 18 of 12028", "Telex : (0805) 411504 VCB - VT",
// // "Swift : BFTV VNVX", "Website: www.vietcombank.com.vn",
// // "Contact center: 1900.54.54.13", "Postal address:",
// // "198 TRAN QUANG KHAI AVENUE", "HANOI - S.R. VIETNAM"
// // ], [ "Ngày GD/" ], [
// // "TNX Date", "Số CT/ Doc No", "Số tiền ghi nợ/",
// // "Debit", "Số tiền ghi có/", "Credit", "Số dư/",
// // "Balance", "Nội dung chi tiết/", "Transactions in detail",
// // "08/09/2024", "5078.45890", "2.000.000", "MBVCB.6977140896.UNG HO KHAC PHUC",
// // "HAU QUA BAO SO 3 YAGI.CT tu", "0011004316887 NGUYEN TIEN HUY toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "08/09/2024", "5241.27567", "100.000", "MBVCB.6977149227.Khac phuc hau qua bao",
// // "YAGI.CT tu 1032547516 TO PHUONG", "NHUNG toi 0011001932418 MAT TRAN TO",
// // "QUOC VN - BAN CUU TRO TW", "08/09/2024", "5213.30557",
// // "11.000", "748803.080924.173529.Ung ho Khac phuc hau",
// // "qua bao so 3 yagi", "08/09/2024", "5389.63465",
// // "200.000", "020097042209081735332024X356603744.63465.",
// // "173526.Nguyen Nhat Uyen Nhi ung ho khac",
// // "phuc hau qua bao yagi", "08/09/2024", "5389.64830",
// // "1.000.000", "0200970405090817355420249Q5U096609.64830",
// // ".173554.Vietcombank:0011001932418:SocNan",
// // "Ung ho khac phuc bao Yagi", "08/09/2024",
// // "5213.37225", "300.000", "599863.080924.173727.LA THI BICH Ung ho",
// // "khac phuc hau qua bao so 3 YAGI", "FT24253358374509",
// // "08/09/2024", "5243.28514", "2.000.000", "MBVCB.6977173434.NGUYEN SY TAI UNG",
// // "HO KHAC PHUC HAU QUA BAO SO 3", "YAGI.CT tu 0101001209099 NGUYEN SY TAI",
// // "toi 0011001932418 MAT TRAN TO QUOC", "VN - BAN CUU TRO TW",
// // "08/09/2024", "5217.45112", "30.000", "769461.080924.173932.Tran Thi Phuong Thuy",
// // "chuyen tien tu Viettel Money", "08/09/2024",
// // "5387.75319", "50.000", "020097042209081739372024IWRG234224.7531",
// // "9.173938.NGUYEN THI NGOC ANH chuyen", "tien cuu tro sau bao so 3",
// // "08/09/2024", "5218.44810", "200.000", "439701.080924.173958.Tran thi kim dung ung",
// // "ho khac phuc hau qua bao so 3 Yagi", "08/09/2024",
// // "5388.75786", "2.000.000", "020097042209081739582024FQHE408928.7578",
// // "6.173958.Gia dinh NGUYEN VU THU HUONG",
// // "chuyen tien UNG HO KHAC PHUC CON", "BAO SO 3 YAGI",
// // "08/09/2024", "5209.47846", "200.000", "462977.080924.174037.NGUYEN DIEU HOA",
// // "chuyen tien den MAT TRAN TO QUOC VN -",
// // "BAN CUU TRO TW - 0011001932418", "08/09/2024",
// // "5215.48824", "1.000.000", "614858.080924.174058.BUI THI THUY LINH",
// // "ung ho khac phuc hau qua bao so 3 Yagi",
// // "FT24253148031082", "08/09/2024", "5390.78896",
// // "1.000.000", "020097040509081741232024YIVF012920.78896.",
// // "174123.Vietcombank:0011001932418:HOANG",
// // "THI KIM QUYEN chuyen tien ung khac phuc",
// // "hau qua bao so 3 YAGI", "08/09/2024", "5189.81781",
// // "80.000", "020097042209081742272024JLVJ887526.81781.",
// // "174228.1 TAM LONG NHO GOP SUC UNG", "HO KHAC PHUC HAU QUA BAO SO 3",
// // "GAGI", "Page 19 of 12028", "Telex : (0805) 411504 VCB - VT",
// // "Swift : BFTV VNVX", "Website: www.vietcombank.com.vn",
// // "Contact center: 1900.54.54.13", "Postal address:",
// // "198 TRAN QUANG KHAI AVENUE", "HANOI - S.R. VIETNAM"
// // ], [ "Ngày GD/" ], [
// // "TNX Date", "Số CT/ Doc No", "Số tiền ghi nợ/",
// // "Debit", "Số tiền ghi có/", "Credit", "Số dư/",
// // "Balance", "Nội dung chi tiết/", "Transactions in detail",
// // "08/09/2024", "5078.48214", "100.000", "MBVCB.6977220214.ung ho ba con chiu thien",
// // "tai bao so 3.CT tu 9967739493 toi", "0011001932418 Uy Ban Trung uong Mat tran",
// // "To quoc Viet Nam", "08/09/2024", "5243.29601",
// // "100.000", "MBVCB.6977212395.Kevin Minh Tam Ung",
// // "Ho Khac Phuc Hau Qua Bao Yagi .CT tu", "9933751199 LE MINH TAM toi",
// // "0011001932418 MAT TRAN TO QUOC VN -", "BAN CUU TRO TW",
// // "08/09/2024", "5215.63291", "200.000", "631917.080924.174502.THUY DUONG UNG",
// // "HO KHAC PHUC HAU QUA BAO SO 3", "YAGI FT24253008893746",
// // "08/09/2024", "5387.89648", "200.000", "020097042209081745232024Q5JA896450.89648",
// // ".174524.LUONGHUONGGIANG UNG HO", "KHAC PHUC HAU QUA BAO SO 3 YAGI",
// // "08/09/2024", "5243.30417", "10.000", "MBVCB.6977247171.NGUYEN DUONG",
// // "THIEN AN chuyen tien ung ho khac phuc",
// // "bao yagi.CT tu 1031717560 NGUYEN DUONG",
// // "THIEN AN toi 0011001932418 MAT TRAN", "TO QUOC VN - BAN CUU TRO TW",
// // "08/09/2024", "5387.92784", "100.000", "020097042209081746162024YASS951714.9278",
// // "4.174617.xin duoc gop tien ung ho bao yagi",
// // "08/09/2024", "5213.68733", "200.000", "336905.080924.174632.IBFT UNG HO KHAC",
// // "PHUC HAU QUA BAO YAGI", "08/09/2024", "5209.70169",
// // "300.000", "639380.080924.174649.HUYNH THI NHU",
// // "UYEN chuyen cuu bao Yagi", "FT24253626695206",

// const COLUMNS = [
//   "TNX Date, Doc No",
//   "Debit",
//   "Credit",
//   "Balance",
//   "Transactions in detail",
// ];

// const ROWValidator = z.object({
//   TXNDate: dataSegmentValidators.TNXDate,
//   DocNo: dataSegmentValidators.DocNo,
//   Debit: dataSegmentValidators.Credit,
//   Credit: dataSegmentValidators.Credit,
//   Balance: dataSegmentValidators.Credit,
//   Transactions: z.string(),
// });

// type RowType = z.infer<typeof ROWValidator>;

// // const refineTableData = (splittedData: Array<Array<string>>) => {
// //   // flatten the array into array of strings
// //   const flattenData = splittedData.flat();

// //   for(let i = 0; i < flattenData.length; ++i){

// //   }
// // };

// // [
// //   "SAO KÊ TÀI KHOẢN", "Tên tài khoản/Account name:",
// //   "Số tài khoản/Account number:", "Từ/ From: 01/09/2024 Đến/ To: 10/09/2024",
// //   "CIF:", "ACCOUNT STATEMENT", "Ngày thực hiện/ Date: 11/09/2024",
// //   "Chi nhánh thực hiện/ Branch:", "0002040837",
// //   "0011001932418", "MAT TRAN TO QUOC VN - BAN CUU TRO TW",
// //   "Loại tiền/Currency: VND", "SỞ GIAO DỊCH",
// //   "Địa chỉ/ Address: 46 TRANG THI, HANOI"
// // ],

// const AccountStatementDetails = {
//   "Account name": "MAT TRAN TO QUOC VN - BAN CUU TRO TW",
//   "Account number": "0011001932418",
//   CIF: "0002040837",
//   Currency: "VND",
//   From: "01/09/2024",
//   To: "10/09/2024",
//   Address: "46 TRANG THI, HANOI",
//   Branch: "SỞ GIAO DỊCH",
//   Date: "11/09/2024",
// };

// export async function parsePdfToCsv(inputPdfFile: string) {
//   // get file name without extension and path
//   const fileName = inputPdfFile.split("/").pop()?.split(".")[0];
//   const folderPath = inputPdfFile.split("/").slice(0, -1).join("/");
//   const outputCSVFile = `${folderPath}/${fileName}.csv`;
//   const outputJsonFile = `${folderPath}/${fileName}.json`;

//   const dataBuffer = fs.readFileSync(inputPdfFile);

//   try {
//     const pdfData = await pdfParse(dataBuffer);

//     // Extract text from PDF
//     const rawText = pdfData.text;

//     // Split the raw text into rows (one page is treated as one string)
//     const rows = rawText.split(/\n/).filter((line) => line.trim() !== "");

//     const pos = rows.findIndex((row) => row.includes("9915.10293"));
//     console.log(rows.slice(pos - 10, pos + 10));
//     // Prepare CSV data by splitting rows based on patterns
//     const csvData: Array<Array<string>> = [];
//     let currentRow: Array<string> = [];

//     rows.forEach((row) => {
//       if (row.includes("Ngày GD") || row.includes("TNX Date")) {
//         // Commit the previous row if exists
//         if (currentRow.length) {
//           csvData.push(currentRow);
//           currentRow = [];
//         }
//       }
//       // Add row data, splitting the columns based on the table format
//       currentRow.push(row.trim());
//     });

//     // Add the last row if necessary
//     if (currentRow.length) {
//       csvData.push(currentRow);
//     }

//     const tokenRows = csvData
//       .slice(1)
//       .filter((page) => page.length > 1)
//       // merge pages
//       .map((page) => {
//         const filteredPage = page.slice(
//           10,
//           page.length - 8,
//         ); /* ignore the first 10 column names & last 8 strings of footer info*/
//         // split the page into rows
//         const rows: Array<Array<string>> = [];
//         let prev = 0;
//         for (let i = 0; i < filteredPage.length; ++i) {
//           if (prev >= i) continue;
//           const parseTXNDateResult = dataSegmentValidators.TNXDate.safeParse(
//             filteredPage[i],
//           );
//           const parseDocNoResult = dataSegmentValidators.DocNo.safeParse(
//             filteredPage[i + 1],
//           );
//           if (parseTXNDateResult.success && parseDocNoResult.success) {
//             const newRawRow = filteredPage.slice(prev, i);
//             rows.push(newRawRow);
//             prev = i;
//             // TODO: parse row
//           }
//         }
//         const lastRawRow = filteredPage.slice(prev);
//         rows.push(lastRawRow);
//         return rows;
//       })
//       .reduce((acc, val) => acc.concat(val), []); // flatten the array

//     // group token Rows by day
//     const rowsByDay = tokenRows.reduce(
//       (acc: Array<Array<Array<string>>>, val: Array<string>) => {
//         if (acc.length <= 0 || acc[acc.length - 1][0][0] !== val[0]) {
//           acc.push([val]);
//         } else {
//           acc[acc.length - 1].push(val);
//         }

//         return acc;
//       },
//       [],
//     );
//     // .map((day) => {
//     //   // 07/09/2024
//     //   // 9915.10293 => Debit
//     //   day.map((tokenRow, i) => {
//     //     // count number of valid VND-amount tokens
//     //     let countValidVNDAmountToken = 0;

//     //     return ROWValidator.parse({
//     //       TXNDate: tokenRow[0],
//     //       DocNo: tokenRow[1],
//     //       Debit: tokenRow[2],
//     //       Credit: tokenRow[3],
//     //       Balance: tokenRow[4],
//     //       Transactions: tokenRow[5],
//     //     });
//     //   });
//     // });
//     // console.log("resuotl");
//     // console.log(tokenRows);
//     // // Convert the array to CSV
//     const csvFile = unparse(csvData);

//     // Save the CSV to file
//     fs.writeFileSync(outputCSVFile, csvFile);
//     console.log("CSV file created successfully!");

//     // store as json file too
//     const jsonFile = JSON.stringify(csvData);
//     fs.writeFileSync(outputJsonFile, jsonFile);
//     console.log("JSON file created successfully!");
//   } catch (err) {
//     console.error("Error parsing PDF:", err);
//   }
// }

// // read pdf file path and output csv file path from command line arguments
// (async () => {
//   const inputPdfFile = process.argv[2];
//   parsePdfToCsv(inputPdfFile);
// })();
