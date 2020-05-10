const downloadExcelSheet = function (headers, Data, sheet_name="Report") {
  const excel = require('node-excel-export');
  const styles = {
    headerDark: {
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 12,
        bold: true,
        underline: false
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    }
  };


  var all_headers = {}
  headers.forEach(function(element, l) {
    all_headers[element['column_name']] = {}
    all_headers[element['column_name']]['displayName'] = element['displayName']
    all_headers[element['column_name']]['headerStyle'] = styles.headerDark
    all_headers[element['column_name']]['width'] = 120
  });

  const report = excel.buildExport(
    [
      {
        name: sheet_name,
        specification: all_headers, 
        data: Data 
      }
    ]
  );
  return report
}
const downloadExcelMultiSheet = function (sheet_object) {
  const excel = require('node-excel-export');
  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FFFFFFFF'
        }
      },
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 12,
        bold: true,
        underline: false
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    }
  };

  var sheet_data = []
  sheet_object.forEach(function(my_data, i) {
      var all_headers = {}
      my_data.headers.forEach(function(element, l) {
        all_headers[element['column_name']] = {}
        all_headers[element['column_name']]['displayName'] = element['displayName']
        all_headers[element['column_name']]['headerStyle'] = styles.headerDark
        all_headers[element['column_name']]['width'] = 120
      });
      var object = {
        name: my_data.sheet_name,
        specification: all_headers, 
        data: my_data.data 
      }
      sheet_data.push(object);
  });
  const report = excel.buildExport(sheet_data);
  return report
}
module.exports = { downloadExcelSheet, downloadExcelMultiSheet};