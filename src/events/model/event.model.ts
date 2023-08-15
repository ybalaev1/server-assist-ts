import mongosee, { Schema, Model, Document, _AllowStringsForIds } from 'mongoose';

type EventCreatedModel = Document & {
  title: string;
  description: string;
  attendedPeople: Array<{userUid: string}>;
  categories: string[]
  communityUid: string;
  id: string;
  creator: {
    uid: string;
    image: string;
    name: string;
  };
  eventDate: {
    start: string;
    end: string;
    time: number;
  };
  eventUid: string;
  location: string;
  place: string;
  typeEvent: string;
  images: string[];
  price: string;
  userImages: Array<{userImage: object}>;

};

const eventShema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    attendedPeople: {
      type: Schema.Types.Array,
      required: false,
    },
    categories: {
      type: Schema.Types.Array,
      required: true,
    },
    images: {
      type: Schema.Types.Array,
      required: false,
    },
    communityUid: {
      type: Schema.Types.String,
      required: false,
    },
    creator: {
      type: Schema.Types.Mixed,
      required: false,
    },
    eventDate: {
      type: Schema.Types.Mixed,
      required: false,
    },
    eventUid: {
      type: Schema.Types.String,
      required: false,
    },
    location: {
      type: Schema.Types.String,
      required: true,
    },
    place: {
      type: Schema.Types.String,
      required: true,
    },
    typeEvent: {
      type: Schema.Types.String,
      required: true,
    },
    id: {
      type: Schema.Types.String,
      required: false,
    },
    price: {
      type: Schema.Types.String,
      required: false,
    },
    userImages: {
      type: Schema.Types.Array,
      required: false,
    },
    
  },
  {
    collection: 'events',
  },
);

const Event: Model<EventCreatedModel> = mongosee.model<EventCreatedModel>('Event', eventShema);
export { Event, EventCreatedModel };
