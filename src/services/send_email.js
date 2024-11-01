const cron = require("node-cron");

var executeQuery = require("../helper/common").executeQuery;
var getDateTime = require("../helper/common").getDateTime;
var getTasks = require("../api/tasks/taskModels").getTasks;
var getComments = require("../api/comments/commentModels").getComments;

const send = require("gmail-send")({
  user: "mohanadwenkgps@gmail.com",
  pass: "uhabdzrttzcpybha",
});

var mailOptions = {
  from: "mohanadwenkgps@gmail.com",
  to: ["muhanad.sabah@wenkgps.com", "muhanad.sabah93@gmail.com"],
  subject: "Tasks statuses",
};
function sentEmail() {
  getTasks(true, false, 81, getDateTime("2020-05-12"), getDateTime(), (res) => {
    getComments(res[0].task_id, (comments) => {});
  });
}

function createHTMLbody(taskData, commentData, callback) {
  return `<div style=" border: 1px dashed;padding: 5px;">
            <span><b>Task details</b></span>
            <div style="margin-left: 20px;">
              ${createTaskDetailsTable(taskData)}
            </div>
            <div>
              <span><b>Comments: </b></span>
              <div style="margin-left: 20px;">
                <table>
                  ${createCommentDetails(commentData)}
                </table>
              </div>
            </div>
          </div>  
            `;
  // for(const task of taskData){

  // }
}

var createTaskDetailsTable = (task) => {
  return `<table> 
            <tr>
                <td><strong>Task Id:</strong> </td>
                <td>${task.task_id}</td>
            </tr>
            <tr>
                <td><strong>Task Name:</strong> </td>
                <td>${task.task_title}</td>
            </tr>
            <tr>
                <td><strong>Task type:</strong> </td>
                <td>${task.task_type}</td>
            </tr>
            <tr>
                <td><strong>Status:</strong> </td>
                <td>${task.status}</td>
            </tr>
            <tr>
                <td><strong>Issuer:</strong> </td>
                <td>${task.issuer_user.name}</td>
            </tr>
            <tr>
                <td><strong>Monitor:</strong> </td>
                <td>${task.monitor.name}</td>
            </tr>
            <tr>
                <td><strong>Created at:</strong> </td>
                <td>${getDateTime(task.created_at)}</td>
            </tr>
            <tr>
                <td><strong>Description:</strong> </td>
                <td>${task.description}</td>                
            </tr>
            <tr>
                <td><strong>Assigners</strong> </td>
                <td>${task.assigners.toString()}</td>
            </tr>
        </table>`;
};

var createCommentDetails = (comment) => {
  return `
    <tr>
      <td>
          <span><b>${comment.commenter_name}</b> ${getDateTime(
    comment.comment_dateTime
  )}: ${comment.comment_text}</span>
      </td>
    </tr>      
  `;
};

module.exports = { sentEmail };
