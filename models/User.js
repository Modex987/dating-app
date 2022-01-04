require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../errors");

const userSchema = new mongoose.Schema(
      {
            first_name: {
                  type: String,
                  required: [true, "First name is required"],
                  maxLength: 16,
            },

            last_name: {
                  type: String,
                  required: [true, "Last name is required"],
                  maxLength: 16,
            },

            username: {
                  type: String,
                  unique: true,
                  required: [true, "Username is required"],
                  maxLength: 16,
            },

            email: {
                  type: String,
                  required: [true, "Email is required"],
                  unique: true,
                  match: [
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        "Please enter a valid email",
                  ],
                  maxLength: 320,
            },

            password: {
                  type: String,
                  required: [true, "Password is required"],
            },

            media: {
                  type: [String],
                  validate: [
                        (val) => val.length < 6,
                        "only 5 photos can be uploaded",
                  ],
            },

            isAdmin: {
                  type: Boolean,
                  default: false,
            },

            details: {
                  location: {
                        country: {
                              type: String,
                        },

                        region: {
                              type: String,
                        },

                        city: {
                              type: Number,
                        },

                        timezone: {
                              type: String,
                        },

                        stuff: [],
                  },

                  marital_status: {
                        type: Number,
                        enum: [...Array(4).keys()],
                  },

                  birth_day: {
                        type: Date,
                        get: (date) => {
                              if (date) return date.toISOString().split("T")[0];
                        },
                  },

                  height: {
                        type: Number,
                        min: 55,
                        max: 280,
                  },

                  weight: {
                        type: Number,
                        min: 5,
                        max: 1000,
                  },

                  hair_color: {
                        type: Number,
                        enum: [...Array(13).keys()],
                  },

                  eye_color: {
                        type: Number,
                        enum: [...Array(6).keys()],
                  },

                  children: {
                        type: Number,
                        enum: [...Array(5).keys()],
                  },

                  relegion: {
                        type: Number,
                        enum: [...Array(9).keys()],
                  },

                  smoking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                  },

                  drinking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                  },

                  education: {
                        type: String,
                        maxLength: 32,
                  },

                  ocupation: {
                        type: String,
                        maxLength: 32,
                  },

                  languages: [
                        {
                              type: Number,
                              enum: [...Array(14).keys()],
                        },
                  ],

                  partner_age: {
                        from: { type: Number, min: 18, max: 70 },
                        to: { type: Number, min: 18, max: 70 },
                  },

                  about_me: {
                        type: String,
                        maxlength: 124,
                  },

                  about_partner: {
                        type: String,
                        maxlength: 124,
                  },
            },
      },
      { timestamps: true }
);

userSchema.post("validate", function () {
      if (this.password.length < 6 || this.password.length > 32)
            throw new BadRequestError(
                  "password length should be between 6 and 32"
            );
});

// @ts-ignore
userSchema.pre("save", async function () {
      // hashing the password
      let salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passwd) {
      // @ts-ignore
      let isValid = await bcryptjs.compare(passwd, this.password);
      return isValid;
};

userSchema.virtual("public").get(function () {
      return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            email: this.email,
            profile_photo: this.media.length ? this.media[0] : null,
      };
});

module.exports = mongoose.model("User", userSchema);
