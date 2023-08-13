import mongosee, { Schema, Model, Document } from 'mongoose';

type ConstantsModel = Document & {
    typesEvents: string[];
    danceStyles: string[];
    countries: string[];
};

const constansShema = new Schema(
  {
    typesEvents: {
      type: Schema.Types.Array,
      required: false,
    },
    danceStyles: {
      type: Schema.Types.Array,
      required: false,
    },
    countries: {
      type: Schema.Types.Array,
      required: false,
    },
  },
  {
    collection: 'appConstans',
  },
);

const Constans: Model<ConstantsModel> = mongosee.model<ConstantsModel>('Constants', constansShema);
export { Constans, ConstantsModel };
