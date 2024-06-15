const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Telegraf, Markup } = require("telegraf");
const { getDateTime } = require("../users/userModels");
const {
  getSubMissionTypes,
  getSubMission,
  createNewSubmission,
  loginUser,
  getMissions,
  getSubMissionById,
  uploadImage,
  getMaxFileCountOfSubMission,
  getImageTypesOfSubM,
  getMissionById,
  getImage,
  getUploadedImageTypes,
  getImages,
} = require("./botHelpers");

const TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(TOKEN);

let userState = {};
let obj = {};
let responded = false;

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  responded = false;

  const user = await loginUser(username);

userState[userId] = {
          selections: [],
          images: [],
          missionsSelection: false,
          subMissionsSelection: false,
          user: user.data,
        };
  try {
    if (user.status) {
      if (!userState[userId]) {
        userState[userId] = {
          selections: [],
          images: [],
          missionsSelection: false,
          subMissionsSelection: false,
          user: user.data,
        };
        ctx.reply(
          "مرحبا بك " + userState[userId]?.user?.name,
          Markup.keyboard([["/missions"]])
            .oneTime()
            .resize()
        );
      } else {
        ctx.reply(
          "مرحبا بك " + userState[userId]?.user?.name,
          Markup.keyboard([["/missions"]])
            .oneTime()
            .resize()
        );
      }
    } else {
      ctx.reply("لست مسجل في الـ" + "Ticket System");
    }
  } catch (error) {
    console.log("start command error", error);
  }
});

bot.command("missions", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  Markup.removeKeyboard(true);
  const userInfo = await loginUser(username);
  responded = false;

  if (!userState[userId]?.user?.name) {
    if (!userState[userId]) {
      userState[userId] = {
        selections: [],
        images: [],
        missionsSelection: false,
        subMissionsSelection: false,
        user: userInfo.data,
      };
    }
  }

  try {
    const userInfo = await loginUser(username);

    if (!userState[userId]) {
      userState[userId] = {
        selections: [],
        images: [],
        missionsSelection: false,
        subMissionsSelection: false,
        user: userInfo.data,
      };
      ctx.reply("مرحبا بك " + userState[userId]?.user?.name);
    }
    if (userInfo != false) {
      obj = {
        jwt: userInfo?.data?.token,
      };

      const missions = await getMissions(obj);

      const options = [];

      for (let i = 0; i < missions?.length; i++) {
        const element = missions[i];
        let mission = [
          {
            text: element.customer_name,
            callback_data: element.mission_id,
          },
        ];
        options.push(mission);
      }

      const keyboard = {
        inline_keyboard: options,
      };

      ctx.reply("<b>مهام اليوم:</b>", {
        reply_markup: JSON.stringify(keyboard),
        parse_mode: "HTML",
      });
      userState[userId].missionsSelection = true;
    } else {
      ctx.reply("لا يمكنك استخدام البوت لانك غير مسجل");
    }
  } catch (error) {
    console.log("missions command error", error);
  }
});

bot.on("callback_query", async (ctx) => {
  const userId = ctx.from.id;
  const choice = ctx.callbackQuery.data;
  const submissionTypes = await getSubMissionTypes(obj);
  responded = false;

  let keyboard = {};
  let options = [];

  if (!userState[userId]) {
    userState[userId] = {
      selections: [],
      images: [],
      missionsSelection: false,
      subMissionsSelection: false,
      selectingImage: false,
      user: {},
    };
  }

  try {
    if (choice == "goback") {
      userState[userId].selectingType = false;
      userState[userId].selectingImage = false;
      userState[userId].driver = false;
      userState[userId].assigningDriverPhone = false;
      userState[userId].assigningDriverName = false;

      const missions = await getMissions(obj);

      if (missions.length) {
        for (let i = 0; i < missions?.length; i++) {
          const element = missions[i];
          let mission = [
            {
              text: element.customer_name,
              callback_data: element.mission_id,
            },
          ];
          options.push(mission);
        }
      } else {
        ctx.reply("إضغط /start اولا");
        return;
      }

      keyboard = {
        inline_keyboard: options,
      };

      ctx.reply("مهام اليوم:", {
        reply_markup: JSON.stringify(keyboard),
      });
      userState[userId].missionsSelection = true;
    } else if (choice.includes("selected_submission_id_")) {
      userState[userId].selectingImage = false;
      userState[userId].subMissionId = JSON.parse(
        choice.split("selected_submission_id_")[1]
      );

      const sub_mission = await getSubMissionById(
        userState[userId].subMissionId,
        userState[userId].user
      );

      const mission = await getMissionById(sub_mission.mission_id, obj);

      let filteredTypes = submissionTypes.filter((type) => {
        return type.id == sub_mission.type_id;
      });

      const messageText = `
إسم المهمة: ${mission.customer_name}
إسم المهمة الفرعية: ${sub_mission.name}
تاريخ الإنشاء: ${getDateTime(sub_mission.created_date, "y-m-d")}
نوع المهمة: ${filteredTypes[0].name}
ملاحظة: ${
        !sub_mission.note === null ||
        (!sub_mission.note.includes("undefined") && sub_mission.note !== "null")
          ? sub_mission.note
          : "لا يوجد"
      }
الحالة: ${
        sub_mission.status_id === 1
          ? "قيد العمل"
          : sub_mission.status_id === 2
          ? "أنجزت"
          : "الغيت"
      }
سبب الالغاء: ${
        sub_mission.cancel_reason.length && sub_mission.cancel_reason !== "null"
          ? sub_mission.cancel_reason
          : "لا يوجد"
      }
إسم السائق: ${
        !sub_mission.driver_name === null ||
        !sub_mission.driver_name.includes("undefined")
          ? sub_mission.driver_name
          : "لا يوجد"
      }
رقم الهاتف: ${
        !sub_mission.phone === null ||
        (!sub_mission.phone.includes("undefined") &&
          sub_mission.phone !== "null")
          ? sub_mission.phone
          : "لا يوجد"
      }
        `;

      options = [
        [
          {
            text: "رجوع الى قائمة المهام",
            callback_data: "goback",
            animated: false,
          },
          {
            text: "رجوع الى المهمة",
            callback_data: "goback_mission",
            animated: false,
          },
        ],
        [
          {
            text: "اضافة صور",
            callback_data: "addImages",
            animated: false,
          },
          {
            text: "عرض الصور",
            callback_data: "showImages",
            animated: false,
          },
        ],
      ];

      keyboard = {
        inline_keyboard: options,
      };

      ctx.reply(messageText, {
        reply_markup: JSON.stringify(keyboard),
      });
    } else if (choice === "showImages") {
      const sub_mission = await getSubMissionById(
        userState[userId].subMissionId,
        userState[userId].user
      );

      const images = await getImages(
        userState[userId].subMissionId,
        userState[userId].user
      );

      const folderPath = "./dist/uploads/missions/sub_missions";

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      if (images.length) {
        ctx.reply("الصور الخاصة بالمهمة ( " + sub_mission.name + " )");

        // console.log(images)

        images.forEach(async (image) => {
          const imagePath = path.join(folderPath, image.name);
          const imageDetails = `
            الصورة الخاصة بالمهمة الفرعية ${image?.sub_mission_name}
نوع المهمة الفرعية: ${image?.sub_m_type}
نوع الصورة: ${image?.sub_m_image_type}`
          ctx.reply(image.sub_m_image_type);
          ctx
            .replyWithPhoto({ source: imagePath }, { caption: imageDetails })
            .then(() => {})
            .catch((error) => {
              console.error("Error sending image:", error);
            });
        });
      } else {
        ctx.reply(
          'لا يوجد صور خاصة بهذه المهمة الفرعية, إبدأ بإضافة الصور بالضغط على زر "إضافة صور"'
        );
      }
    } else if (choice == "createsubmission") {
      userState[userId].selectingType = true;

      options = [
        [
          {
            text: "رجوع",
            callback_data: "goback_mission",
            animated: false,
          },
        ],
      ];

      keyboard = {
        inline_keyboard: options,
      };

      ctx.reply("ادخل رقم المركبة او اسم المهمة الفرعية:", {
        reply_markup: JSON.stringify(keyboard),
      });
    } else if (userState[userId].missionsSelection) {
      userState[userId].selectingImage = true;
      userState[userId].missionsSelection = false;
      const sub_missions = await getSubMission(obj, choice);
      userState[userId].mission_id = choice;
      const suboptions = [];
      const mission = await getMissionById(choice, obj);

      for (let i = 0; i < sub_missions?.length; i++) {
        const element = sub_missions[i];
        let sub_mission = [
          {
            text: element.name,
            callback_data: "selected_submission_id_" + element.id,
          },
        ];
        suboptions.push(sub_mission);
      }

      suboptions.push([
        {
          text: "إنشاء مهمة فرعية ➕",
          callback_data: "createsubmission",
          animated: false,
        },
        {
          text: "رجوع ↪️",
          callback_data: "goback",
          animated: false,
        },
      ]);

      keyboard = {
        inline_keyboard: suboptions,
      };

      ctx.reply(
        "المهام الفرعية الخاصة بالمهمة " +
          '"' +
          mission?.customer_name +
          '"' +
          ":",
        {
          reply_markup: JSON.stringify(keyboard),
        }
      );
    } else if (choice == "addImages") {
      const sub_mission = await getSubMissionById(
        userState[userId].subMissionId,
        userState[userId].user
      );

      const uploadedImages = await getUploadedImageTypes(
        userState[userId].subMissionId,
        userState[userId].user
      );

      const imageTypes = await getImageTypesOfSubM(sub_mission?.type_id, obj);

      const options = imageTypes.map((item) => {
        const added = uploadedImages.some(
          (itm) => item.image_type_id === itm.sub_m_image_type_id
        );
        return [
          {
            text:
              item.type +
              (item.is_mandatory ? " - إجباري" : "") +
              (added ? " (مضافة)" : ""),
            callback_data: !added
              ? item.type + "_selected_image_type_" + item.image_type_id
              : "added_" + item.type,
            animated: false,
          },
        ];
      });

      options.push([
        {
          text: "رجوع الى قائمة المهام",
          callback_data: "goback",
          animated: false,
        },
        {
          text: "رجوع الى المهمة الفرعية",
          callback_data:
            "selected_submission_id_" +
            JSON.stringify(userState[userId].subMissionId),
          animated: false,
        },
      ]);

      keyboard = {
        inline_keyboard: options,
      };

      ctx.reply("إبدأ بتحديد الصور...", {
        reply_markup: JSON.stringify(keyboard),
      });
    } else if (choice == "assign") {
      userState[userId].selectingType = false;
      ctx.reply("اذكر اسم السائق...");
      userState[userId].assigningDriverName = true;
      userState[userId].assigningDriverPhone = false;
    } else if (choice == "add_title") {
      ctx.reply("ابدأ بكتابة العنوان...");
    } else if (choice == "add_note") {
      ctx.reply("ابدأ بكتابة الملاحظة...");
    } else if (choice == "goback_mission") {
      userState[userId].selectingType = false;
      userState[userId].selectingImage = false;
      userState[userId].driver = false;
      userState[userId].assigningDriverPhone = false;
      userState[userId].assigningDriverName = false;
      const sub_missions = await getSubMission(
        obj,
        userState[userId].mission_id
      );
      const suboptions = [];

      for (let i = 0; i < sub_missions?.length; i++) {
        const element = sub_missions[i];
        let sub_mission = [
          {
            text: element.name,
            callback_data: "selected_submission_id_" + element.id,
          },
        ];
        suboptions.push(sub_mission);
      }

      suboptions.push([
        {
          text: "إنشاء مهمة فرعية ➕",
          callback_data: "createsubmission",
          animated: false,
        },
        {
          text: "رجوع ↪️",
          callback_data: "goback",
          animated: false,
        },
      ]);

      keyboard = {
        inline_keyboard: suboptions,
      };

      ctx.reply("المهام الفرعية:", {
        reply_markup: JSON.stringify(keyboard),
      });
    } else if (choice == "reSelectType") {
      const submissionTypes = await getSubMissionTypes(obj);

      const options = submissionTypes.map((type) => [
        { text: type.name, callback_data: type.id },
      ]);

      options.push([
        { text: "إلغاء العملية", callback_data: "goback" },
        { text: "العودة الى المهمة", callback_data: "goback_mission" },
      ]);
      ctx.replyWithMarkdown("رجائاً اختر نوع المهمة الفرعية:", {
        reply_markup: {
          inline_keyboard: options,
        },
      });
      userState[userId].driver = true;
    } else if (userState[userId].driver) {
      userState[userId].driver = false;

      var typeExists = submissionTypes.some((type) => type.id == choice);

      if (typeExists) {
        userState[userId].submissionType = choice;
      }

      options = [
        [
          {
            text: "تعديل نوع المهمة؟",
            callback_data: "reSelectType",
            animated: false,
          },
          {
            text: "ذكر إسم السائق",
            callback_data: "assign",
            animated: false,
          },
        ],
        [
          {
            text: "تخطي وتسجيل المهمة",
            callback_data: "skip_driver",
            animated: false,
          },
        ],
      ];

      keyboard = {
        inline_keyboard: options,
      };

      let filteredTypes = submissionTypes.filter((type) => {
        return type.id == userState[userId].submissionType;
      });

      await ctx.reply(
        "تم اختيار: " +
          '"' +
          filteredTypes[0]?.name +
          '", ' +
          "اتريد ذكر إسم السائق؟",
        {
          reply_markup: JSON.stringify(keyboard),
        }
      );
    } else if (choice.includes("selected_image_type_")) {
      const parts = choice.split("_");
      const typeName = parts[0];
      const typeId = JSON.parse(parts[parts.length - 1]);
      userState[userId].selectedImageTypeId = typeId;
      userState[userId].selectedImageTypeName = typeName;

      if (typeof userState[userId].selectedImageTypeId === "number") {
        ctx.reply(
          "إرفع صورة: <b>" +
            typeName +
            `</b>

<b>ملاحظة:</b> يرجى رفع صورة واحدة, في حال رفع اكثر من صورة سيتم رفع الصورة الاولى فقط.`,
          {
            parse_mode: "HTML",
          }
        );
      }
      const sub_mission = await getSubMissionById(
        userState[userId].subMissionId,
        userState[userId].user
      );

      let filteredTypes = submissionTypes.filter((type) => {
        return type.id == sub_mission.type_id;
      });

      userState[userId].submissionType = filteredTypes[0].id;

      userState[userId].selectingImage = true;
    } else if (choice.includes("added")) {
      const type = choice.split("_")[1];
      ctx.reply(`لقد تم اضافة الصورة من النوع <b>${type}</b> بالفعل!`, {
        parse_mode: "HTML",
      });
    }
    if (choice == "submit" || choice == "skip_driver") {
      userState[userId].selectingType = false;
      userState[userId].assigningDriverPhone = false;
      try {
        const mission_id = userState[userId].mission_id;
        const type_id = userState[userId].submissionType;
        const sub_mission = {
          mission_id: mission_id,
          name: userState[userId].submissionName,
          type_id: type_id,
          driver_name: userState[userId].driverName
            ? userState[userId].driverName
            : "",
          phone: userState[userId].driverPhone
            ? userState[userId].driverPhone
            : "",
          eng_id: 31,
        };
        const data = await createNewSubmission(
          sub_mission,
          userState[userId].user
        );
        if (data.insertId) {
          userState[userId].submissionName = null;
          userState[userId].submissionType = null;
          userState[userId].driverName = null;
          userState[userId].driverPhone = null;
          userState[userId].subMissionId = data.insertId;
          options = [
            [
              {
                text: "الرجوع الى المهمة",
                callback_data: "goback_mission",
                animated: false,
              },
              {
                text: "إضافة صور",
                callback_data: "addImages",
                animated: false,
              },
            ],
          ];

          keyboard = {
            inline_keyboard: options,
          };

          ctx.reply("تم تسجيل مهمة فرعية جديدة...", {
            reply_markup: JSON.stringify(keyboard),
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("message", async (ctx) => {
  const userId = ctx.from.id;

  if (!userState[userId]) {
    userState[userId] = {
      selections: [],
      images: [],
      missionsSelection: false,
      subMissionsSelection: false,
      selectingImage: false,
      user: {},
    };
  }

  if (ctx.message.photo && !responded && userState[userId].selectingImage) {
    userState[userId].selectingImage = false;
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    responded = true;

    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;

    const response = await axios.get(fileUrl, { responseType: "stream" });

    const uploadPath = path.join(
      __dirname,
      "../../../dist/uploads/missions/sub_missions"
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const extension = ".jpg";

    let maxCount = getMaxFileCountOfSubMission(
      uploadPath,
      userState[userId].subMissionId
    );

    userState[userId].imageCount = maxCount === null ? 0 : maxCount + 1;

    const fileName = `sub_missions_${userState[userId]?.user?.user_id}_${
      userState[userId].subMissionId
    }_${getDateTime(null, "Y_M_D-H_M_S")}_${
      userState[userId].imageCount
    }${extension}`;

    userState[userId].imageName = fileName;

    const filePath = path.join(uploadPath, fileName);

    response.data.pipe(fs.createWriteStream(filePath));

    var modiFile = {
      ...file,
      file_name: fileName,
    };

    if (modiFile.file_name) {
      const data = await uploadImage(
        {
          file_name: modiFile.file_name,
          image_type: userState[userId].selectedImageTypeId,
          sub_m_type: userState[userId].submissionType,
          sub_mission_id: userState[userId].subMissionId,
        },
        userState[userId].user
      );
      if (data.insertId) {
        userState[userId].imageId = data.insertId;
        const options = [
          [
            { text: "الرجوع الى قائمة المهام", callback_data: "goback" },
            {
              text: "الرجوع الى المهمة الفرعية",
              callback_data:
                "selected_submission_id_" +
                JSON.stringify(userState[userId].subMissionId),
            },
          ],
        ];

        const keyboard = {
          inline_keyboard: options,
        };

        ctx.reply(
          `تم رفع الصورة (${userState[userId].selectedImageTypeName}) للمهمة الفرعية...`,
          {
            reply_markup: JSON.stringify(keyboard),
          }
        );
      }
    }
    userState[userId].images.push(modiFile);
  } else if (!ctx.message.photo && responded) {
    ctx.reply("لقد تم تسجيل صورة واحدة, لا يمكنك رفع عدة صور مرة واحدة");
  } else {
    const submissionTypes = await getSubMissionTypes(obj);
    const text = ctx.message.text;

    if (userState[userId] && userState[userId].selectingType) {
      const submissionName = text;
      userState[userId].submissionName = submissionName;
      userState[userId].selectingType = false;

      const options = submissionTypes.map((type) => [
        { text: type.name, callback_data: type.id },
      ]);

      options.push([
        { text: "العودة الى قائمة المهام", callback_data: "goback" },
        { text: "العودة الى المهمة", callback_data: "goback_mission" },
      ]);

      ctx.replyWithMarkdown("رجائاً اختر نوع المهمة الفرعية:", {
        reply_markup: {
          inline_keyboard: options,
        },
      });
      userState[userId].driver = true;
    } else if (userState[userId].assigningDriverName) {
      userState[userId].driverName = text;
      userState[userId].assigningDriverName = false;

      const options = [
        [
          {
            text: "تخطي وإرسال المهمة الفرعية",
            callback_data: "skip_driver",
            animated: false,
          },
        ],
      ];

      ctx.reply("اذكر رقم الهاتف الخاص بالسائق...", {
        reply_markup: {
          inline_keyboard: options,
        },
      });
      userState[userId].assigningDriverPhone = true;
    } else if (userState[userId].assigningDriverPhone) {
      const phoneRegex = /^(07[5789]\d{8})$/;

      const test = phoneRegex.test(text);

      if (test) {
        userState[userId].driverPhone = text;
        const options = [
          [
            {
              text: "إرسال المهمة الفرعية",
              callback_data: "submit",
              animated: false,
            },
          ],
        ];

        ctx.reply("لقد تم تسجيل كل البيانات...", {
          reply_markup: {
            inline_keyboard: options,
          },
        });
      } else {
        ctx.reply("اذكر رقم هاتف صالح رجائاً");
      }
    }
  }
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.launch();

module.exports = {
  bot,
};
