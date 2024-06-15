// exceljs package
const Excel = require('exceljs');
const con = require('../config/db');
const pdf = require('pdf-creator-node');
const {getDateTime,getTimeDuration,arabicToEnglishNumber, calculateTimeDifference, formatCustomTime}=require('../helper/common')
const fs = require("fs");
const path = require('path');


module.exports = {

    // code to write data into excel sheet
    createMissionsExcelReport: async function  createMissionsExcelReport(data,file_name,filterType)
    {
        //console.log("inside excelfunction")
        //console.log(data)

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('missions');
        
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&(filterType.language==1||!filterType.language)){
                    rowValues=[
                        "Task ID",
                        "Task Status",
                        "Customer Name",
                        "Execution Date",
                        'Engineers name',
                        'Internal technicians names',
                        "External technicians names",
                        "Mission Type",
                        "SubMission Count",
                        "Instructions",
                        "Geofence Name",
                        "x",
                        'Y',
                        "Mission Status",
                        "Status Color",
                        "Status Name",
                        "Mission ID",
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                        "#",
                        "حالة المهمة",
                        "اسم الزبون",
                        "وقت التنفيذ",
                        'اسماء المهندسيين',
                        'أسماء الفنيين الداخليين',
                        'أسماء الفنيين الخارجيين',
                        'نوع الواجب',
                        "عدد الواجبات الفرعية",
                        "التعليمات",
                        "اسم الموقع",
                        "x",
                        'Y',
                        "معرف حالة الواجب",
                        "لون حالة الواجب",
                        "حالة الواجب",
                        "معرف الواجب",
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[1]=json.task_id  
            rowValues[2]=json.task_status       
            rowValues[3]=json.customer_name     
            rowValues[4]=json.execution_date              
            rowValues[5]=json.engineers_names 
            rowValues[6]=json.engineers_names?json.engineers_names:'',
            rowValues[7]=json.technicians_names?json.technicians_names:'',
            rowValues[8]=json.mission_type_names?json.mission_type_names:'',

            rowValues[9]=json.sub_missions_count  
            
            rowValues[10]=json.instructions
            rowValues[11]=json.geofence_name       
            rowValues[12]=json.x   
            rowValues[13]=json.y          
            rowValues[14]=json.mission_status               
            rowValues[15]=json.status_color 
            rowValues[16]=json.status_name
            
            rowValues[17]=json.mission_id       
          
            

            // add row to worksheet
            worksheet.addRow(rowValues);   
            

        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    externalCustomerCareAndInstallationTasksExcelReport: async function  createExcelReport(data,file_name)
    {
        //console.log("inside excelfunction")
        //console.log(data)

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('tasks');
        
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
                var keys = Object.keys(json);
                for (let index = 0; index < keys.length; index++) {
                    const element = keys[index];
                    rowValues[index+1]=keys[index]
                }
                worksheet.addRow(rowValues);
            
            }
            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[1]=json.task_id       
            rowValues[2]=json.customer_name      
            rowValues[3]=json.creation_date      
            rowValues[4]=json.task_closing_date               
            rowValues[5]=json.duration 
            rowValues[6]=json.description 
            rowValues[7]=json.status 
            
            rowValues[8]=json.to_names       
            rowValues[9]=json.to_names_count         
            rowValues[10]=json.monitors_names               
            rowValues[11]=json.monitors_count
            rowValues[12]=json.request_type_name
            
            rowValues[13]=json.sub_task_id       
            rowValues[14]=json.sub_task_customer_name          
            rowValues[15]=json.sub_task_creation_date               
            rowValues[16]=json.sub_task_closing_date 
            rowValues[17]=json.sub_task_duration

            rowValues[18]=json.sub_task_description       
            rowValues[19]=json.sub_task_status          
            rowValues[20]=json.sub_task_to_names               
            rowValues[21]=json.sub_task_to_names_count 
            rowValues[22]=json.sub_task_monitors_names

            rowValues[23]=json.sub_task_monitors_count
            rowValues[24]=json.sub_task_main_task_id
            
            

            // add row to worksheet
            worksheet.addRow(rowValues);   
            

        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    creatMissionPdf: async function  creatMissionPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "task_id":json.task_id?json.task_id:'',
                    "generation_date":getDateTime(new Date()),
                    "customer_name":json.customer_name?json.customer_name:'',
                    // 'customer_location':'',
                    "internal_technicians":json.engineers_names?json.engineers_names:'',
                    'external_technicians':json.technicians_names?json.technicians_names:'',
                    'location':json.geofence_name?json.geofence_name:'',
                    'mission_type':json.mission_type_names?json.mission_type_names:'',
                    'instructions':json.instructions?json.instructions.replace(/\s+/g, " "):'',
                    'from_date':dataForDate.startDate?dataForDate.startDate:'',
                    'to_date':dataForDate.endDate?dataForDate.endDate:''
                }
            listOfData.push(rowValues)
            
        
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
               "Task Id", 
               "Generation Date", 
               "Customer Name",
            //    "Customer location",
               'Internal technicians names',
               "External technicians names",
               "location",
               "Mission Type",
               "Instructions",
               "From time",
               'To time', 
            ]
        }else {
            HeaderNames=[
                "#", 
                "تاريخ الانشاء", 
                "أسم الزبون",
                // "موقع الزبون",
                'أسماء الفنينن الداخلين',
                "أسماء الفنيين الخارج",
                "الموقع",
                "نوع الواجب",
                "التعليمات",
                "من وقت",
                'الى وقت', 
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}

          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
            padding:auto 15px;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:22px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:55px
          }
          td:nth-child(4){
            width:80px
          }
          td:nth-child(5){
            width:80px
          }
          td:nth-child(6){
            width:30px
          }
          td:nth-child(7){
            width:55px
          }
          td:nth-child(8){
            width:100px
          }
          td:nth-child(9){
            width:40px
          }
          td:nth-child(10){
            
            width:40px
          }
        `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            // templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:30px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A2",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            timeout:60000,
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        
        };
        const keysData = Object.keys(listOfData[0]);

          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle,
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    createLeaveRequestExcelReport: async function  createLeaveRequestExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('LeaveRequest');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "UserName",
                        "Reason Name",
                        "Status Name",
                        'Other Reason',
                        'Supervisor Name',
                        'SuperVisor Comment',
                        'From Day Date',
                        'To Day Date',
                        "Creation Date",

                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                        "#",
                        "اسم الموظف",
                        "السبب",
                        "الحالة",
                        'سبب اخر',
                        "اسم المسؤول",
                        "ملاحظات المسؤول",
                        "من تاريخ",
                        "الى تاريخ",
                        "تاريخ الطلب"
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.name  
            rowValues[2]=row.reason_name       
            rowValues[3]=row.status_name     
            rowValues[4]=row.other_reason              
            rowValues[5]=row.supervisor_name 
            rowValues[6]=row.supervisor_comment  
            rowValues[7]=row.from_day_date?getDateTime(row.from_day_date,'Y-m-d'):''
            rowValues[8]=row.to_day_date?getDateTime(row.to_day_date,'Y-m-d'):''    
            rowValues[9]=row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    creatLeaveRequestPdf: async function  creatLeaveRequestPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id?row.id:'',
                    "name":row.name?row.name:'',
                    "reason_name":row.reason_name?row.reason_name:'',
                    "status_name":row.status_name?row.status_name:'',
                    'other_reason':row.other_reason?row.other_reason:'',
                    'supervisor_name':row.supervisor_name?row.supervisor_name:'',
                    'supervisor_comment':row.supervisor_comment?row.supervisor_comment:'',
                    'from_day_date':row.from_day_date?getDateTime(row.from_day_date,'Y-m-d'):'',
                    'to_day_Date':row.to_day_Date?getDateTime(row.to_day_Date,'Y-m-d'):'',
                    'created_at':row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
               "id", 
               "UserName", 
               "Reason Name",
               'Status Name',
               "Other Name",
               "Supervisor Name",
               "Supervisor Comment",
               "From Day Date",
               "To Day Date",
               'Creation Date', 
            ]
        }else {
            HeaderNames=[
                "#", 
                 "اسم الموظف",
                 "السبب",
                 "الحال",
                 "سبب اخر",
                 "اسم المسؤول",
                 "ملاحظات المسؤول",
                 "من تاريخ",
                 "الى تاريخ",
                 "تاريخ الطلب"
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:22px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:55px
          }
          td:nth-child(4){
            width:80px
          }
          td:nth-child(5){
            width:80px
          }
          td:nth-child(6){
            width:55px
          }
          td:nth-child(7){
            width:55px
          }
          td:nth-child(8){
            width:40px
          }
          td:nth-child(9){
            width:40px
          }
          td:nth-child(10){
            
            width:40px
          }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    createSubMissionsExcelReport: async function  createSubMissionsExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('subMissions');
    
        var header= true;
        // for loop to read each record from Products table
        let count=1;
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        'Task Id',
                        'Mission ID',
                        "SubMission Name",
                        'Plate Number',
                        "Technician Name",
                        "Engineer Name",
                        'Status',
                        'Customer Name',
                        'Driver Name',
                        'Phone',
                        'Type',
                        "Cancel Reason",
                        'Create Date',
                        "Note",
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                        "#",
                        "معرف المهمة",
                        "معرف الواجب",
                        "اسم الواجب الفرعية",
                        "رقم المركبة",
                        "اسم الفني",
                        "اسم المهندس",
                        "الحالة",
                        "اسم الزبون",
                        "اسم السائق",
                        "رقم الهاتف",
                        "النوع",
                        "سبب الالغاء",
                        "تاريخ الانشاء",
                        "ملاحظات",
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id;  
            rowValues[1]=row.task_id;
            rowValues[2]=row.mission_id;
            rowValues[3]=`SubMission ${count}`;
            rowValues[4]= arabicToEnglishNumber(row.name);
            rowValues[5]=row.technician_name;
            rowValues[6]=row.engineer_name
            rowValues[7]=row.status_name
            rowValues[8]=row.customer_name
            rowValues[9]=row.driver_name
            rowValues[10]=row.phone
            rowValues[11]=row.type_name
            rowValues[12]=row.cancel_reason
            rowValues[13]=row.created_at
            rowValues[14]=row.note
            // add row to worksheet
            count++;
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    creatSubMissionsReportPDF: async function  creatSubMissionsReportPDF(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        let count=1;
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id,
                    "task_id":row.task_id,
                    "mission_id":row.mission_id,
                    "submission_name":`SubMission ${count}`,
                    "name":row.name,
                    "technician_name":row.technician_name,
                    "engineer_name":row.engineer_name,
                    "status_name":row.status_name,
                    "customer_name":row.customer_name,
                    "driver_name":row.driver_name,
                    "phone":row.phone,
                    'type_name':row.type_name,
                    "cancel_reason":row.cancel_reason,
                    "created_at":row.created_at,
                    "note":row.note,
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
                "#",
                'Task Id',
                'Mission ID',
                "SubMission Name",
                'Plate Number',
                "Technician Name",
                "Engineer Name",
                'Status',
                'Customer Name',
                'Driver Name',
                'Phone',
                'Type',
                "Cancel Reason",
                'Create Date',
                "Note",
            ]
        }else {
            HeaderNames=[
                "#",
                "معرف المهمة",
                "معرف الواجب",
                "اسم الواجب الفرعية",
                "رقم المركبة",
                "اسم الفني",
                "اسم المهندس",
                "الحالة",
                "اسم الزبون",
                "اسم السائق",
                "رقم الهاتف",
                "النوع",
                "سبب الالغاء",
                "تاريخ الانشاء",
                "ملاحظات",
             ]
        }

        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:22px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:30px
          }
          td:nth-child(4){
            width:50px
          }
          td:nth-child(5){
            width:35px
          }
          td:nth-child(6){
            width:55px
          }
          td:nth-child(7){
            width:55px
          }
          td:nth-child(8){
            width:20px
          }
          td:nth-child(9){
            width:60px
          }
          td:nth-child(10){
            
            width:40px
          }
          td:nth-child(11){
            width:40px
          }
          td:nth-child(12){
            width:20px
          }
          td:nth-child(13){
            width:60px
          }
          td:nth-child(14){
            width:60px
          }
          td:nth-child(15){
            width:70px
          }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:30px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:20px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[10]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:20px">${HeaderNames[11]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[12]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[13]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:70px">${HeaderNames[14]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A2",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:120000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    createInventoryRequestExcelReport: async function  createInventoryRequestExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('InventoryRquest');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "UserName",
                        "Name",
                        "Email",
                        'Status Name',
                        'Creation Date',
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                        "#",
                        "اسم الموظف",
                        "الاسم",
                        "البريد الالكتروني",
                        "اسم الحالة",
                        "تاريخ الطلب"
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.username  
            rowValues[2]=row.name       
            rowValues[3]=row.email     
            rowValues[4]=row.status_name               
            rowValues[5]=row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    creatInventoryRequestPdf: async function  creatInventoryRequestPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id?row.id:'',
                    "username":row.username?row.username:'',
                    "name":row.name?row.name:'',
                    "email":row.email?row.email:'',
                    'status_name':row.status_name?row.status_name:'',
                    'created_at':row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "UserName",
              "Name",
              "Email",
              'Status Name',
              'Creation Date',
            ]
        }else {
            HeaderNames=[
              "#",
              "اسم المستخدم",
              "أسم الموظف",
              "البريد الالكتروني",
              "اسم الحالة",
              "تاريخ الطلب"
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:22px;
              }
              td:nth-child(2){
                width:40px
              }
              td:nth-child(3){
                width:55px
              }
              td:nth-child(4){
                width:80px
              }
              td:nth-child(5){
                width:80px
              }
              td:nth-child(6){
                width:55px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[5]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    createUserOverTimeExcelReport: async function  createUserOverTimeExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('userOverTime');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                      "id", 
                      "UserName", 
                      "Reason",
                      'Status Name',
                      "Supervisor Name",
                      "Supervisor Comment",
                      "Day Date",
                      "N. Hours",
                      "N. Minutes",
                      'Creation Date', 
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#", 
                      "اسم الموظف",
                      "السبب",
                      "الحال",
                      "اسم المسؤول",
                      "ملاحظات المسؤول",
                      "تاريخ اليوم",
                      "عدد الساعات",
                      "عدد الدقائق",
                      "تاريخ الانشاء"
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()
            const { hours, minutes } = getTimeDuration(row.from_day_date, row.from_day_date?getDateTime(row.from_day_date,'H:M'):'', row.to_day_date?getDateTime(row.to_day_date,'H:M'):'');

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.name  
            rowValues[2]=row.reason       
            rowValues[3]=row.status_name     
            rowValues[4]=row.supervisor_name 
            rowValues[5]=row.supervisor_comment  
            rowValues[6]=row.from_day_date?getDateTime(row.from_day_date,'Y-m-d'):''
            rowValues[7]=hours?hours:0 
            rowValues[8]=minutes?minutes:0    
            rowValues[9]=row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    createUserOverTimePdf: async function  createUserOverTimePdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
          const { hours, minutes } = getTimeDuration(row.from_day_date, row.from_day_date?getDateTime(row.from_day_date,'H:M'):'', row.to_day_date?getDateTime(row.to_day_date,'H:M'):'');

            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id?row.id:'',
                    "name":row.name?row.name:'',
                    "reason":row.reason?row.reason:'',
                    "status_name":row.status_name?row.status_name:'',
                    'supervisor_name':row.supervisor_name?row.supervisor_name:'',
                    'supervisor_comment':row.supervisor_comment?row.supervisor_comment:'',
                    'day_date':row.from_day_date?getDateTime(row.from_day_date,'Y-m-d'):'',
                    'number_of_hours':hours?hours:0,
                    'number_of_minutes':minutes?minutes:0,
                    'created_at':row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
               "id", 
               "UserName", 
               "Reason",
               'Status Name',
               "Supervisor Name",
               "Supervisor Comment",
               "Day Date",
               "N. Hours",
               "N. Minutes",
               'Creation Date', 
            ]
        }else {
            HeaderNames=[
                "#", 
                 "اسم الموظف",
                 "السبب",
                 "الحال",
                 "اسم المسؤول",
                 "ملاحظات المسؤول",
                 "تاريخ اليوم",
                 "عدد الساعات",
                 "عدد الدقائق",
                 "تاريخ الانشاء"
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:15px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:100px
          }
          td:nth-child(4){
            width:40px
          }
          td:nth-child(5){
            width:40px
          }
          td:nth-child(6){
            width:100px
          }
          td:nth-child(7){
            width:55px
          }
          td:nth-child(8){
            width:40px
          }
          td:nth-child(9){
            width:40px
          }
          td:nth-child(10){
            width:40px
          }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;

        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    //internal and external customer care tasks
    createCustomerCareExcelReport: async function  createCustomerCareExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('Tasks');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                      "Task Id", 
                      "Status", 
                      'Customer Name',
                      "Date Created",
                      "Type",
                      "User Name",
                      "Account Name",
                      "Title",
                      'Description', 
                      'Geofence', 
                      'X', 
                      'Y', 
                      "To Names",
                      "To Names Count",
                      "Monitors Names",
                      "Monitors Names Count",
                      "Weight",
                      "Comments Count",
                      "Comments Text",
                      "Last Comment",
                      "Last Comment Date",
                      'Dead Time',
                      "Wialon Host",
                      "Request Type Name"

                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#", 
                      "الحالة", 
                      'اسم الزبون',
                      "تاريخ الانشاء",
                      "النوع",
                      "اسم المستخدم",
                      "اسم الحساب",
                      "العنوان",
                      'الوصف', 
                      'الموقع الجغرافي', 
                      'X', 
                      'Y', 
                      "مسندة الى",
                      "عدد المسندين",
                      "اسماء المراقبين",
                      "عدد المراقبين",
                      "الوزن",
                      "عدد التعليقات",
                      "التعليقات",
                      "اخر تعليق",
                      "تاريخ اخر تعليق",
                      'تاريخ الانتهاء',
                      "وايلون سرفر",
                      "نوع الطلب"
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()
            const { hours, minutes } = getTimeDuration(row.from_day_date, row.from_day_date?getDateTime(row.from_day_date,'H:M'):'', row.to_day_date?getDateTime(row.to_day_date,'H:M'):'');

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[1]=row.task_id       
            rowValues[2]=row.status      
            rowValues[3]=row.customer_name      
            rowValues[4]=row.date_created               
            rowValues[5]=row.type 
            rowValues[6]=row.user_name 
            rowValues[7]=row.account_name 
            
            rowValues[8]=row.title       
            rowValues[9]=row.description         
            rowValues[10]=row.Geofence               
            rowValues[11]=row.x 
            rowValues[12]=row.y
            
            rowValues[13]=row.to_names       
            rowValues[14]=row.to_names_count          
            rowValues[15]=row.monitors_names               
            rowValues[16]=row.Monitors_count 
            rowValues[17]=row.weight

            rowValues[18]=row.comments_count       
            rowValues[19]=row.comments_text          
            rowValues[20]=row.last_comment               
            rowValues[21]=row.last_comment_date 
            rowValues[22]=row.dead_time

            rowValues[23]=row.wialon_host
            rowValues[24]=row.request_type_name
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    createCustomerCarePdf: async function  createCustomerCarePdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){

            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "task_id":row.task_id?row.task_id:'',
                    "status":row.status?row.status:'',
                    "customer_name":row.customer_name?row.customer_name:'',
                    "date_created":row.date_created?row.date_created:'',
                    'type':row.type?row.type:'',
                    'user_name':row.user_name?row.user_name:'',
                    'account_name':row.account_name?row.account_name:'',
                    'title':row.title?row.title:'',
                    'description':row.description?row.description:'',
                    'Geofence':row.Geofence?row.Geofence:'',
                    'x':row.x?row.x:'',
                    'y':row.y?row.y:'',
                    'to_names':row.to_names?row.to_names:'',
                    'to_names_count':row.to_names_count?row.to_names_count:'',
                    'monitors_names':row.monitors_names?row.monitors_names:'',
                    'Monitors_count':row.Monitors_count?row.Monitors_count:'',
                    'weight':row.weight?row.weight:'',
                    'comments_count':row.comments_count?row.comments_count:'',
                    'comments_text':row.comments_text?row.comments_text:'',
                    'last_comment':row.last_comment?row.last_comment:'',
                    'last_comment_date':row.last_comment_date?row.last_comment_date:'',
                    'dead_time':row.dead_time?row.dead_time:'',
                    'wialon_host':row.wialon_host?row.wialon_host:'',
                    'request_type_name':row.request_type_name?row.request_type_name:'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "Task Id", 
              "Status", 
              'Customer Name',
              "Date Created",
              "Type",
              "User Name",
              "Account Name",
              "Title",
              'Description', 
              'Geofence', 
              'X', 
              'Y', 
              "To Names",
              "To Names Count",
              "Monitors Names",
              "Monitors Names Count",
              "Weight",
              "Comments Count",
              "Comments Text",
              "Last Comment",
              "Last Comment Date",
              'Dead Time',
              "Wialon Host",
              "Request Type Name"
            ]
        }else {
            HeaderNames=[
              "#", 
              "الحالة", 
              'اسم الزبون',
              "تاريخ الانشاء",
              "النوع",
              "اسم المستخدم",
              "اسم الحساب",
              "العنوان",
              'الوصف', 
              'الموقع الجغرافي', 
              'X', 
              'Y', 
              "مسندة الى",
              "عدد المسندين",
              "اسماء المراقبين",
              "عدد المراقبين",
              "الوزن",
              "عدد التعليقات",
              "التعليقات",
              "اخر تعليق",
              "تاريخ اخر تعليق",
              'تاريخ الانتهاء',
              "وايلون سرفر",
              "نوع الطلب"
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:35px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:60px
          }
          td:nth-child(4){
            width:50px
          }
          td:nth-child(5){
            width:50px
          }
          td:nth-child(6){
            width:60px
          }
          td:nth-child(7){
            width:65px
          }
          td:nth-child(8){
            width:60px
          }
          td:nth-child(9){
            width:120px
          }
          td:nth-child(10){
            width:40px
          }
          td:nth-child(11){
            width:15px;
          }
          td:nth-child(12){
            width:15px
          }
          td:nth-child(13){
            width:100px
          }
          td:nth-child(14){
            width:80px
          }
          td:nth-child(15){
            width:100px
          }
          td:nth-child(16){
            width:80px
          }
          td:nth-child(17){
            width:35px
          }
          td:nth-child(18){
            width:50px
          }
          td:nth-child(19){
            width:60px
          }
          td:nth-child(20){
            width:60px
          }
          td:nth-child(21){
            width:60px
          }
          td:nth-child(22){
            width:60px
          }
          td:nth-child(23){
            width:60px
          }
          td:nth-child(24){
            width:60px
          }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[10]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[11]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[12]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[13]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[14]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[15]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[16]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[17]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[18]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[19]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[20]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[21]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[22]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[23]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A1",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    //genral task here..
    createExcelReport: async function  createExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('Tasks');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                      "Task Id", 
                      "Status", 
                      "Date Created",
                      "Type",
                      "User Name",
                      "Title",
                      'Description', 
                      'Geofence', 
                      'X', 
                      'Y', 
                      "To Names",
                      "To Names Count",
                      "Monitors Names",
                      "Monitors Names Count",
                      "Weight",
                      "Comments Count",
                      "Comments Text",
                      "Last Comment",
                      "Last Comment Date",
                      'Dead Time',
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#", 
                      "الحالة", 
                      "تاريخ الانشاء",
                      "النوع",
                      "اسم المستخدم",
                      "العنوان",
                      'الوصف', 
                      'الموقع الجغرافي', 
                      'X', 
                      'Y', 
                      "مسندة الى",
                      "عدد المسندين",
                      "اسماء المراقبين",
                      "عدد المراقبين",
                      "الوزن",
                      "عدد التعليقات",
                      "التعليقات",
                      "اخر تعليق",
                      "تاريخ اخر تعليق",
                      'تاريخ الانتهاء',
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()
            const { hours, minutes } = getTimeDuration(row.from_day_date, row.from_day_date?getDateTime(row.from_day_date,'H:M'):'', row.to_day_date?getDateTime(row.to_day_date,'H:M'):'');

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[1]=json.task_id       
            rowValues[2]=json.status          
            rowValues[3]=json.date_created               
            rowValues[4]=json.type 
            rowValues[5]=json.user_name  
            
            rowValues[6]=json.title       
            rowValues[7]=json.description         
            rowValues[8]=json.Geofence               
            rowValues[9]=json.x 
            rowValues[10]=json.y
            
            rowValues[11]=json.to_names       
            rowValues[12]=json.to_names_count          
            rowValues[13]=json.monitors_names               
            rowValues[14]=json.Monitors_count 
            rowValues[15]=json.weight

            rowValues[16]=json.comments_count       
            rowValues[17]=json.comments_text          
            rowValues[18]=json.last_comment               
            rowValues[19]=json.last_comment_date 
            rowValues[20]=json.dead_time
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    createPdfReport: async function  createPdfReport(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        // console.log('datadatadata==>',data)
        data.forEach(function(row){

            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "task_id":row.task_id?row.task_id:'',
                    "status":row.status?row.status:'',
                    "date_created":row.date_created?row.date_created:'',
                    'type':row.type?row.type:'',
                    'user_name':row.user_name?row.user_name:'',
                    'title':row.title?row.title:'',
                    'description':row.description?row.description:'',
                    'Geofence':row.Geofence?row.Geofence:'',
                    'x':row.x?row.x:'',
                    'y':row.y?row.y:'',
                    'to_names':row.to_names?row.to_names:'',
                    'to_names_count':row.to_names_count?row.to_names_count:'',
                    'monitors_names':row.monitors_names?row.monitors_names:'',
                    'Monitors_count':row.Monitors_count?row.Monitors_count:'',
                    'weight':row.weight?row.weight:'',
                    'comments_count':row.comments_count?row.comments_count:'',
                    'comments_text':row.comments_text?row.comments_text:'',
                    'last_comment':row.last_comment?row.last_comment:'',
                    'last_comment_date':row.last_comment_date?row.last_comment_date:'',
                    'dead_time':row.dead_time?row.dead_time:'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "Task Id", 
              "Status", 
              "Date Created",
              "Type",
              "User Name",
              "Title",
              'Description', 
              'Geofence', 
              'X', 
              'Y', 
              "To Names",
              "To Names Count",
              "Monitors Names",
              "Monitors Names Count",
              "Weight",
              "Comments Count",
              "Comments Text",
              "Last Comment",
              "Last Comment Date",
              'Dead Time',
            ]
        }else {
            HeaderNames=[
              "#", 
              "الحالة", 
              "تاريخ الانشاء",
              "النوع",
              "اسم المستخدم",
              "العنوان",
              'الوصف', 
              'الموقع الجغرافي', 
              'X', 
              'Y', 
              "مسندة الى",
              "عدد المسندين",
              "اسماء المراقبين",
              "عدد المراقبين",
              "الوزن",
              "عدد التعليقات",
              "التعليقات",
              "اخر تعليق",
              "تاريخ اخر تعليق",
              'تاريخ الانتهاء',
             ]
            //  HeaderNames=HeaderNames.reverse();
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:35px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:70px
          }
          td:nth-child(4){
            width:60px
          }
          td:nth-child(5){
            width:65px
          }
          td:nth-child(6){
            width:60px
          }
          td:nth-child(7){
            width:120px
          }
          td:nth-child(8){
            width:40px
          }
          td:nth-child(9){
            width:15px;
          }
          td:nth-child(10){
            width:15px
          }
          td:nth-child(11){
            width:100px
          }
          td:nth-child(12){
            width:80px
          }
          td:nth-child(13){
            width:110px
          }
          td:nth-child(14){
            width:80px
          }
          td:nth-child(15){
            width:50px
          }
          td:nth-child(16){
            width:50px
          }
          td:nth-child(17){
            width:60px
          }
          td:nth-child(18){
            width:60px
          }
          td:nth-child(19){
            width:70px
          }
          td:nth-child(20){
            width:60px
          }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:70px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[10]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[11]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:110px">${HeaderNames[12]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[13]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[14]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[15]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[16]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[17]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:70px">${HeaderNames[18]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[19]}</th>`;
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A1",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    //installation tasks
    createInstallationExcelReport: async function  createInstallationExcelReport(data,file_name,filterType,is_special_export=0)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

        // read excel file from the path
        const workbook = new Excel.Workbook();

        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('Tasks');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
                

                if(filterType&&filterType.language==1){
                  if(!is_special_export)
                    rowValues=[
                      "Task Id", 
                      "Status", 
                      'Customer Name',
                      "Date Created",
                      "Type",
                      "User Name",
                      "Title",
                      "Number Of Unit",
                      'Description', 
                      "Governorate",
                      'Geofence', 
                      'X', 
                      'Y', 
                      "To Names",
                      "To Names Count",
                      "Monitors Names",
                      "Monitors Names Count",
                      "Weight",
                      "Work Type",
                      "Comments Count",
                      "Comments Text",
                      "Last Comment",
                      "Last Comment Date",
                      'Dead Time',
                    ]
                  else
                  rowValues=[
                    "Task Id", 
                    "Status", 
                    'Customer Name',
                    "Date Created",
                    "User Name",
                    "Number Of Unit",
                    'Description', 
                    "Governorate",
                    'Geofence', 
                    "To Names Count",
                    "Work Type",
                    "Comments Count",
                    "Comments Text",
                    "Last Comment",
                    "Last Comment Date",
                  ]
                }else if(filterType&&filterType.language==2){
                  if(!is_special_export)
                    rowValues=[
                      "#", 
                      "الحالة", 
                      'اسم الزبون',
                      "تاريخ الانشاء",
                      "النوع",
                      "اسم المستخدم",
                      "العنوان",
                      "عدد الوحدات",
                      'الوصف', 
                      "المحافظة",
                      'الموقع الجغرافي', 
                      'X', 
                      'Y', 
                      "مسندة الى",
                      "عدد المسندين",
                      "اسماء المراقبين",
                      "عدد المراقبين",
                      "الوزن",
                      "نوع العمل",
                      "عدد التعليقات",
                      "التعليقات",
                      "اخر تعليق",
                      "تاريخ اخر تعليق",
                      'تاريخ الانتهاء',
                    ]
                  else
                  rowValues=[
                    "#", 
                    "الحالة", 
                    'اسم الزبون',
                    "تاريخ الانشاء",
                    "اسم المستخدم",
                    "عدد الوحدات",
                    'الوصف', 
                    "المحافظة",
                    'الموقع الجغرافي', 
                    "عدد المسندين",
                    "نوع العمل",
                    "عدد التعليقات",
                    "التعليقات",
                    "اخر تعليق",
                    "تاريخ اخر تعليق",
                  ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()
            const { hours, minutes } = getTimeDuration(row.from_day_date, row.from_day_date?getDateTime(row.from_day_date,'H:M'):'', row.to_day_date?getDateTime(row.to_day_date,'H:M'):'');

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            if(!is_special_export){
              rowValues[1]=row.task_id       
              rowValues[2]=row.status     
              rowValues[3]=row.customer_name     
              rowValues[4]=row.date_created               
              rowValues[5]=row.type 
              rowValues[6]=row.user_name  
              
              rowValues[7]=row.title
              rowValues[8]=row.num_of_units       
              rowValues[9]=row.description   
              rowValues[10]=row.governorate_name          
              rowValues[11]=row.Geofence               
              rowValues[12]=row.x 
              rowValues[13]=row.y
              
              rowValues[14]=row.to_names       
              rowValues[15]=row.to_names_count          
              rowValues[16]=row.monitors_names               
              rowValues[17]=row.Monitors_count 
              rowValues[18]=row.weight
              rowValues[19]=row.work_type_name

              rowValues[20]=row.comments_count       
              rowValues[21]=row.comments_text          
              rowValues[22]=row.last_comment               
              rowValues[23]=row.last_comment_date 
              rowValues[24]=row.dead_time
            }else{
              rowValues[1]=row.task_id       
              rowValues[2]=row.status     
              rowValues[3]=row.customer_name     
              rowValues[4]=row.date_created               
              rowValues[5]=row.user_name  
              rowValues[6]=row.num_of_units       
              rowValues[7]=row.description   
              rowValues[8]=row.governorate_name          
              rowValues[9]=row.Geofence               
              rowValues[10]=row.to_names_count          
              rowValues[11]=row.work_type_name
              rowValues[12]=row.comments_count       
              rowValues[13]=row.comments_text          
              rowValues[14]=row.last_comment               
              rowValues[15]=row.last_comment_date 
            }
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
            

    },
    createInstallationReportPdf: async function  createInstallationReportPdf(data,file_name,filterType,dataForDate,is_special_export=0)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){

            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
            if(!is_special_export)
                rowValues={
                    "task_id":row.task_id?row.task_id:'',
                    "status":row.status?row.status:'',
                    "customer_name":row.customer_name?row.customer_name:'',
                    "date_created":row.date_created?row.date_created:'',
                    'type':row.type?row.type:'',
                    'user_name':row.user_name?row.user_name:'',
                    'title':row.title?row.title:'',
                    'num_of_units':row.num_of_units?row.num_of_units:'',
                    'description':row.description?row.description:'',
                    'governorate_name':row.governorate_name?row.governorate_name:'',
                    'Geofence':row.Geofence?row.Geofence:'',
                    'x':row.x?row.x:'',
                    'y':row.y?row.y:'',
                    'to_names':row.to_names?row.to_names:'',
                    'to_names_count':row.to_names_count?row.to_names_count:'',
                    'monitors_names':row.monitors_names?row.monitors_names:'',
                    'Monitors_count':row.Monitors_count?row.Monitors_count:'',
                    'weight':row.weight?row.weight:'',
                    'work_type_name':row.work_type_name?row.work_type_name:'',
                    'comments_count':row.comments_count?row.comments_count:'',
                    'comments_text':row.comments_text?row.comments_text:'',
                    'last_comment':row.last_comment?row.last_comment:'',
                    'last_comment_date':row.last_comment_date?row.last_comment_date:'',
                    'dead_time':row.dead_time?row.dead_time:'',
                }
            else
                rowValues={
              "task_id":row.task_id?row.task_id:'',
              "status":row.status?row.status:'',
              "customer_name":row.customer_name?row.customer_name:'',
              "date_created":row.date_created?row.date_created:'',
              'user_name':row.user_name?row.user_name:'',
              'num_of_units':row.num_of_units?row.num_of_units:'',
              'description':row.description?row.description:'',
              'governorate_name':row.governorate_name?row.governorate_name:'',
              'Geofence':row.Geofence?row.Geofence:'',
              'to_names_count':row.to_names_count?row.to_names_count:'',
              'work_type_name':row.work_type_name?row.work_type_name:'',
              'comments_count':row.comments_count?row.comments_count:'',
              'comments_text':row.comments_text?row.comments_text:'',
              'last_comment':row.last_comment?row.last_comment:'',
              'last_comment_date':row.last_comment_date?row.last_comment_date:'',
          }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
          if(!is_special_export)
          HeaderNames=[
              "Task Id", 
              "Status", 
              'Customer Name',
              "Date Created",
              "Type",
              "User Name",
              "Title",
              "Number Of Unit",
              'Description', 
              "Governorate",
              'Geofence', 
              'X', 
              'Y', 
              "To Names",
              "To Names Count",
              "Monitors Names",
              "Monitors Names Count",
              "Weight",
              "Work Type",
              "Comments Count",
              "Comments Text",
              "Last Comment",
              "Last Comment Date",
              'Dead Time',
            ]
          else
          HeaderNames=[
            "Task Id", 
            "Status", 
            'Customer Name',
            "Date Created",
            "User Name",
            "Number Of Unit",
            'Description', 
            "Governorate",
            'Geofence', 
            "To Names Count",
            "Work Type",
            "Comments Count",
            "Comments Text",
            "Last Comment",
            "Last Comment Date",
          ]
        }else if(filterType&&filterType.language==2){
          if(!is_special_export)
          HeaderNames=[
              "#", 
              "الحالة", 
              'اسم الزبون',
              "تاريخ الانشاء",
              "النوع",
              "اسم المستخدم",
              "العنوان",
              "عدد الوحدات",
              'الوصف', 
              "المحافظة",
              'الموقع الجغرافي', 
              'X', 
              'Y', 
              "مسندة الى",
              "عدد المسندين",
              "اسماء المراقبين",
              "عدد المراقبين",
              "الوزن",
              "نوع العمل",
              "عدد التعليقات",
              "التعليقات",
              "اخر تعليق",
              "تاريخ اخر تعليق",
              'تاريخ الانتهاء',
            ]
          else
          HeaderNames=[
            "#", 
            "الحالة", 
            'اسم الزبون',
            "تاريخ الانشاء",
            "اسم المستخدم",
            "عدد الوحدات",
            'الوصف', 
            "المحافظة",
            'الموقع الجغرافي', 
            "عدد المسندين",
            "نوع العمل",
            "عدد التعليقات",
            "التعليقات",
            "اخر تعليق",
            "تاريخ اخر تعليق",
          ]
        }
        var customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
            word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:35px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:60px
          }
          td:nth-child(4){
            width:50px
          }
          td:nth-child(5){
            width:50px
          }
          td:nth-child(6){
            width:60px
          }
          td:nth-child(7){
            width:65px
          }
          td:nth-child(8){
            width:60px
          }
          td:nth-child(9){
            width:120px
          }
          td:nth-child(10){
            width:40px
          }
          td:nth-child(11){
            width:40px;
          }
          td:nth-child(12){
            width:15px
          }
          td:nth-child(13){
            width:15px
          }
          td:nth-child(14){
            width:80px
          }
          td:nth-child(15){
            width:70px
          }
          td:nth-child(16){
            width:80px
          }
          td:nth-child(17){
            width:50px
          }
          td:nth-child(18){
            width:50px
          }
          td:nth-child(19){
            width:60px
          }
          td:nth-child(20){
            width:60px
          }
          td:nth-child(21){
            width:120px
          }
          td:nth-child(22){
            width:100px
          }
          td:nth-child(23){
            width:60px
          }
          td:nth-child(24){
            width:60px
          }
            `;
          if(is_special_export){
            customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
            word-break: break-all; */
    
          }
    
          td:nth-child(1){
            width:35px;
          }
          td:nth-child(2){
            width:40px
          }
          td:nth-child(3){
            width:60px
          }
          td:nth-child(4){
            width:50px
          }
          td:nth-child(5){
            width:60px
          }
          td:nth-child(6){
            width:60px
          }
          td:nth-child(7){
            width:120px
          }
          td:nth-child(8){
            width:40px
          }
          td:nth-child(9){
            width:40px;
          }
          td:nth-child(10){
            width:70px
          }
          td:nth-child(11){
            width:60px
          }
          td:nth-child(12){
            width:60px
          }
          td:nth-child(13){
            width:120px
          }
          td:nth-child(14){
            width:100px
          }
          td:nth-child(15){
            width:60px
          }
            `;
          }
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            if(is_special_export){
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[2]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[3]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[4]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[6]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[7]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[8]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:70px">${HeaderNames[9]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[10]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[11]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[12]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[13]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[14]}</th>`;
            }else{
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[2]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[3]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[4]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[6]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[7]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[8]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[9]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[10]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[11]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:15px">${HeaderNames[12]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[13]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:70px">${HeaderNames[14]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[15]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[16]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:50px">${HeaderNames[17]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[18]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[19]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[20]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[21]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[22]}</th>`;
              templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[23]}</th>`;
            }
        }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A1",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
            await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
            return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
            

    },
    usersExcelReport: async function  usersExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('users');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "Account name",
                        "UserName",
                        "Name",
                        "Email",
                        'Phone',
                        'Department',
                        'Last Login',
                        'Ext.',
                        'BirthDate',
                        'Status',
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#",
                      "اسم الحساب",
                      "اسم المستخدم",
                      "الاسم",
                      "البريد الالكتروني",
                      'الهاتف',
                      'القسم',
                      'اخر دخول',
                      'Ext.',
                      'تاريخ الميلاد',
                      'الحالة',
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.user_id  
            rowValues[1]=row.account_name  
            rowValues[2]=row.username       
            rowValues[3]=row.name     
            rowValues[4]=row.email     
            rowValues[5]=row.phone     
            rowValues[6]=row.department?row.department.name:''   
            rowValues[7]=row.last_login     
            rowValues[8]=row.ip_phone
            rowValues[9]=row.birthdate?getDateTime(row.birthdate,'Y-m-d'):''
            rowValues[10]=row.enabled==1?'Enabled':'Disabled'               
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    usersReportPdf: async function  usersReportPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.user_id?row.user_id:'',
                    "account_name":row.account_name?row.account_name:'',
                    "username":row.username?row.username:'',
                    "name":row.name?row.name:'',
                    'email':row.email?row.email:'',
                    'phone':row.phone?row.phone:'',
                    'department':row.department?row.department.name:'',
                    'last_login':row.last_login?getDateTime(row.last_login,'Y-m-d H:M:S'):'',
                    'ip_phone':row.ip_phone?row.ip_phone:'',
                    'birthdate':row.birthdate?getDateTime(row.birthdate,'Y-m-d'):'',
                    'status':row.enabled==1?'Enabled':'Disabled' ,
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "Account name",
              "UserName",
              "Name",
              "Email",
              'Phone',
              'Department',
              'Last Login',
              'Ext.',
              'BirthDate',
              'Status',
            ]
        }else {
            HeaderNames=[
              "#",
              "اسم الحساب",
              "اسم المستخدم",
              "الاسم",
              "البريد الالكتروني",
              'الهاتف',
              'القسم',
              'اخر دخول',
              'Ext.',
              'تاريخ الميلاد',
              'الحالة',
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:22px;
              }
              td:nth-child(2){
                width:40px
              }
              td:nth-child(3){
                width:55px
              }
              td:nth-child(4){
                width:55px
              }
              td:nth-child(5){
                width:80px
              }
              td:nth-child(6){
                width:55px
              }
              td:nth-child(7){
                width:55px
              }
              td:nth-child(8){
                width:55px
              }
              td:nth-child(9){
                width:55px
              }
              td:nth-child(10){
                width:55px
              }
              td:nth-child(11){
                width:55px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:40px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[10]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A2",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    complainExcelReport: async function  complainExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('users');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "Description",
                        "type",
                        "status",
                        "username",
                        'number of response',
                        'creation Date',
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#",
                      "الوصف",
                      "النوع",
                      "الحالة",
                      "اسم المستخدم",
                      'عدد الردود',
                      'تاريخ الانشاء',
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.complain_desc  
            rowValues[2]=row.Type_desc       
            rowValues[3]=row.Status_desc     
            rowValues[4]=row.name     
            rowValues[5]=row.NumberOfResponses     
            rowValues[6]=row.created_at?getDateTime(row.created_at,'Y-m-d'):''
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    complainReportPdf: async function  complainReportPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.user_id?row.user_id:'',
                    "complain_desc":row.complain_desc?row.complain_desc:'',
                    "Type_desc":row.Type_desc?row.Type_desc:'',
                    "Status_desc":row.Status_desc?row.Status_desc:'',
                    'Status_desc':row.Status_desc?row.Status_desc:'',
                    'name':row.name?row.name:'',
                    'NumberOfResponses':row.NumberOfResponses?row.NumberOfResponses:'',
                    'description':row.created_at?getDateTime(row.created_at,'Y-m-d'):'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "Description",
              "type",
              "status",
              "username",
              'number of response',
              'creation Date',
            ]
        }else {
            HeaderNames=[
              "#",
              "الوصف",
              "النوع",
              "الحالة",
              "اسم المستخدم",
              'عدد الردود',
              'تاريخ الانشاء',
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:22px;
              }
              td:nth-child(2){
                width:150px
              }
              td:nth-child(3){
                width:55px
              }
              td:nth-child(4){
                width:55px
              }
              td:nth-child(5){
                width:80px
              }
              td:nth-child(6){
                width:65px
              }
              td:nth-child(7){
                width:65px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:150px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[6]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    createSubMissionOvertTimeExcelReport: async function  createSubMissionOvertTimeExcelReport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('users');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "SubMission Id",
                        "Mission Id",
                        "SubMission Status",
                        "Technician Name",
                        'Engineer Name',
                        'creation Date',
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#",
                      "معرف الواجب الفرعية",
                      "معرف الواجب",
                      "الحالة",
                      "اسم الفني",
                      'اسم المهندس',
                      'تاريخ الانشاء',
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            
            // get value for the record
            // const val = data.val()

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.sub_mission_id  
            rowValues[2]=row.mission_id       
            rowValues[3]=row.sub_mission_status_name,     
            rowValues[4]=row.technician_name     
            rowValues[5]=row.engineer_name     
            rowValues[6]=row.created_at?getDateTime(row.created_at,'Y-m-d'):''
            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    createSubMissionOvertTimePdf: async function  createSubMissionOvertTimePdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id?row.id:'',
                    "sub_mission_id":row.sub_mission_id?row.sub_mission_id:'',
                    "mission_id":row.mission_id?row.mission_id:'',
                    "status":row.sub_mission_status_name?row.sub_mission_status_name:'',
                    'technician_name':row.technician_name?row.technician_name:'',
                    'engineer_name':row.engineer_name?row.engineer_name:'',
                    'created_at':row.created_at?getDateTime(row.created_at,'Y-m-d'):'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "SubMission Id",
              "Mission Id",
              "SubMission Status",
              "Technician Name",
              'Engineer Name',
              'creation Date',
            ]
        }else {
            HeaderNames=[
              "#",
              "معرف الواجب الفرعية",
              "معرف الواجب",
              "الحالة",
              "اسم الفني",
              'اسم المهندس',
              'تاريخ الانشاء',
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:22px;
              }
              td:nth-child(2){
                width:55px
              }
              td:nth-child(3){
                width:55px
              }
              td:nth-child(4){
                width:75px
              }
              td:nth-child(5){
                width:80px
              }
              td:nth-child(6){
                width:80px
              }
              td:nth-child(7){
                width:65px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:22px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:75px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[6]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
    taskMissionSubmissionMonitoringExcelReport: async function  excelReport(data,file_name,filterType)
    {
      const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

      // read excel file from the path
      const workbook = new Excel.Workbook();

      workbook.created =new Date();
      const worksheet = workbook.addWorksheet('Monitoring');
  
      var header= true;
      // for loop to read each record from Products table
      data.forEach(function(row){

          //console.log("inside excel row")
          var string=JSON.stringify(row);
          var json =  JSON.parse(string);

          if(header)
          {
              header=false
              var rowValues = [];
              
             

              if(filterType&&filterType.language==1){
                  rowValues=[
                      "Task",
                      "Mission",
                      "Mission Date",
                      "SubMission",
                      "SubMission Name",
                      'SubMission Date',
                      'Customer Name',
                      "Engineers",
                      "Technicians",
                      'ERP Report Number',
                      'ERP Report Date',
                      'Report Status'

                  ]
              }else if(filterType&&filterType.language==2){
                  rowValues=[
                      "#",
                      "المهمة",
                      "تاريخ المهمة",
                      "المهمة الفرعية",
                      "اسم المهمة الفرعية",
                      'تاريخ المهمة الفرعية',
                      "إسم الزبون",
                      "المهندسيين",
                      "الفنيين",
                      'رقم التقرير',
                      'تاريخ التقرير',
                      'حالة التقرير'
                  ]
              }else{
                  var keys = Object.keys(json);
                  for (let index = 0; index < keys.length; index++) {
                      const element = keys[index];
                      rowValues[index+1]=keys[index]
                  }
              }
              worksheet.addRow(rowValues);
          
          }

          
          // get value for the record
          // const val = data.val()
            let eng_names=row.engineers_names
            let tech_names=row.technicians_names
            if(row.isMissionOrSubMission==0){
              eng_names=row.submission_engineering_name
              tech_names=row.submission_technician_name
            }
          // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.task_id;
            rowValues[1]=row.mission_id;
            rowValues[2]=row.mission_date;
            rowValues[3]=row.sub_mission_id;
            rowValues[4]=row.sub_mission_name;
            rowValues[5]=row.sub_mission_date;
            rowValues[6]=row.customer_name;
            rowValues[7]=eng_names;
            rowValues[8]=tech_names;
            rowValues[9]=row.erp_report_number?row.erp_report_number:null;
            rowValues[10] =row.erp_report_date?row.erp_report_date:null;
            rowValues[11] =row.erp_report_status?row.erp_report_status:'no report';

            worksheet.addRow(rowValues); 
      })

      //write file function to save all the data to the excel template file.
      try {
          result = await workbook.xlsx.writeFile(excel_file_path)
          // console.log("export excel successfully")
          
          return true;
      } catch (error) {
          console.log(error)
          return false;

      }
           

    },
    taskMissionSubmissionMonitoringExcelReportUnlinked: async function  excelReport(data,file_name,filterType)
    {
      const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

      // read excel file from the path
      const workbook = new Excel.Workbook();

      workbook.created =new Date();
      const worksheet = workbook.addWorksheet('Monitoring');
  
      var header= true;
      // for loop to read each record from Products table
      data.forEach(function(row){

          //console.log("inside excel row")
          var string=JSON.stringify(row);
          var json =  JSON.parse(string);

          if(header)
          {
              header=false
              var rowValues = [];
              
             

              if(filterType&&filterType.language==1){
                  rowValues=[
                      "ERP Number",
                      "Row Number",
                      "Status",
                      "Report Date",
                      'Submission Number',
                  ]
              }else if(filterType&&filterType.language==2){
                  rowValues=[
                      'رقم التقرير',
                      'رقم السطر',
                      "الحالة",
                      'تاريخ التقرير',
                      "رقم المهمة الفرعية"
                  ]
              }else{
                  var keys = Object.keys(json);
                  for (let index = 0; index < keys.length; index++) {
                      const element = keys[index];
                      rowValues[index+1]=keys[index]
                  }
              }
              worksheet.addRow(rowValues);
          
          }

          
          // get value for the record
          // const val = data.val()

          // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.ReportNo;
            rowValues[1]=row.RowNum;
            rowValues[2]=row.Status;
            rowValues[3]=row.ReportDate&&row.ReportDate.date?row.ReportDate.date:null;
            rowValues[4]=row.SubmissionNumber;
            worksheet.addRow(rowValues); 
      })

      //write file function to save all the data to the excel template file.
      try {
          result = await workbook.xlsx.writeFile(excel_file_path)
          // console.log("export excel successfully")
          
          return true;
      } catch (error) {
          console.log(error)
          return false;

      }
           

    },
    taskMissionSubmissionMonitoringExcelPDF: async function  pdfReport(data,file_name,filterType)
    {
      try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            let eng_names=row.engineers_names
            let tech_names=row.technicians_names
            if(row.isMissionOrSubMission==0){
              eng_names=row.submission_engineering_name
              tech_names=row.submission_technician_name
            }
            var rowValues = [];
                rowValues={
                    "task_id":row.task_id?row.task_id:'',
                    "mission_id":row.mission_id?row.mission_id:'',
                    'mission_date':row?.mission_date?getDateTime(row.mission_date,'Y-m-d'):'',
                    "sub_mission_id":row.sub_mission_id?row.sub_mission_id:'',
                    "sub_mission_name":row.sub_mission_name?row.sub_mission_name:'',
                    'sub_mission_date':row?.sub_mission_date?getDateTime(row.sub_mission_date,'Y-m-d'):'',
                    "customer_name":row.customer_name?row.customer_name:'',
                    "eng_names":eng_names,
                    "tech_names":tech_names,
                    'erp_report_number':row.erp_report_number?row.erp_report_number:'',
                    'erp_report_date':row.erp_report_date?getDateTime(row.erp_report_date,'Y-m-d'):'',
                    'erp_report_status':row.erp_report_status?row?.erp_report_status:'no report',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "Task",
              "Mission",
              "Mission Date",
              "SubMission",
              "SubMission Name",
              'SubMission Date',
              'Customer Name',
              "Engineers",
              "Technicians",
              'ERP Report Number',
              'ERP Report Date',
              'Report Status'
            ]
        }else {
            HeaderNames=[
              "#",
              "المهمة",
              "تاريخ المهمة",
              "المهمة الفرعية",
              "اسم المهمة الفرعية",
              'تاريخ المهمة الفرعية',
              "إسم الزبون",
              "المهندسيين",
              "الفنيين",
              'رقم التقرير',
              'تاريخ التقرير',
              'حالة التقرير'
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:35px;
              }
              td:nth-child(2){
                width:65px
              }
              td:nth-child(3){
                width:100px
              }
              td:nth-child(4){
                width:100px
              }
              td:nth-child(5){
                width:110px
              }
              td:nth-child(6){
                width:130px
              }
              td:nth-child(7){
                width:130px
              }

              td:nth-child(8){
                width:130px
              }
              td:nth-child(9){
                width:130px
              }

              td:nth-child(10){
                width:130px
              }
              td:nth-child(11){
                width:130px
              }
              td:nth-child(12){
                width:100px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:65px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:110px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[5]}</th>`;

            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[8]}</th>`;

            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[10]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:100px">${HeaderNames[11]}</th>`;

          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A2",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
    },
    taskMissionSubmissionMonitoringExcelPDFUnlinked: async function  pdfReport(data,file_name,filterType)
    {
      try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "ReportNo":row.ReportNo?row.ReportNo:'',
                    "RowNum":row.RowNum?row.RowNum:'',
                    'Status':row?.Status?row.Status:'',
                    "ReportDate":row.ReportDate&&row.ReportDate.date?getDateTime(row.ReportDate.date,'Y-m-d'):null,
                    'SubmissionNumber':row?.SubmissionNumber?row.SubmissionNumber:'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "ERP Number",
              "Row Number",
              "Status",
              "Report Date",
              'Submission Number',
            ]
        }else {
            HeaderNames=[
              'رقم التقرير',
              'رقم السطر',
              "الحالة",
              'تاريخ التقرير',
              "رقم المهمة الفرعية"
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:90px;
              }
              td:nth-child(2){
                width:90px
              }
              td:nth-child(3){
                width:90px
              }
              td:nth-child(4){
                width:90px
              }
              td:nth-child(5){
                width:90px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:90px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:90px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:90px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:90px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:90px">${HeaderNames[4]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A4",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }

    },
    taskLogExcelReport: async function  taskLogExcelReport(data,file_name, filterType)
    {

      const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';

      // read excel file from the path
      const workbook = new Excel.Workbook();

      workbook.created =new Date();
      const worksheet = workbook.addWorksheet('TaskLogs');
  
      var header= true;
      // for loop to read each record from Products table
      data.forEach(function(row){

          //console.log("inside excel row")
          var string=JSON.stringify(row);
          var json =  JSON.parse(string);

          if(header)
          {
              header=false
              var rowValues = [];
              
             

              if(filterType&&filterType.language==1){
                  rowValues=[
                      "#",
                      "Log Type",
                      "Action By User",
                      "Affected User",
                      'Note',
                      'Cteated at',

                  ]
              }else if(filterType&&filterType.language==2){
                  rowValues=[
                      "#",
                      "نوع السجل",
                      "الاجراء بوساطة",
                      "المستخدم المتأثر",
                      'ملاحظة',
                      "تم الانشاء بتاريخ",
                  ]
              }else{
                  var keys = Object.keys(json);
                  for (let index = 0; index < keys.length; index++) {
                      const element = keys[index];
                      rowValues[index+1]=keys[index]
                  }
              }
              worksheet.addRow(rowValues);
          
          }

          
          // get value for the record
          // const val = data.val()

          // // Add a row by sparse Array (assign to columns)
          var rowValues = [];
          rowValues[0]=row.activity_id  
          rowValues[1]=row.log_type  
          rowValues[2]=row.action_by_user       
          rowValues[3]=row.affected_user     
          rowValues[4]=row.note   
          rowValues[5]=row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
          // add row to worksheet
          worksheet.addRow(rowValues);   
      })

      //write file function to save all the data to the excel template file.
      try {
          result = await workbook.xlsx.writeFile(excel_file_path)
          // console.log("export excel successfully")
          
          return true;
      } catch (error) {
          console.log(error)
          return false;

      }
    },
    taskLogsReportPdf: async function  pdfReport(data,file_name,filterType)
    {
      function getdifferent(start, end){
        if (
          !start ||
          start == "0000-00-00 00:00:00" ||
          !end ||
          end == "0000-00-00 00:00:00"
        ) {
          return "--";
        }
        let result = calculateTimeDifference(
          new Date(start),
          new Date(end)
        );
        let finalResult = "";
        if (result?.hours) {
          finalResult += result?.hours + "h ";
        }
        if (result?.minutes) {
          finalResult += result?.minutes + "m";
        }
        return finalResult;
      }
 
      try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "activity_id":row.activity_id?row.activity_id:'',
                    "log_type":row.log_type?row.log_type:'',
                    'action_by_user':row?.action_by_user?row?.action_by_user:'',
                    "affected_user":row.affected_user?row.affected_user:'',
                    'note':row?.note?row?.note:'',
                    "created_at":row.created_at?getDateTime(row.created_at,'Y-m-d H:M:S'):''
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "Log Type",
              "Action By User",
              "Affected User",
              'Note',
              'Cteated at',
            ]
        }else {
            HeaderNames=[
              "#",
              "نوع السجل",
              "الاجراء بوساطة",
              "المستخدم المتأثر",
              'ملاحظة',
              "تم الانشاء بتاريخ",
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:35px;
              }
              td:nth-child(2){
                width:60px
              }
              td:nth-child(3){
                width:80px
              }
              td:nth-child(4){
                width:60px
              }
              td:nth-child(5){
                width:202px
              }
              td:nth-child(6){
                width:60px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:202px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
    },
    createDNDMissionsExcelReport: async function createStyledMissionsExcelReport(data, file_name, filterType) {
      const excel_file_path =
      __dirname + '/../../dist/uploads/temp/excel_reports/' + file_name + '.xlsx';

      // console.log("--------------------------------", excel_file_path)
  
      const workbook = new Excel.Workbook();
  
      workbook.created = new Date();
      const worksheet = workbook.addWorksheet('missions');

      const headerStyle = {
        font: { 
          bold: true,
          size: 18,
          name: 'Arial',
        },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, 
        border: {
            top: { style: 'thin', color: { argb: '000' } },
            bottom: { style: 'thin', color: { argb: '000' } },
            left: { style: 'thin', color: { argb: '000' } },
            right: { style: 'thin', color: { argb: '000' } },
        },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } },
      };

      const cellStyle = {
          font: { 
            size: 14,
            bold: true,
            name: 'Arial',
            size: 14,
          },
          alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
          border: {
              top: { style: 'thin', color: { argb: '000' } },
              bottom: { style: 'thin', color: { argb: '000' } },
              left: { style: 'thin', color: { argb: '000' } },
              right: { style: 'thin', color: { argb: '000' } },
          },
      };

      var header = true;

      // console.log(data)

      data?.forEach(function (row) {
          var string = JSON.stringify(row);
          var json = JSON.parse(string);

          if (header) {
              header = false;
              if (filterType?.language === 1) {
                var rowValues = [
                  "Customer Name",
                  "Location",
                  "Vehicle Number",
                  "Execution DateTime",
                  "Technicians",
                  "Engineer",
                  "Instructions",
                  "Mission ID",
                  "Task ID",
                ];
              } else if (filterType?.language === 2) {
                var rowValues = [
                  "الزبون",
                  "الموقع",
                  "رقم المركبة",
                  "وقت التنفيذ",
                  "الفنيين",
                  "المهندسين",
                  "التفاصيل",
                  "معرف الواجب",
                  "معرف المهمة",
                ];
              } else {
                var rowValues = [
                  "Customer Name",
                  "Location",
                  "Vehicle Number",
                  "Execution DateTime",
                  "Technicians",
                  "Engineer",
                  "Instructions",
                  "Mission ID",
                  "Task ID",
                ];
              }
              const headerRow = worksheet.addRow(rowValues);
              headerRow.eachCell((cell, number) => {
                  cell.style = headerStyle;
              });
          }

          var rowValues = [];
          rowValues[1] = json.customer_name;
          rowValues[2] = json.location;
          rowValues[3] = json.vehicle_number;
          rowValues[4] = json.execute_datetime;
          rowValues[5] = json.technician_names ? json.technician_names.replace(/,/g, '\n') : '';
          rowValues[6] = json.engineer;
          rowValues[7] = json.instructions;
          rowValues[8] = json.mission_id;
          rowValues[9] = json.task_id;
  
          const dataRow = worksheet.addRow(rowValues);
          dataRow.eachCell((cell, number) => {
              cell.style = cellStyle;
          });
      });

      worksheet?.columns?.forEach(column => {
          column.width = 45;
      });
      
      worksheet.getColumn(3).width = 35;
      worksheet.getColumn(5).width = 25;
      worksheet.getColumn(6).width = 25;
      worksheet.getColumn(7).width = 70;
      worksheet.getColumn(8).width = 10;
      worksheet.getColumn(9).width = 10;

      worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.height = 45;
        row.font= {
          bold: true,
          name: 'Arial',
          size: 12,
        }
      });

  
      try {
          result = await workbook.xlsx.writeFile(excel_file_path);
          // console.log("Export excel successfully");
          return true;
      } catch (error) {
          console.log(error);
          return false;
      }
    },
    createDNDMissionsReportPdf: async function  pdfReport(data,file_name,filterType) {
      try {
        const excel_file_path =
          __dirname + "/../../dist/uploads/temp/pdf_reports/" + file_name + ".pdf";

        var listOfData = [];
        var header = true;

        data?.forEach(function (row) {
          var string = JSON.stringify(row);
          var json = JSON.parse(string);

          if (header) {
              header = false;
              if (filterType?.language === 1) {
                var rowValues = [
                  "Customer Name",
                  "Location",
                  "Vehicle Number",
                  "Execution DateTime",
                  "Technicians",
                  "Engineer",
                  "Instructions",
                  "Mission ID",
                  "Task ID",
                ];
              } else if (filterType?.language === 2) {
                var rowValues = [
                  "الزبون",
                  "الموقع",
                  "رقم المركبة",
                  "وقت التنفيذ",
                  "الفنيين",
                  "المهندسين",
                  "التفاصيل",
                  "معرف الواجب",
                  "معرف المهمة",
                ];
              } else {
                var rowValues = [
                  "Customer Name",
                  "Location",
                  "Vehicle Number",
                  "Execution DateTime",
                  "Technicians",
                  "Engineer",
                  "Instructions",
                  "Mission ID",
                  "Task ID",
                ];
              }
              const headerRow = worksheet.addRow(rowValues);
              headerRow.eachCell((cell, number) => {
                  cell.style = headerStyle;
              });
          }

          var rowValues = [];
          rowValues[1] = json.customer_name;
          rowValues[2] = json.location;
          rowValues[3] = json.vehicle_number;
          rowValues[4] = json.execute_datetime;
          rowValues[5] = json.technician_names ? json.technician_names.replace(/,/g, '\n') : '';
          rowValues[6] = json.engineer;
          rowValues[7] = json.instructions;
          rowValues[8] = json.mission_id;
          rowValues[9] = json.task_id;

          console.log(rowValues)

          listOfData.push(rowValues);
          const dataRow = worksheet.addRow(rowValues);
          dataRow.eachCell((cell, number) => {
              cell.style = cellStyle;
          });
        });
        var HeaderNames = [];
        if (filterType && filterType.language == 1) {
          HeaderNames = [
            "Customer Name",
            "Location",
            "Vehicle Number",
            "Execution DateTime",
            "Technicians",
            "Engineer",
            "Instructions",
            "Mission ID",
            "Task ID",
          ];
        } else {
          HeaderNames = [
            "الزبون",
            "الموقع",
            "رقم المركبة",
            "وقت التنفيذ",
            "الفنيين",
            "المهندسين",
            "التفاصيل",
            "معرف الواجب",
            "معرف المهمة",
          ];
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType && filterType.language == 2 ? "rtl" : "ltr"}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:60px;
              }
              td:nth-child(2){
                width:60px
              }
              td:nth-child(3){
                width:80px
              }
              td:nth-child(4){
                width:60px
              }
              td:nth-child(5){
                width:202px
              }
              td:nth-child(6){
                width:60px
              }
              td:nth-child(7){
                width:60px
              }
              td:nth-child(8){
                width:60px
              }
              td:nth-child(9){
                width:60px
              }
            `;
        const templatepath = path.resolve(
          __dirname + "/pdfTamplate",
          "pdfTamplate.html"
        );
        var templateHeader =
          '<div style="width:100%;height:34px; ' +
          (filterType && filterType.language == 2 ? "direction:rtl" : "") +
          '">' +
          (filterType && filterType.language == 2
            ? '<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: ' +
              listOfData.length +
              " </span>"
            : "") +
          '<span style="font-size:25px;width:150px;">' +
          (filterType && filterType.language == 2
            ? "تاريخ التقرير :"
            : "Report Date :") +
          '</span><span style="font-size:25px;margin:0 5px"> ' +
          getDateTime(new Date(), "Y-m-d") +
          "</span>" +
          (filterType && filterType.language == 1
            ? '<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: ' +
              listOfData.length +
              " </span>"
            : "") +
          '</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if (HeaderNames && HeaderNames.length > 0) {
          // HeaderNames.forEach(function(head){
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[1]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:80px">${HeaderNames[2]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[3]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:202px">${HeaderNames[4]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[5]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[6]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[7]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[8]}</th>`;
          templateHeader += `<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:60px">${HeaderNames[9]}</th>`;
        }
        // })
        templateHeader += `</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, "utf8");
        const options = {
          format: "A3",
          orientation: "landscape",
          border: "10mm",
          header: {
            height: "45mm",
            contents: templateHeader,
          },
          footer: {
            height: "10mm",
            contents: {
              // first: 'Cover page',
              // 2: 'Second page', // Any page number is working. 1-based index
              default:
                '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
              last: "Last Page",
            },
          },
          timeout: 60000,
          childProcessOptions: {
            env: {
              OPENSSL_CONF: "/dev/null",
            },
          },
        };
        const keysData = Object.keys(listOfData[0]);
        const document = {
          html: html,
          path: excel_file_path,
          type: "",
          data: {
            reportDate: getDateTime(new Date()),
            datalist: listOfData,
            headers: HeaderNames,
            keysData: keysData,
            customStyle: customStyle,
          },
        };
        let checkComplete = false;
        await pdf
          .create(document, options)
          .then((res) => {
            // console.log('fileDone====>',res);
            checkComplete = true;
          })
          .catch((error) => {
            console.error(error);
            checkComplete = false;
          });
        return checkComplete;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    createSubMissionsMonitoringExcelReport: async function  createSubMissionsMonitoringExcelReport(data,file_name,filterType)
    {

        function getdifferent(start, end){
          if (
            !start ||
            start == "0000-00-00 00:00:00" ||
            !end ||
            end == "0000-00-00 00:00:00"
          ) {
            return "--";
          }
          let result = calculateTimeDifference(
            new Date(start),
            new Date(end)
          );
          let finalResult = "";
          if (result?.hours) {
            finalResult += result?.hours + "h ";
          }
          if (result?.minutes) {
            finalResult += result?.minutes + "m";
          }
          return finalResult;
        }
        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('subMissionsMonitoring');
    
        var header= true;
        // for loop to read each record from Products table
        let count=1;
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        'Csutomer',
                        'Engineers',
                        "Technicians",
                        'Start Time',
                        "Status",
                        "Delayed By",
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                        "#",
                        'اسم الزبون',
                        'المهندسين',
                        "الفنيين",
                        'وقت البدء',
                        "الحالة",
                        "وقت التاخر",
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }

            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row?.sub_mission_id;  
            rowValues[1]=row?.customer_name;
            rowValues[2]=row?.engineer_name;
            rowValues[3]=row?.technician_name;
            rowValues[4]= formatCustomTime(row?.created_at);
            rowValues[5]=row.status_name;
            rowValues[6]=getdifferent(
              row?.mission_execute_datetime,
              row?.created_at
            )
            // add row to worksheet
            count++;
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    createSubMissionsMonitoringPDFReport: async function  pdfReport(data,file_name,filterType)
    {
      function getdifferent(start, end){
        if (
          !start ||
          start == "0000-00-00 00:00:00" ||
          !end ||
          end == "0000-00-00 00:00:00"
        ) {
          return "--";
        }
        let result = calculateTimeDifference(
          new Date(start),
          new Date(end)
        );
        let finalResult = "";
        if (result?.hours) {
          finalResult += result?.hours + "h ";
        }
        if (result?.minutes) {
          finalResult += result?.minutes + "m";
        }
        return finalResult;
      }
 
      try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "sub_mission_id":row.sub_mission_id?row.sub_mission_id:'',
                    "customer_name":row.customer_name?row.customer_name:'',
                    'engineer_name':row?.engineer_name?row?.engineer_name:'',
                    "technician_name":row.technician_name?row.technician_name:'',
                    'start_time':row?.created_at?formatCustomTime(row?.created_at):'',
                    "status_name":row.status_name?row.status_name:'',
                    'delayedBy':getdifferent(
                      row?.mission_execute_datetime,
                      row?.created_at
                    ),
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              'Csutomer',
              'Engineers',
              "Technicians",
              'Start Time',
              "Status",
              "Delayed By",
            ]
        }else {
            HeaderNames=[
              "#",
              'اسم الزبون',
              'المهندسين',
              "الفنيين",
              'وقت البدء',
              "الحالة",
              "وقت التاخر",
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
        
    
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
    
          }
          td{
            white-space: pre-wrap;
          }
          
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
    
          }
    
              td:nth-child(1){
                width:35px;
              }
              td:nth-child(2){
                width:130px
              }
              td:nth-child(3){
                width:120px
              }
              td:nth-child(4){
                width:120px
              }
              td:nth-child(5){
                width:42px
              }
              td:nth-child(6){
                width:42px
              }
              td:nth-child(7){
                width:42px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:130px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:120px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:42px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:42px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:42px">${HeaderNames[6]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A3",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
    },
    mizanListStatusDetailsExport: async function  mizanListStatusDetailsExport(data,file_name,filterType)
    {

        const excel_file_path = __dirname + '/../../dist/uploads/temp/excel_reports/'+file_name+'.xlsx';
        // read excel file from the path
        const workbook = new Excel.Workbook();
        workbook.created =new Date();
        const worksheet = workbook.addWorksheet('users');
    
        var header= true;
        // for loop to read each record from Products table
        data.forEach(function(row){

            //console.log("inside excel row")
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);

            if(header)
            {
                header=false
                var rowValues = [];
                
               

                if(filterType&&filterType.language==1){
                    rowValues=[
                        "#",
                        "Vehicle Id",
                        "Plate Number",
                        "Plate Chart",
                        "Log Id",
                        'Life Cycle Mode',
                        'Wialon Name',
                        'Date Time Empty',
                        'Date Time Full',
                        'Weight In Empty',
                        'Weight In Load',
                        "New Weight",
                        "Last Updated Time"
                    ]
                }else if(filterType&&filterType.language==2){
                    rowValues=[
                      "#",
                      "معرف الالية",
                      "رقم المركبة",
                      "مخطط اللوحة",
                      "معرف السجل",
                      "نمط دورة الحياة",
                      "اسم وايلون",
                      "وقت الفارغ",
                      "وقت المليان",
                      "الوزن بالفارغ",
                      "الوزن بالحمل",
                      "الوزن الجديد",
                      "وقت اخر تحديث"
                    ]
                }else{
                    var keys = Object.keys(json);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        rowValues[index+1]=keys[index]
                    }
                }
                worksheet.addRow(rowValues);
            
            }
            // // Add a row by sparse Array (assign to columns)
            var rowValues = [];
            rowValues[0]=row.id  
            rowValues[1]=row.vehicle_id  
            rowValues[2]=row.platenumber       
            rowValues[3]=row.platechar     
            rowValues[4]=row.log_id     
            rowValues[5]=row.lifecycle_mode     
            rowValues[6]=row.wialon_name
            rowValues[7]=row.date_time_empty     
            rowValues[8]=row.date_time_full
            rowValues[9]=row.weightinempty
            rowValues[10]=row.weightinload 
            rowValues[11]=row.netweight            
            rowValues[12]=row.last_updated_date             

            // add row to worksheet
            worksheet.addRow(rowValues);   
        })

        //write file function to save all the data to the excel template file.
        try {
            result = await workbook.xlsx.writeFile(excel_file_path)
            // console.log("export excel successfully")
            
            return true;
        } catch (error) {
            console.log(error)
            return false;

        }
           

    },
    mizanListStatusDetailsExportPdf: async function  exportPdf(data,file_name,filterType,dataForDate)
    {
        try {
        const excel_file_path = __dirname + '/../../dist/uploads/temp/pdf_reports/'+file_name+'.pdf';
        // console.log('data2==>',data)
        var listOfData=[]
        data.forEach(function(row){
            var string=JSON.stringify(row);
            var json =  JSON.parse(string);
            var rowValues = [];
                rowValues={
                    "id":row.id?row.id:'',
                    "vehicle_id":row.vehicle_id?row.vehicle_id:'',
                    "platenumber":row.platenumber?row.platenumber:'',
                    "platechar":row.platechar?row.platechar:'',
                    'log_id':row.log_id?row.log_id:'',
                    'lifecycle_mode':row.lifecycle_mode?row.lifecycle_mode:'',
                    'wialon_name':row.wialon_name?row.wialon_name:'',
                    'date_time_empty':row.date_time_empty?getDateTime(row.date_time_empty,'Y-m-d H:M:S'):'',
                    'date_time_full':row.date_time_full?getDateTime(row.date_time_full,'Y-m-d H:M:S'):'',
                    'weightinempty':row.weightinempty?row.weightinempty:'',
                    'weightinload':row.weightinload?row.weightinload:'',
                    'netweight':row.netweight?row.netweight:'',
                    'last_updated_date':row.last_updated_date?getDateTime(row.last_updated_date,'Y-m-d'):'',
                }
            listOfData.push(rowValues)
        })
        var HeaderNames=[]
        if(filterType&&filterType.language==1){
            HeaderNames=[
              "#",
              "Vehicle Id",
              "Plate Number",
              "Plate Chart",
              "Log Id",
              'Life Cycle Mode',
              'Wialon Name',
              'Date Time Empty',
              'Date Time Full',
              'Weight In Empty',
              'Weight In Load',
              "New Weight",
              "Last Updated Time"
            ]
        }else {
            HeaderNames=[
              "#",
              "معرف الالية",
              "رقم المركبة",
              "مخطط اللوحة",
              "معرف السجل",
              "نمط دورة الحياة",
              "اسم وايلون",
              "وقت الفارغ",
              "وقت المليان",
              "الوزن بالفارغ",
              "الوزن بالحمل",
              "الوزن الجديد",
              "وقت اخر تحديث"
             ]
        }
        const customStyle = `
        table {
            border-collapse: collapse;
            width: 100%;
            /* table-layout: fixed; */
            margin-top: 15px;
            direction:${filterType&&filterType.language==2?'rtl':'ltr'}
          }
          th, td {
            border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;
            /* white-space: nowrap; */
            word-wrap: break-word;
            word-break: break-all;
          }
          td{
            white-space: pre-wrap;
          }
          th {
            background-color: #dddddd;
            /* word-wrap: break-word;
           word-break: break-all; */
          }
    
              td:nth-child(1){
                width:13px;
              }
              td:nth-child(2){
                width:30px
              }
              td:nth-child(3){
                width:45px
              }
              td:nth-child(4){
                width:35px
              }
              td:nth-child(5){
                width:30px
              }
              td:nth-child(6){
                width:55px
              }
              td:nth-child(7){
                width:45px
              }
              td:nth-child(8){
                width:55px
              }
              td:nth-child(9){
                width:55px
              }
              td:nth-child(10){
                width:55px
              }
              td:nth-child(11){
                width:55px
              }
              td:nth-child(12){
                width:35px
              }
              td:nth-child(13){
                width:55px
              }
            `;
        const templatepath = path.resolve(__dirname+'/pdfTamplate', 'pdfTamplate.html');
        var templateHeader='<div style="width:100%;height:34px; '+(filterType&&filterType.language==2?'direction:rtl':'')+'">'+(filterType&&filterType.language==2?'<span style="font-size:25px;width:150px;margin:0 10px">العدد الكلي: '+listOfData.length+' </span>':'')+'<span style="font-size:25px;width:150px;">'+(filterType&&filterType.language==2?'تاريخ التقرير :':'Report Date :')+'</span><span style="font-size:25px;margin:0 5px"> '+getDateTime(new Date(),'Y-m-d')+'</span>'+(filterType&&filterType.language==1?'<span style="font-size:25px;width:150px;margin:0 10px"> Total Recoard: '+listOfData.length+' </span>':'')+'</div><table style="border-collapse: collapse;width: 100%;"><thead style="width:100%"><tr>';
        if(HeaderNames&&HeaderNames.length>0){
        // HeaderNames.forEach(function(head){
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:10px">${HeaderNames[0]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:30px">${HeaderNames[1]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:45px">${HeaderNames[2]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[3]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:30px">${HeaderNames[4]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[5]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:45px">${HeaderNames[6]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[7]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[8]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[9]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[10]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:35px">${HeaderNames[11]}</th>`;
            templateHeader+=`<th style="border: 1px solid black;padding: 8px;text-align: left;overflow: hidden;width:55px">${HeaderNames[12]}</th>`;
          }
        // })
        templateHeader +=`</tr></thead></table>`;
        const html = fs.readFileSync(templatepath, 'utf8');
        const options = {
            format: "A1",
            orientation: "landscape",
            border: "10mm",
            header: {
                height: "45mm",
                contents: templateHeader
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            },
            timeout:60000,
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
        };
        const keysData = Object.keys(listOfData[0]);
          const document = {
            html: html,
            path: excel_file_path,
            type: '',
            data: {
                reportDate:getDateTime(new Date()),
                datalist: listOfData,
                headers:HeaderNames,
                keysData:keysData,
                customStyle:customStyle
            },
          };
          let checkComplete=false
           await pdf.create(document, options)
            .then((res) => {
              // console.log('fileDone====>',res);
              checkComplete= true
            })
            .catch((error) => {
              console.error(error);
              checkComplete= false;
            });
           return checkComplete;
        } catch (error) {
            console.log(error)
            return false;
        }
           

    },
};