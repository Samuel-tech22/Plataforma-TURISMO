const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

// Definir el esquema del usuario
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: [4, "user name must have at least 4 characters"],
      unique: true,
      uniqueCaseInsensitive: true,
      uniqueError: "Este nombre de usuario ya está en uso",
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (val) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
        message: "Please enter a valid email",
      },
      uniqueError: "This email is already registered",
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (val) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/.test(
            val
          ),
        message:
          "Password must have at least 8 characters with one uppercase, one lowercase, one number, one special character",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.plugin(uniqueValidator, {
  message: "Ya existe un registro con el valor '{VALUE}' en el campo '{PATH}'.",
});

UserSchema.virtual("confirmPassword")
  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

UserSchema.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Password must match confirm password");
  }
  next();
});

UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    next();
  });
});

// Crear el modelo de usuario basado en el esquema
const User = mongoose.model("User", userSchema);

module.exports = User;
