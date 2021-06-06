using System;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;

namespace AmuLab.Core.Helpers
{
    public static class ExcelHelper
    {
        /// <summary>
        /// Lấy dữ liệu từ file excel
        /// </summary>
        /// <param name="pathFileExcel">Đường dẫn file</param>
        /// <param name="sheetName">Tên bảng trong file excel</param>
        /// <param name="error">Lỗi</param>
        /// <returns>Tập hợp người dùng từ file excel</returns>
        public static DataTable GetDataFromFileExcel(string pathFileExcel, string sheetName, out int error)
        {
            var dtExcel = new DataTable();
            error = 0;
            var fileExtension = Path.GetExtension(pathFileExcel);
            if (fileExtension != ".xls" && fileExtension != ".xlsx") return dtExcel;
            if (!File.Exists(pathFileExcel)) return dtExcel;

            var excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + pathFileExcel +
                                        ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
            //connection String for xls file format.
            switch (fileExtension)
            {
                case ".xls":
                    excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + pathFileExcel +
                                            ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                    break;
                case ".xlsx":
                    excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + pathFileExcel +
                                            ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    break;
            }
            //Create Connection to Excel work book and add oledb namespace
            var excelConnection = new OleDbConnection(excelConnectionString);
            excelConnection.Open();
            var dtSheets = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            if (dtSheets == null)
            {
                return null;
            }

            var excelSheets = new string[dtSheets.Rows.Count];
            var t = 0;
            var index = 0;
            //excel data saves in temp file here.
            foreach (DataRow row in dtSheets.Rows)
            {
                excelSheets[t] = row["TABLE_NAME"].ToString();
                if (row["TABLE_NAME"].ToString() == sheetName)
                {
                    index = t;
                    error = 0;
                    break;
                }
                error = 1;
                t++;
            }
            if (excelConnection.State == ConnectionState.Open)
            {
                excelConnection.Close();
            }
            //Lấy dữ liệu trong Sheets[0] đầu tiên của file Excel
            if (error == 0)
            {
                var excelConnection1 = new OleDbConnection(excelConnectionString);
                var query = string.Format("Select * from [{0}]", excelSheets[index]);
                using (var dataAdapter = new OleDbDataAdapter(query, excelConnection1))
                {
                    dataAdapter.Fill(dtExcel);
                    dtExcel =
                        dtExcel.Rows.Cast<DataRow>()
                            .Where(row => !row.ItemArray.All(field => field is DBNull))
                            .CopyToDataTable();
                }
            }
            else
            {
                dtExcel = null;
            }

            return dtExcel;
        }
    }
}
