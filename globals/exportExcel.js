import ExcelJS from "exceljs";
import saveAs from "file-saver";

export default {
  export(
    workbookName = "",
    worksheetTitle = "excel",
    columns = [],
    titleStyle = {},
    data = [],
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetTitle, {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });
    worksheet.views = [
      { rightToLeft: true, state: "frozen", ySplit: 1, topLeftCell: "A1" },
    ];
    worksheet.columns = columns;

    worksheet.getRow(1).height = 30;

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: columns.length,
      },
    };

    if (Object.keys(titleStyle).length === 0) {
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3465a4" },
          },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
          font: {
            bold: true,
            size: 13,
            name: "B Nazanin",
            color: { argb: "FFFFFFFF" },
          },
        };
      });
    } else {
      worksheet.getRow(1).eachCell(() => titleStyle);
    }

    data.forEach((d, i) => {
      worksheet.insertRow(i + 2, d);
      worksheet.getRow(i + 2).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = {
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
          font: {
            size: 12,
            name: "B Nazanin",
            bold: true,
          },
        };
      });
      worksheet.getRow(i + 2).height = 25;
    });
    workbook.xlsx.writeBuffer().then((data) => {
      saveAs(
        new Blob([data], {
          type: "application/octet-stream",
        }),
        workbookName + ".xlsx",
      );
    });
  },
};
