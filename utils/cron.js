
// cron.schedule("1 1 20 18,19,20,21,22,23,24,25 * *", () => {
//     const chatId = keys.idMasha;
//     const monthStart = new Date(moment().startOf('month').toDate());
//     const monthEnd = new Date(moment().endOf('month').toDate());
//
//     new Promise((resolve, reject) => {
//         WaterService.findOne({
//                 chatId,
//                 date: {
//                     $gt: monthStart,
//                     $lt: monthEnd
//                 }
//             }
//             , (err, waterService) => {
//                 if (err) reject(err);
//                 resolve(waterService)
//             });
//     })
//         .then(
//             waterService => {
//                 if (!waterService) {
//                     bot.telegram.sendMessage(chatId, 'Отправь данные о водоснабжении.');
//                 }
//             },
//             err => {
//                 bot.telegram.sendMessage(chatId, `Возникла ошибка: ${err}`)
//             }
//         );
// });
