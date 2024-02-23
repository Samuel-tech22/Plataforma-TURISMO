const User = require("../models/user.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = process.env.JWT_SECRET_KEY;

//Crear
module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201);
    res.json(newUser);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json(error);
  }
};

//actualizar

module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200);
    res.json(updatedUser);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

//eliminar

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.deleteOne({ _id: id });
    res.status(200);
    res.json(deletedUser);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json(error);
  }
};

//LOGIN & lOGOUT
module.exports.login = async (req, res) => {
  try {
    /* Buscar el usuario */
    const user = await User.findOne({ email: req.body.email });
    /* Si no existe paro y retorno resultado */
    if (user === null) {
      res.status(404);
      res.json({
        errors: {
          email: {
            message: "user not found",
          },
        },
      });
      return;
    }
    /* Si existe revisamos contraseñas */
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    /* Si contraseña no coincide paro y retorno resultado */
    if (validatePassword === false) {
      res.status(400);
      res.json({
        errors: {
          password: {
            message: "Wrong Password",
          },
        },
      });
      return;
    }
    /* Si contraseña ok generar jwt y cookie */
    const newJWT = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      secretKey,
      { expiresIn: "10y" }
    );

    res.cookie("userToken", newJWT, {
      /* domain: "testdomain.com", */
      httpOnly: true,
    });
    res.status(200);
    const rsUser = {
      _id: user._id,
      role: user.role,
      username: user.username,
    };

    res.json({ user: rsUser, token: newJWT });
  } catch (error) {
    res.status(500);
    res.json({
      errors: {
        server: {
          message: error,
        },
      },
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.status(200);
    res.clearCookie("userToken");
    res.json({ message: "Logout Succesfully" });
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json(error);
  }
};
