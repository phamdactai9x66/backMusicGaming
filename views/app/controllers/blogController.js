const modelBlog = require("../models/blog");
let {
  statusF,
  statusS,
  localhost,
  extensionImage,
} = require("../validator/variableCommon");
let mongoose = require("mongoose");
const formidable = require("formidable");
let path = require("path");

class blogController {
  // lấy dữ liệu theo query nhé ae
  index(req, res, next) {
    let { _page, _limit, _id, id_User, id_CategoryBlog, title, status } = req.query;
    console.log(req.headers)
    let condition = {};
    if (_id) {
      condition = {
        ...condition,
        _id: mongoose.Types.ObjectId(_id),
      };
    }
    if (id_User) {
      condition = {
        ...condition,
        id_User: mongoose.Types.ObjectId(id_User),
      };
    }
    if (id_CategoryBlog) {
      condition = {
        ...condition,
        id_CategoryBlog: mongoose.Types.ObjectId(id_CategoryBlog),
      };
    }
    if (title) {
      condition = {
        ...condition,
        title: new RegExp(`${title}`, 'i'),
      };
    }
    if (status) {
      condition = {
        ...condition,
        status: status,
      };
    }

    modelBlog.find(condition).sort('-createdAt').limit(_limit * 1).skip((_page - 1) * _limit).select({}).exec((err, data) => {
      if (err) {
        return res.json({
          message: "Get blog failed.",
          status: statusF,
          data: [],
        });
      } else {
        return res.json({
          message: "Get blog successfully.",
          status: statusS,
          data: data,
        });
      }
    });
  }
  createBlog(req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../public/uploads");
    form.keepExtensions = true;
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.multiples = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.json({
          message: "Error 400. Create new blog failed.",
          data: [],
          status: statusF,
        });
      }

      const { title, content, id_User, id_CategoryBlog } = fields;

      if (!title || !content || !id_User || !id_CategoryBlog) {
        return res.json({
          message:
            "Please input full information. Vui lòng nhập đủ các trường.",
          data: [],
          status: statusF,
        });
      }

      let condition = {
        title: title,
      };

      modelBlog.findOne(condition).exec((err, blogExisted) => {
        if (err) {
          return res.json({
            message: "Error: " + err,
            data: [],
            status: statusF,
          });
        }

        if (blogExisted) {
          return res.json({
            message: "This blog was existed in database.",
            data: [],
            status: statusF,
          });
        }

        const uploadFile = files["image"];

        const indexOfPath = uploadFile.path.indexOf("uploads");
        const cutPath = uploadFile.path.slice(indexOfPath);

        const checkImage = cutPath.split(".")[1];
        if (!checkImage) {
          return res.json({
            status: statusF,
            data: [],
            message: `We don't allow file is blank!`,
          });
        }
        if (!extensionImage.includes(checkImage)) {
          return res.json({
            status: statusF,
            data: [],
            message: `We just allow audio extension jpg, jpeg, bmp,gif, png`,
          });
        }

        const data = {
          ...fields,
          image: `${localhost}${cutPath}`,
          id_User: mongoose.Types.ObjectId(id_User),
          id_CategoryBlog: mongoose.Types.ObjectId(id_CategoryBlog),
        };

        let createPlaylist = new modelBlog(data);
        createPlaylist.save((err, data) => {
          if (err) {
            return res.json({
              message: err,
              status: statusF,
              data: [],
            });
          }
          res.status(200).json({
            data: [data],
            message: "New blog was created.",
            status: statusS,
          });
        });
      });
    });
  }

  //update theo params
  updateBlog(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.id_blog),
    }

    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../public/uploads");
    form.keepExtensions = true;
    form.maxFieldsSize = 1 * 1024 * 1024;
    form.multiples = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.json({
          message: "Error 400. Update blog failed.",
          data: [],
          status: statusF,
        });
      }

      const { title, content, id_User, id_CategoryBlog } = fields;
      if (!title || !content || !id_User || !id_CategoryBlog) {
        return res.json({
          message:
            "Please input full information. Vui lòng nhập đủ các trường.",
          data: [],
          status: statusF,
        });
      }

      let conditionTitle = {
        title: title,
      };

      modelBlog.findOne(conditionTitle).exec((err, blogExisted) => {
        if (err) {
          return res.json({
            message: "Error: " + err,
            data: [],
            status: statusF,
          });
        }

        let data = {};
        const uploadFile = files["image"];
        if (uploadFile) {
          const indexOfPath = uploadFile.path.indexOf("uploads");
          const cutPath = uploadFile.path.slice(indexOfPath);

          const checkImage = cutPath.split(".")[1];
          if (checkImage) {
            if (!extensionImage.includes(checkImage)) {
              return res.json({
                status: statusF,
                data: [],
                message: `We just allow audio extension jpg, jpeg, bmp,gif, png`,
              });
            }
            data.image = `${localhost}${cutPath}`;
          }


          data = {
            ...fields,
            id_User: mongoose.Types.ObjectId(id_User),
            id_CategoryBlog: mongoose.Types.ObjectId(id_CategoryBlog),
          };
        } else {
          data = {
            ...fields
          }
        }


        modelBlog.findOneAndUpdate(condition, { $set: data }, { new: true }).exec((err, newData) => {
          if (err) {
            return res.json({
              status: statusF,
              data: [],
              message: "Update blog failed.",
            })
          }
          res.status(200).json({
            status: statusS,
            data: newData,
            message: "This blog was updated."
          })
        })
      });
    });
  }

  //xóa theo params
  removeBlog(req, res) {
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.id_blog),
    }

    modelBlog.findOneAndRemove(condition).exec((err) => {
      if (err) {
        return res.json({
          status: statusF,
          message: `We have few error: ${err}`
        })
      }

      res.status(200).json({
        status: statusS,
        data: [],
        message: "delete blog successfully"
      })
    })
  }
  checkpass(req, res) {
    let condition = {
      _id: mongoose.Types.ObjectId(req.params.id_blog),
    };
    modelBlog.findOneAndUpdate(condition, { status: true }, { new: true })
      .exec((err, newData) => {
        if (err) {
          return res.json({
            status: statusF,
            data: [],
            message: "Update blog failed",
          });
        }
      })

  }
}
module.exports = new blogController();
