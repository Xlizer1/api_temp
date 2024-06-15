// exceljs package
const puppeteer = require("puppeteer");
var log4js = require("../config/logger");
const { getDateTime, getTimeDuration } = require("../helper/common");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { LogoBase64 } = require("./pdfTamplate/logoBase64");

const htmlTemplate = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    /* Add your custom styles here */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      padding: 10px;
    }
    .footer {
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 10px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        /* table-layout: fixed; */
        margin-top: 0px;
        /*direction:rtl*/
      }
    

      th, td {
        border: 1px solid black;padding: 8px;
      }
      td{
        white-space: pre-wrap; 
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-all;
      }

      
      th {
        background-color: #1e6a99a0;
        
      }
      .page-break {
        page-break-before: always;
      }

         
  </style>
</head>
<body>
  
  <div class="content">
    <!-- Add your table data here -->
  </div>
  
</body>
</html>
`;

const folderPath = __dirname + "/../../dist/uploads/temp/pdf_reports/";

async function createTransactionPDFReport(
  data,
  file_name,
  report_type,
  language,
  fromToDate
) {
  try {
    // console.log('data2==>',data)

    const chunkSize = 100; // Adjust the chunk size as needed
    const dataChunks = data;

    const pdfFiles = [];
    for (let i = 0; i < dataChunks?.length; i++) {
      let name =
        dataChunks[i] && dataChunks[i]?.length > 0
          ? folderPath + dataChunks[i][0]?.name
          : folderPath + file_name + "_" + i;
      const pdf_file_path = name + ".pdf";
      pdfFiles.push(pdf_file_path);
      await generatePDF(
        dataChunks[i],
        pdf_file_path,
        data?.length,
        i + 1,
        dataChunks?.length,
        report_type,
        language,
        fromToDate
      );
    }

    const zip_file_path = folderPath + file_name + ".zip";

    // Create the zip file
    await createZipFile(pdfFiles, zip_file_path);
    pdfFiles.forEach((pdfFile) => {
      deleteFile(pdfFile)//after added this file to the archive file we will remove it .
    });
    // console.log("All done");
    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

async function generatePDF(
  dataChunk,
  filename,
  totalCount,
  chunkNumber,
  totalChunks,
  report_type,
  language,
  fromToDate
) {
  var listOfData = [];

  var tableContent = `<tbody>`;
  let countHours = 0,
    countMinutes = 0;
  for (let i = 0; i < dataChunk?.length; i++) {
    const row = dataChunk[i];
    var string = JSON.stringify(row);
    var json = JSON.parse(string);
    var rowValues = [];
    if (report_type == 1) {
      const { hours, minutes } = getTimeDuration(
        row.from_day_date,
        row.from_day_date ? getDateTime(row.from_day_date, "H:M") : "",
        row.to_day_date ? getDateTime(row.to_day_date, "H:M") : ""
      );
      countHours += hours;
      countMinutes += minutes;

      rowValues = {
        day_date: row.from_day_date
          ? getDateTime(row.from_day_date, "Y-m-d")
          : "",
        name: row.name ? row.name : "",
        reason: row.reason ? row.reason : "",
        supervisor_comment: row.supervisor_comment
          ? row.supervisor_comment
          : "",
        number_of_hours: hours ? hours : 0,
        number_of_minutes: minutes ? minutes : 0,
      };
    }

    tableContent += `<tr>`;
    let testAlign = language == 1 ? "text-align:left;font-size:12px" : "text-align:right;font-size:12px";
    Object.keys(rowValues).forEach((element) => {
      if (element == "number_of_hours" || element == "number_of_minutes")
        tableContent += `<td class="long-text" style="text-align:center;font-size:12px">${rowValues[element]}</td>`;
      else
        tableContent += `<td class="long-text" style="${testAlign}">${rowValues[element]}</td>`;
    });
    tableContent += `</tr>`;
    if (report_type == 1 && i + 1 == dataChunk?.length) {
      const hours = Math.floor(countMinutes / 60);
      const remainingMinutes = countMinutes % 60;
      countHours += hours;
      countMinutes = remainingMinutes;
      rowValues = {
        day_date: "المجموع",
        name: "",
        reason: "",
        supervisor_comment: "",
        number_of_hours: countHours,
        number_of_minutes: countMinutes,
      };

      tableContent += `<tr>`;
      Object.keys(rowValues).forEach((element) => {
        if (element == "number_of_hours" || element == "number_of_minutes")
          tableContent += `<td class="long-text" style="text-align:center;font-size:12px">${rowValues[element]}</td>`;
        else
          tableContent += `<td class="long-text" style="${testAlign}">${rowValues[element]}</td>`;
      });
      tableContent += `</tr>`;
    }
    listOfData.push(rowValues);
  }

  tableContent += `</tbody>`;
  let title = "";
  if (report_type == 1) {
    if (language == 1) {
      title = "Internal Support Team Overtime Report";
      var HeaderNames = [
        "Day Date",
        "User Name",
        "Reason",
        "Supervidsor Comment",
        "N.Hours",
        "N.Minutes",
      ];
    } else {
      title = "تقرير الوقت الاضافي لكادر الدعم الداخلي";
      var HeaderNames = [
        "تاريخ اليوم",
        "اسم المستخدم",
        "السبب",
        "ملاحظات المسؤول",
        "عدد الساعات",
        "عدد الدقائق",
      ];
    }
  }

  var templateHeader = `<table style="border-collapse: collapse;width: 100%;direction:${
    language == 1 ? "ltr" : "rtl"
  }"> <thead style="width:100%"><tr>`;
  if (HeaderNames && HeaderNames.length > 0) {
    // HeaderNames.forEach(function(head){
    if (report_type == 1) {
      if (language == 1) {
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:100px;font-size:12px">${HeaderNames[0]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:120px;font-size:12px">${HeaderNames[1]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:300px;font-size:12px">${HeaderNames[2]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:210px;font-size:12px">${HeaderNames[3]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:5px;font-size:12px">${HeaderNames[4]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: left;overflow: hidden;width:5px;font-size:12px">${HeaderNames[5]}</th>`;
      } else {
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:100px;font-size:12px">${HeaderNames[0]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:120px;font-size:12px">${HeaderNames[1]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:300px;font-size:12px">${HeaderNames[2]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:210px;font-size:12px">${HeaderNames[3]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:55px;font-size:12px">${HeaderNames[4]}</th>`;
        templateHeader += `<th  style="background-color:#1e6a99a0;color:#fff; border: 1px solid black;padding: 3px 8px;text-align: right;overflow: hidden;width:55px;font-size:12px">${HeaderNames[5]}</th>`;
      }
    }
  }
  // })
  templateHeader += `</tr></thead>${tableContent}</table>`;
  var signature = "";
  if (language == 1) {
    signature = `<div
    style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:50px"
  >
  <div
    style="width:100%;display:flex;justify-content:center;align-items:center"
  >
   <span style="font-family:Cairo;font-size:12px">Employee Signature</span>
  </div>
  <div
    style="width:100%;display:flex;justify-content:center;align-items:center"
  >
    <span style="font-family:Cairo;font-size:12px">Manager Signature</span>
  </div>
  </div>

`;
  } else {
    signature = `<div
      style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:50px"
    >
    <div
      style="width:100%;display:flex;justify-content:center;align-items:center"
    >
     <span style="font-family:Cairo;font-size:12px">توقيع المدير</span>
    </div>
    <div
      style="width:100%;display:flex;justify-content:center;align-items:center"
    >
     <span style="font-family:Cairo;font-size:12px">توقيع الموظف</span>
    </div>
    </div>
  
  `;
  }
  templateHeader += signature;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: "new", // Opt into the new headless mode
  });
  const page = await browser.newPage();

  // Load the HTML template
  await page.setContent(htmlTemplate);
  await page.addStyleTag({
    content: `
      .long-text {
        white-space: normal;
        word-wrap: break-word;
      }
    `,
  });
  // Replace the <!-- Add your table data here --> placeholder with your table data
  await page.$eval(
    ".content",
    (element, data) => {
      element.innerHTML = data;
    },
    // '<h1>hi</h1>'
    templateHeader
  );

  const footerTemplate = `<div style="margin: 90px auto;margin-top:160px;margin-bottom:30px; width: 100%; font-size: 7pt; text-align: center;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>`;

  let chunksInfo = "";
  if (totalChunks > 1) {
    if (language == 1) {
      chunksInfo = `
        <span style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">Total Number For Each Part: ${listOfData?.length}</span>
        <span style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px"> Part Number  ${chunkNumber}  from ${totalChunks} part</span>
    `;
    } else
      chunksInfo = `
        <span style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">العدد الكلي للجزء: ${listOfData?.length}</span>
        <span style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">الجزء رقم  ${chunkNumber} من اصل ${totalChunks} جزء</span>
    `;
  }
  let fromToDateSection = "";
  if (fromToDate?.length > 1) {
    fromToDateSection = `<h3 style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">${fromToDate}</h3>`;
  }
  var headerTemplate;
  if (language == 1) {
    headerTemplate = `<div style="display: flex;justify-content:space-between; width: 100%; margin: 0 0.6cm  ">        
        <div style="display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start; ">
        <h3 style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">${title}</h3>
        <span style="font-size:12pt;text-align: right;direction:rtl;color:grey;font-size:12px">${fromToDateSection}</span>
        <span style="font-size:12pt;text-align: right;direction:rtl;font-size:12px">Report Date : ${getDateTime(
          new Date(),
          "Y-m-d"
        )}</span>
        </div>
        <img style="height: 50px;" src="${LogoBase64}" />

    </div>`;
  } else {
    headerTemplate = `<div style="display: flex;justify-content:space-between; width: 100%; margin: 0 0.6cm">
       
    <img style="height: 50px;" src="${LogoBase64}" />
        
        <div style="display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end; width:100%">
        <h3 style="font-size:12pt;margin:0;text-align: right;direction:rtl;font-size:12px">${title}</h3>
        <span style="font-size:12pt;text-align: right;direction:rtl;color:grey;font-size:12px">${fromToDateSection}</span>
        <span style="font-size:12pt;text-align: right;direction:rtl;font-size:12px">تاريخ التقرير : ${getDateTime(
          new Date(),
          "Y-m-d"
        )}</span>
        </div>
    </div>`;
  }
  // Set the PDF options for landscape mode and remove margins
  const pdfOptions = {
    path: filename,
    format: "A4",
    printBackground: true,
    landscape: true,
    margin: {
      top: "100px",
      bottom: "80px",
      right: "20px",
      left: "20px",
    },
    timeout: 0,
    displayHeaderFooter: true,
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    // this is needed to prevent content from being placed over the footer
  };

  try {
    await page.pdf(pdfOptions);
    // console.log("PDF exported successfully.");
  } catch (e) {
    console.log("Error generating PDF:", e);
  } finally {
    await browser.close();
  }
}

async function createZipFile(pdfFiles, zipFilename) {
  return new Promise(async (resolve, reject) => {
    const output = fs.createWriteStream(zipFilename);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Set compression level
    });

    output.on("close", () => {
      // console.log(`${zipFilename} created successfully.`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    pdfFiles.forEach((pdfFile) => {
      archive.file(pdfFile, { name: path.basename(pdfFile) });
    });

    archive.finalize();
  });
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function clearAllPdf() {
  // Read the contents of the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading folder: ${folderPath}`);
      return;
    }

    // Filter for PDF files (assuming they have a .pdf extension)
    const pdfFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".pdf"
    );

    // Delete each PDF file
    pdfFiles.forEach((pdfFile) => {
      const filePath = path.join(folderPath, pdfFile);
      deleteFile(filePath);
    });
  });
}
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    // Delete the file
    try {
      fs.unlinkSync(filePath);
      // console.log("File deleted successfully");
    } catch (err) {
      console.error(`Error deleting the file: ${err}`);
    }
  } else {
    // console.log("File does not exist");
  }
}
// Function to unlink (delete) a file
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`);
    } else {
      // console.log(`Deleted file: ${filePath}`);
    }
  });
}

module.exports = {
  createTransactionPDFReport,
};
