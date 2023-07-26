// import mongosee, { Schema, Model, Document } from 'mongoose';

// type NoticeModel = Document & {
//         message: string;
//         user: string;
//         title: string;
//         type: string;
//         createdAt: number;
// };

// const noticeSchema = new Schema(
//   {
//     message: {
//       type: Schema.Types.String,
//       required: true,
//     },
//     user: {
//       type: Schema.Types.String,
//       required: true,
//     },
//     title: {
//       type: Schema.Types.String,
//       required: false,
//     },
//     type: {
//       type: Schema.Types.String,
//       required: false,
//     },
//     createdAt: {
//       type: Schema.Types.Number,
//       required: false,
//     },
//   },
//   {
//     collection: 'notice',
//   },
// );

// const Notice: Model<NoticeModel> = mongosee.model<NoticeModel>('Notice', noticeSchema);
// export { Notice, NoticeModel };
