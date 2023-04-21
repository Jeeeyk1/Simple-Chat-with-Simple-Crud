const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  findAllUser,
  deletUser,
  editUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.get("/all", findAllUser);
router.delete("/delete/:id", deletUser);
router.put("/edit/:id", editUser);

module.exports = router;
