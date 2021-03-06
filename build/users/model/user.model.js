'use strict';
var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
                ? function (o, m, k, k2) {
                          if (k2 === undefined) k2 = k;
                          Object.defineProperty(o, k2, {
                                  enumerable: true,
                                  get: function () {
                                          return m[k];
                                  },
                          });
                  }
                : function (o, m, k, k2) {
                          if (k2 === undefined) k2 = k;
                          o[k2] = m[k];
                  });
var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
                ? function (o, v) {
                          Object.defineProperty(o, 'default', { enumerable: true, value: v });
                  }
                : function (o, v) {
                          o['default'] = v;
                  });
var __importStar =
        (this && this.__importStar) ||
        function (mod) {
                if (mod && mod.__esModule) return mod;
                var result = {};
                if (mod != null)
                        for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                __setModuleDefault(result, mod);
                return result;
        };
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
var mongoose_1 = __importStar(require('mongoose'));
var userShema = new mongoose_1.Schema(
        {
                fullName: {
                        type: mongoose_1.Schema.Types.String,
                        required: true,
                },
                email: {
                        type: mongoose_1.Schema.Types.String,
                        required: true,
                },
                password: {
                        type: mongoose_1.Schema.Types.String,
                        required: true,
                },
                information: {
                        type: mongoose_1.Schema.Types.String,
                        required: false,
                },
                interest: {
                        type: mongoose_1.Schema.Types.Array,
                        required: false,
                },
                mobile_phone: {
                        type: mongoose_1.Schema.Types.String,
                        required: false,
                },
                followers: {
                        type: mongoose_1.Schema.Types.Array,
                        required: false,
                },
                following: {
                        type: mongoose_1.Schema.Types.Array,
                        required: false,
                },
                posts: {
                        type: mongoose_1.Schema.Types.Array,
                        required: false,
                },
                image: {
                        type: mongoose_1.Schema.Types.String,
                        required: false,
                },
                id: {
                        type: mongoose_1.Schema.Types.String,
                        required: false,
                },
                proiritety: {
                        type: mongoose_1.Schema.Types.Boolean,
                        required: false,
                },
        },
        {
                collection: 'users',
                timestamps: true,
        },
);
var User = mongoose_1.default.model('User', userShema);
exports.User = User;
